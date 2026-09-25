"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");
const { normalizeName, generateId } = require("../utils/abl-utils.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}create/unsupportedKeys`;

async function create(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");
  const locationDao = DaoFactory.getDao("location");

  let validationResult = validator.validate("equipmentCreateDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    EquipmentErrors.InvalidDtoIn,
  );

  const name = normalizeName(dtoIn.name);
  if (!name) {
    throw new EquipmentErrors.InvalidDtoIn({ uuAppErrorMap });
  }

  if (!(await locationDao.get(awid, dtoIn.locationId))) {
    throw new EquipmentErrors.LocationDoesNotExist({ uuAppErrorMap }, { locationId: dtoIn.locationId });
  }

  const normalizedName = name.toLowerCase();
  if (await equipmentDao.getByNormalizedName(awid, normalizedName)) {
    throw new EquipmentErrors.EquipmentNameAlreadyExists({ uuAppErrorMap }, { name });
  }

  const equipment = await equipmentDao.create({
    awid,
    id: generateId("equipment-"),
    name,
    normalizedName,
    locationId: dtoIn.locationId,
  });

  return { ...equipment, uuAppErrorMap };
}

module.exports = create;
