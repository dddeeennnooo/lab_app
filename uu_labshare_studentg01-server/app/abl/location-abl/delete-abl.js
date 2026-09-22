"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const LocationErrors = require("../../api/errors/location-error.js");

const UNSUPPORTED_KEYS_WARNING = `${LocationErrors.UC_CODE}delete/unsupportedKeys`;

async function deleteAbl(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const locationDao = DaoFactory.getDao("location");
  const equipmentDao = DaoFactory.getDao("equipment");

  let validationResult = validator.validate("locationDeleteDtoInType", dtoIn);
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

  const equipmentCount = await equipmentDao.countByLocationId(awid, dtoIn.id);
  if (equipmentCount > 0) {
    throw new LocationErrors.LocationIsUsed({ uuAppErrorMap }, { equipmentCount });
  }

  await locationDao.remove({ awid, id: dtoIn.id });
  return { uuAppErrorMap };
}

module.exports = deleteAbl;
