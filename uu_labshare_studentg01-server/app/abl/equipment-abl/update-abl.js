"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");
const { normalizeName } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}update/unsupportedKeys`;

async function update(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("equipmentUpdateDtoInType", dtoIn);
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

  const next = { ...equipment };

  if (dtoIn.locationId !== undefined) {
    if (!(await locationDao.get(awid, dtoIn.locationId))) {
      throw new EquipmentErrors.LocationDoesNotExist({ uuAppErrorMap }, { locationId: dtoIn.locationId });
    }
    next.locationId = dtoIn.locationId;
  }

  if (dtoIn.name !== undefined) {
    const name = normalizeName(dtoIn.name);
    if (!name) {
      throw new EquipmentErrors.InvalidDtoIn({ uuAppErrorMap });
    }
    const normalizedName = name.toLowerCase();
    const existing = await equipmentDao.getByNormalizedName(awid, normalizedName);
    if (existing && existing.id !== dtoIn.id) {
      throw new EquipmentErrors.EquipmentNameAlreadyExists({ uuAppErrorMap }, { name });
    }
    next.name = name;
    next.normalizedName = normalizedName;
  }

  const updated = await equipmentDao.update(next);
  return { ...updated, uuAppErrorMap };
}

module.exports = update;
