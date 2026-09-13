"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const LocationErrors = require("../api/errors/location-error.js");
const { normalizeName, generateId, normalizePageInfo } = require("./abl-utils.js");

const WARNINGS = {
  create: { unsupportedKeys: { code: `${LocationErrors.UC_CODE}create/unsupportedKeys` } },
  get: { unsupportedKeys: { code: `${LocationErrors.UC_CODE}get/unsupportedKeys` } },
  list: { unsupportedKeys: { code: `${LocationErrors.UC_CODE}list/unsupportedKeys` } },
  update: { unsupportedKeys: { code: `${LocationErrors.UC_CODE}update/unsupportedKeys` } },
  delete: { unsupportedKeys: { code: `${LocationErrors.UC_CODE}delete/unsupportedKeys` } },
};

class LocationAbl {
  constructor() {
    this.validator = Validator.load();
    this.locationDao = DaoFactory.getDao("location");
    this.equipmentDao = DaoFactory.getDao("equipment");
  }

  async create(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("locationCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.create.unsupportedKeys.code,
      LocationErrors.InvalidDtoIn
    );

    const name = normalizeName(dtoIn.name);
    if (!name) {
      throw new LocationErrors.InvalidDtoIn({ uuAppErrorMap });
    }

    const normalizedName = name.toLowerCase();
    if (await this.locationDao.getByNormalizedName(awid, normalizedName)) {
      throw new LocationErrors.LocationAlreadyExists({ uuAppErrorMap }, { name });
    }

    const location = await this.locationDao.create({
      awid,
      id: generateId("location-"),
      name,
      normalizedName,
    });

    return { ...location, uuAppErrorMap };
  }

  async get(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("locationGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.get.unsupportedKeys.code,
      LocationErrors.InvalidDtoIn
    );

    const location = await this.locationDao.get(awid, dtoIn.id);
    if (!location) {
      throw new LocationErrors.LocationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    return { ...location, uuAppErrorMap };
  }

  async list(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("locationListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.list.unsupportedKeys.code,
      LocationErrors.InvalidDtoIn
    );

    const pageInfo = normalizePageInfo(dtoIn.pageInfo);
    const listResult = await this.locationDao.list(awid, pageInfo, { name: 1, id: 1 });
    const itemList = Array.isArray(listResult) ? listResult : listResult.itemList;
    const total = await this.locationDao.count(awid);

    return {
      itemList,
      pageInfo: { ...pageInfo, total },
      uuAppErrorMap,
    };
  }

  async update(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("locationUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.update.unsupportedKeys.code,
      LocationErrors.InvalidDtoIn
    );

    const location = await this.locationDao.get(awid, dtoIn.id);
    if (!location) {
      throw new LocationErrors.LocationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    const name = normalizeName(dtoIn.name);
    if (!name) {
      throw new LocationErrors.InvalidDtoIn({ uuAppErrorMap });
    }

    const normalizedName = name.toLowerCase();
    const existing = await this.locationDao.getByNormalizedName(awid, normalizedName);
    if (existing && existing.id !== dtoIn.id) {
      throw new LocationErrors.LocationAlreadyExists({ uuAppErrorMap }, { name });
    }

    const updated = await this.locationDao.update({
      ...location,
      name,
      normalizedName,
    });

    return { ...updated, uuAppErrorMap };
  }

  async delete(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("locationDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.delete.unsupportedKeys.code,
      LocationErrors.InvalidDtoIn
    );

    const location = await this.locationDao.get(awid, dtoIn.id);
    if (!location) {
      throw new LocationErrors.LocationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    const equipmentCount = await this.equipmentDao.countByLocationId(awid, dtoIn.id);
    if (equipmentCount > 0) {
      throw new LocationErrors.LocationIsUsed({ uuAppErrorMap }, { equipmentCount });
    }

    await this.locationDao.remove({ awid, id: dtoIn.id });
    return { uuAppErrorMap };
  }
}

module.exports = new LocationAbl();
