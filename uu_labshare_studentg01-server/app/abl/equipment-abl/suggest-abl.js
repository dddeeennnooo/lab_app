"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");
const { assertValidInterval, hasOverlapWithBlockingReservations } = require("../utils/abl-utils.js");
const { equipmentId, buildAdjacency, bfsDistances } = require("../utils/equipment-compatibility.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}suggest/unsupportedKeys`;

async function suggest(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");
  const reservationDao = DaoFactory.getDao("reservation");

  let validationResult = validator.validate("equipmentSuggestDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    EquipmentErrors.InvalidDtoIn,
  );

  const intervalBounds = assertValidInterval(dtoIn.interval.start, dtoIn.interval.end);
  if (!intervalBounds) {
    throw new EquipmentErrors.InvalidDtoIn({ uuAppErrorMap });
  }

  const source = await equipmentDao.get(awid, dtoIn.equipmentId);
  if (!source) {
    throw new EquipmentErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { id: dtoIn.equipmentId });
  }

  const equipmentList = await equipmentDao.listAllByAwid(awid);
  const { adjacency } = buildAdjacency(equipmentList);
  const sourceId = String(dtoIn.equipmentId);
  const distances = bfsDistances(sourceId, adjacency);

  const candidates = [];
  for (const equipment of equipmentList) {
    const currentId = equipmentId(equipment);
    if (!currentId || currentId === sourceId) {
      continue;
    }
    if (!distances.has(currentId)) {
      continue;
    }
    const blockingList = await reservationDao.listBlockingByEquipmentId(awid, currentId);
    if (
      hasOverlapWithBlockingReservations(
        blockingList,
        intervalBounds.startMs,
        intervalBounds.endMs,
      )
    ) {
      continue;
    }
    const pastBookings = await reservationDao.listReturnedByEquipmentId(awid, currentId);
    candidates.push({
      equipment,
      distance: distances.get(currentId),
      pastBookingCount: pastBookings.length,
    });
  }

  candidates.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.pastBookingCount - b.pastBookingCount;
  });

  return {
    itemList: candidates.map((c) => ({
      equipmentId: equipmentId(c.equipment),
      name: c.equipment.name,
      locationId: c.equipment.locationId,
      distance: c.distance,
      pastBookingCount: c.pastBookingCount,
    })),
    uuAppErrorMap,
  };
}

module.exports = suggest;
