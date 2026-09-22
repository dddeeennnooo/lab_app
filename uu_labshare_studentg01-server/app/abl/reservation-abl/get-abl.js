"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../../api/errors/reservation-error.js");

const UNSUPPORTED_KEYS_WARNING = `${ReservationErrors.UC_CODE}get/unsupportedKeys`;

async function get(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const reservationDao = DaoFactory.getDao("reservation");

  let validationResult = validator.validate("reservationGetDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    ReservationErrors.InvalidDtoIn,
  );

  const reservation = await reservationDao.get(awid, dtoIn.id);
  if (!reservation) {
    throw new ReservationErrors.ReservationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
  }

  return { ...reservation, uuAppErrorMap };
}

module.exports = get;
