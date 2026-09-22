"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const LocationErrors = require("../../api/errors/location-error.js");
const normalizeName = require("../utils/normalize-name.js");
const generateId = require("../utils/generate-id.js");

const UNSUPPORTED_KEYS_WARNING = `${LocationErrors.UC_CODE}create/unsupportedKeys`;

async function create(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("locationCreateDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    LocationErrors.InvalidDtoIn,
  );

  const name = normalizeName(dtoIn.name);
  if (!name) {
    throw new LocationErrors.InvalidDtoIn({ uuAppErrorMap });
  }

  const normalizedName = name.toLowerCase();
  if (await locationDao.getByNormalizedName(awid, normalizedName)) {
    throw new LocationErrors.LocationAlreadyExists({ uuAppErrorMap }, { name });
  }

  const location = await locationDao.create({
    awid,
    id: generateId("location-"),
    name,
    normalizedName,
  });

  return { ...location, uuAppErrorMap };
}

module.exports = create;
