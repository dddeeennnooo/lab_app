"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}delete/unsupportedKeys`;

async function deleteAbl(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");
  const reservationDao = DaoFactory.getDao("reservation");

  let validationResult = validator.validate("equipmentDeleteDtoInType", dtoIn);
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

  const activeCount = await reservationDao.countActiveByEquipmentId(awid, dtoIn.id);
  if (activeCount > 0) {
    throw new EquipmentErrors.EquipmentHasActiveReservation({ uuAppErrorMap }, { id: dtoIn.id });
  }

  await equipmentDao.remove({ awid, id: dtoIn.id });
  return { uuAppErrorMap };
}

module.exports = deleteAbl;
