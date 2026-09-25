"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const LocationErrors = require("../../api/errors/location-error.js");
const { normalizeName } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${LocationErrors.UC_CODE}update/unsupportedKeys`;

async function update(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("locationUpdateDtoInType", dtoIn);
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

  const name = normalizeName(dtoIn.name);
  if (!name) {
    throw new LocationErrors.InvalidDtoIn({ uuAppErrorMap });
  }

  const normalizedName = name.toLowerCase();
  const existing = await locationDao.getByNormalizedName(awid, normalizedName);
  if (existing && existing.id !== dtoIn.id) {
    throw new LocationErrors.LocationAlreadyExists({ uuAppErrorMap }, { name });
  }

  const updated = await locationDao.update({
    ...location,
    name,
    normalizedName,
  });

  return { ...updated, uuAppErrorMap };
}

module.exports = update;
