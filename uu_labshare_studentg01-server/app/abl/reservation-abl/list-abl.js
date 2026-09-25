"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../../api/errors/reservation-error.js");
const { normalizePageInfo } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${ReservationErrors.UC_CODE}list/unsupportedKeys`;

async function list(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const reservationDao = DaoFactory.getDao("reservation");

  let validationResult = validator.validate("reservationListDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    ReservationErrors.InvalidDtoIn,
  );

  const pageInfo = normalizePageInfo(dtoIn.pageInfo);
  const filter = { awid };

  if (dtoIn.equipmentId) {
    filter.equipmentId = dtoIn.equipmentId;
  }
  if (dtoIn.state) {
    filter.state = dtoIn.state;
  }

  const sort = { "interval.start": 1, id: 1 };
  const itemList = await reservationDao.listByFilter(filter, pageInfo, sort);
  const total = await reservationDao.countByFilter(filter);

  return {
    itemList,
    pageInfo: { ...pageInfo, total },
    uuAppErrorMap,
  };
}

module.exports = list;
