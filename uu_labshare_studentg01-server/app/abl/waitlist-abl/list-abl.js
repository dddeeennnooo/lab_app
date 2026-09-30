"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const WaitlistErrors = require("../../api/errors/waitlist-error.js");
const { normalizePageInfo } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${WaitlistErrors.UC_CODE}list/unsupportedKeys`;

async function list(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const waitlistDao = DaoFactory.getDao("waitlistEntry");

  let validationResult = validator.validate("waitlistListDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    WaitlistErrors.InvalidDtoIn,
  );

  const pageInfo = normalizePageInfo(dtoIn.pageInfo);
  const filter = { awid };

  if (dtoIn.equipmentId) {
    filter.equipmentId = dtoIn.equipmentId;
  }
  if (dtoIn.state) {
    filter.state = dtoIn.state;
  }

  const sort = { enqueuedAt: 1, id: 1 };
  const itemList = await waitlistDao.listByFilter(filter, pageInfo, sort);
  const total = await waitlistDao.countByFilter(filter);

  return {
    itemList,
    pageInfo: { ...pageInfo, total },
    uuAppErrorMap,
  };
}

module.exports = list;
