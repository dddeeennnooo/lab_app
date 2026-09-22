"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../../api/errors/reservation-error.js");
const generateId = require("../utils/generate-id.js");
const assertValidInterval = require("../utils/assert-valid-interval.js");
const hasOverlapWithBlockingReservations = require("../utils/has-overlap-with-blocking-reservations.js");
const unwrapList = require("../utils/unwrap-list.js");
const assertEquipmentExists = require("./assert-equipment-exists.js");

const UNSUPPORTED_KEYS_WARNING = `${ReservationErrors.UC_CODE}create/unsupportedKeys`;

async function create(uri, dtoIn, session) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const reservationDao = DaoFactory.getDao("reservation");

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

  await assertEquipmentExists(awid, dtoIn.equipmentId, uuAppErrorMap);

  const blockingList = unwrapList(await reservationDao.listBlockingByEquipmentId(awid, dtoIn.equipmentId));
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
