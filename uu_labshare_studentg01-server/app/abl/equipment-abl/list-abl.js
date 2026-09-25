"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");
const { normalizeName, normalizePageInfo, escapeRegex } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}list/unsupportedKeys`;

async function list(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");

  let validationResult = validator.validate("equipmentListDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    EquipmentErrors.InvalidDtoIn,
  );

  const pageInfo = normalizePageInfo(dtoIn.pageInfo);
  const filter = { awid };

  const nameQuery = normalizeName(dtoIn.name);
  if (nameQuery) {
    filter.name = { $regex: escapeRegex(nameQuery), $options: "i" };
  }
  if (dtoIn.locationId) {
    filter.locationId = dtoIn.locationId;
  }

  const sortField = dtoIn.sortBy === "sys.cts" ? "sys.cts" : "name";
  const sortOrder = dtoIn.order === "desc" ? -1 : 1;
  const sort = { [sortField]: sortOrder, id: 1 };

  const itemList = await equipmentDao.listByFilter(filter, pageInfo, sort);
  const total = await equipmentDao.countByFilter(filter);

  return {
    itemList,
    pageInfo: { ...pageInfo, total },
    uuAppErrorMap,
  };
}

module.exports = list;
