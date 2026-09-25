"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const LocationErrors = require("../../api/errors/location-error.js");
const { normalizePageInfo } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${LocationErrors.UC_CODE}list/unsupportedKeys`;

async function list(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("locationListDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    LocationErrors.InvalidDtoIn,
  );

  const pageInfo = normalizePageInfo(dtoIn.pageInfo);
  const itemList = await locationDao.list(awid, pageInfo, { name: 1, id: 1 });
  const total = await locationDao.count(awid);

  return {
    itemList,
    pageInfo: { ...pageInfo, total },
    uuAppErrorMap,
  };
}

module.exports = list;
