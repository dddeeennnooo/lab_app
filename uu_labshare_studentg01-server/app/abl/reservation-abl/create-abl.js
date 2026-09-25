"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../../api/errors/reservation-error.js");
const { generateId, assertValidInterval, hasOverlapWithBlockingReservations } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${ReservationErrors.UC_CODE}create/unsupportedKeys`;

async function create(uri, dtoIn, session) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const reservationDao = DaoFactory.getDao("reservation");
  const equipmentDao = DaoFactory.getDao("equipment");

  let validationResult = validator.validate("reservationCreateDtoInType", dtoIn);
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

  if (!(await equipmentDao.get(awid, dtoIn.equipmentId))) {
    throw new ReservationErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { equipmentId: dtoIn.equipmentId });
  }

  const blockingList = await reservationDao.listBlockingByEquipmentId(awid, dtoIn.equipmentId);
  if (hasOverlapWithBlockingReservations(blockingList, intervalBounds.startMs, intervalBounds.endMs)) {
    throw new ReservationErrors.EquipmentNotAvailable({ uuAppErrorMap }, { equipmentId: dtoIn.equipmentId });
  }

  const uuIdentity = session.getIdentity().getUuIdentity();
  const reservation = await reservationDao.create({
    awid,
    id: generateId("reservation-"),
    equipmentId: dtoIn.equipmentId,
    interval: {
      start: new Date(dtoIn.interval.start).toISOString(),
      end: new Date(dtoIn.interval.end).toISOString(),
    },
    state: "requested",
    uuIdentity,
  });

  return { ...reservation, uuAppErrorMap };
}

module.exports = create;
