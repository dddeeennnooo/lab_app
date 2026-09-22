"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const LocationErrors = require("../../api/errors/location-error.js");

const UNSUPPORTED_KEYS_WARNING = `${LocationErrors.UC_CODE}get/unsupportedKeys`;

async function get(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("locationGetDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    LocationErrors.InvalidDtoIn,
  );

  const location = await locationDao.get(awid, dtoIn.id);
  if (!location) {
    throw new LocationErrors.LocationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
  }

  return { ...location, uuAppErrorMap };
}

module.exports = get;
