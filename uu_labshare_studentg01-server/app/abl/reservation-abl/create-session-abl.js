"use strict";

/**
 * Session packing uses greedy nearest-neighbor on location map coordinates (mapX/mapY).
 * This is not optimal: e.g. three items at (0,0), (10,0), (5,5) with equal types may pick
 * (0,0) and (10,0) before (5,5) even though a lower-tour-cost pairing exists.
 */

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../../api/errors/reservation-error.js");
const {
  generateId,
  assertValidInterval,
  hasOverlapWithBlockingReservations,
} = require("../utils/abl-utils.js");
const { walkingCostBetweenLocations } = require("../utils/walking-cost.js");
const { equipmentId: resolveEquipmentId } = require("../utils/equipment-compatibility.js");

const UNSUPPORTED_KEYS_WARNING = `${ReservationErrors.UC_CODE}createSession/unsupportedKeys`;

function requirementKey(requirement, index) {
  return requirement.equipmentId || requirement.equipmentType || `req-${index}`;
}

async function buildCandidates(awid, requirement, equipmentList, intervalBounds, reservationDao) {
  const freeEquipment = [];
  for (const equipment of equipmentList) {
    const currentId = resolveEquipmentId(equipment);
    if (!currentId) {
      continue;
    }
    if (requirement.equipmentId && currentId !== String(requirement.equipmentId)) {
      continue;
    }
    if (requirement.equipmentType && equipment.equipmentType !== requirement.equipmentType) {
      continue;
    }
    const blockingList = await reservationDao.listBlockingByEquipmentId(awid, currentId);
    if (
      !hasOverlapWithBlockingReservations(
        blockingList,
        intervalBounds.startMs,
        intervalBounds.endMs,
      )
    ) {
      freeEquipment.push(equipment);
    }
  }
  return freeEquipment;
}

function pickAssignment(requirements, candidateMap, locationById) {
  const ordered = requirements
    .map((req, index) => ({ req, index, candidates: candidateMap.get(requirementKey(req, index)) || [] }))
    .sort((a, b) => a.candidates.length - b.candidates.length);

  const usedEquipmentIds = new Set();
  const assignment = new Map();
  const chosenLocations = [];

  for (const { req, index, candidates } of ordered) {
    let best = null;
    let bestCost = Infinity;
    for (const equipment of candidates) {
      const candidateId = resolveEquipmentId(equipment);
      if (!candidateId || usedEquipmentIds.has(candidateId)) {
        continue;
      }
      const location = locationById.get(equipment.locationId);
      let cost = 0;
      if (chosenLocations.length) {
        cost = Math.min(...chosenLocations.map((loc) => walkingCostBetweenLocations(loc, location)));
      }
      if (cost < bestCost || (cost === bestCost && (!best || candidateId < resolveEquipmentId(best)))) {
        bestCost = cost;
        best = equipment;
      }
    }
    if (!best) {
      return null;
    }
    usedEquipmentIds.add(resolveEquipmentId(best));
    assignment.set(index, best);
    chosenLocations.push(locationById.get(best.locationId));
  }

  return assignment;
}

async function createSession(uri, dtoIn, session) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const reservationDao = DaoFactory.getDao("reservation");
  const equipmentDao = DaoFactory.getDao("equipment");
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("reservationCreateSessionDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    ReservationErrors.InvalidDtoIn,
  );

  const intervalBounds = assertValidInterval(dtoIn.interval.start, dtoIn.interval.end);
  if (!intervalBounds) {
    throw new ReservationErrors.InvalidDtoIn({ uuAppErrorMap });
  }

  for (const requirement of dtoIn.requirementList) {
    const hasId = Boolean(requirement.equipmentId);
    const hasType = Boolean(requirement.equipmentType);
    if ((hasId && hasType) || (!hasId && !hasType)) {
      throw new ReservationErrors.InvalidRequirement({ uuAppErrorMap });
    }
    if (hasId && !(await equipmentDao.get(awid, requirement.equipmentId))) {
      throw new ReservationErrors.EquipmentDoesNotExist(
        { uuAppErrorMap },
        { equipmentId: requirement.equipmentId },
      );
    }
  }

  const equipmentList = await equipmentDao.listAllByAwid(awid);
  const locations = await locationDao.list(awid, { pageIndex: 0, pageSize: 10000 });
  const locationById = new Map(locations.map((loc) => [loc.id, loc]));

  const candidateMap = new Map();
  for (let i = 0; i < dtoIn.requirementList.length; i++) {
    const req = dtoIn.requirementList[i];
    candidateMap.set(
      requirementKey(req, i),
      await buildCandidates(awid, req, equipmentList, intervalBounds, reservationDao),
    );
  }

  const assignment = pickAssignment(dtoIn.requirementList, candidateMap, locationById);
  if (!assignment) {
    throw new ReservationErrors.SessionCannotBeSatisfied({ uuAppErrorMap });
  }

  const uuIdentity = session.getIdentity().getUuIdentity();
  const sessionId = generateId("session-");
  const created = [];
  try {
    for (let i = 0; i < dtoIn.requirementList.length; i++) {
      const equipment = assignment.get(i);
      const reservation = await reservationDao.create({
        awid,
        equipmentId: resolveEquipmentId(equipment),
        interval: {
          start: new Date(dtoIn.interval.start).toISOString(),
          end: new Date(dtoIn.interval.end).toISOString(),
        },
        state: "requested",
        uuIdentity,
        sessionId,
      });
      created.push(reservation);
    }
  } catch (e) {
    for (const reservation of created) {
      await reservationDao.remove({ awid, id: reservation.id });
    }
    throw e;
  }

  return {
    sessionId: created[0].sessionId,
    itemList: created,
    uuAppErrorMap,
  };
}

module.exports = createSession;
