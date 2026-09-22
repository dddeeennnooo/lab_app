"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../../api/errors/equipment-error.js");
const normalizeName = require("../utils/normalize-name.js");
const generateId = require("../utils/generate-id.js");
const assertLocationExists = require("./assert-location-exists.js");

const UNSUPPORTED_KEYS_WARNING = `${EquipmentErrors.UC_CODE}create/unsupportedKeys`;

async function create(uri, dtoIn) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const equipmentDao = DaoFactory.getDao("equipment");

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

  await assertLocationExists(awid, dtoIn.locationId, uuAppErrorMap);

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
