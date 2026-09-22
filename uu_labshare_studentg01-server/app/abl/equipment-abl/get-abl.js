"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}get/unsupportedKeys`;

async function get(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");

  let validationResult = validator.validate("equipmentGetDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    EquipmentErrors.InvalidDtoIn,
  );

  const equipment = await equipmentDao.get(awid, dtoIn.id);
  if (!equipment) {
    throw new EquipmentErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
  }

  return { ...equipment, uuAppErrorMap };
}

module.exports = get;
