"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const EquipmentErrors = require("../api/errors/equipment-error.js");
const { normalizeName, generateId, normalizePageInfo, escapeRegex } = require("./abl-utils.js");

const WARNINGS = {
  create: { unsupportedKeys: { code: `${EquipmentErrors.UC_CODE}create/unsupportedKeys` } },
  get: { unsupportedKeys: { code: `${EquipmentErrors.UC_CODE}get/unsupportedKeys` } },
  list: { unsupportedKeys: { code: `${EquipmentErrors.UC_CODE}list/unsupportedKeys` } },
  update: { unsupportedKeys: { code: `${EquipmentErrors.UC_CODE}update/unsupportedKeys` } },
  delete: { unsupportedKeys: { code: `${EquipmentErrors.UC_CODE}delete/unsupportedKeys` } },
};

class EquipmentAbl {
  constructor() {
    this.validator = Validator.load();
    this.equipmentDao = DaoFactory.getDao("equipment");
    this.locationDao = DaoFactory.getDao("location");
    this.reservationDao = DaoFactory.getDao("reservation");
  }

  async _assertLocationExists(awid, locationId, uuAppErrorMap) {
    const location = await this.locationDao.get(awid, locationId);
    if (!location) {
      throw new EquipmentErrors.LocationDoesNotExist({ uuAppErrorMap }, { locationId });
    }
    return location;
  }

  async create(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("equipmentCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.create.unsupportedKeys.code,
      EquipmentErrors.InvalidDtoIn
    );

    const name = normalizeName(dtoIn.name);
    if (!name) {
      throw new EquipmentErrors.InvalidDtoIn({ uuAppErrorMap });
    }

    await this._assertLocationExists(awid, dtoIn.locationId, uuAppErrorMap);

    const normalizedName = name.toLowerCase();
    if (await this.equipmentDao.getByNormalizedName(awid, normalizedName)) {
      throw new EquipmentErrors.EquipmentNameAlreadyExists({ uuAppErrorMap }, { name });
    }

    const equipment = await this.equipmentDao.create({
      awid,
      id: generateId("equipment-"),
      name,
      normalizedName,
      locationId: dtoIn.locationId,
    });

    return { ...equipment, uuAppErrorMap };
  }

  async get(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("equipmentGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.get.unsupportedKeys.code,
      EquipmentErrors.InvalidDtoIn
    );

    const equipment = await this.equipmentDao.get(awid, dtoIn.id);
    if (!equipment) {
      throw new EquipmentErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    return { ...equipment, uuAppErrorMap };
  }

  async list(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("equipmentListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.list.unsupportedKeys.code,
      EquipmentErrors.InvalidDtoIn
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

    const listResult = await this.equipmentDao.listByFilter(filter, pageInfo, sort);
    const itemList = Array.isArray(listResult) ? listResult : listResult.itemList;
    const total = await this.equipmentDao.countByFilter(filter);

    return {
      itemList,
      pageInfo: { ...pageInfo, total },
      uuAppErrorMap,
    };
  }

  async update(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("equipmentUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.update.unsupportedKeys.code,
      EquipmentErrors.InvalidDtoIn
    );

    const equipment = await this.equipmentDao.get(awid, dtoIn.id);
    if (!equipment) {
      throw new EquipmentErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    const next = { ...equipment };

    if (dtoIn.locationId !== undefined) {
      await this._assertLocationExists(awid, dtoIn.locationId, uuAppErrorMap);
      next.locationId = dtoIn.locationId;
    }

    if (dtoIn.name !== undefined) {
      const name = normalizeName(dtoIn.name);
      if (!name) {
        throw new EquipmentErrors.InvalidDtoIn({ uuAppErrorMap });
      }
      const normalizedName = name.toLowerCase();
      const existing = await this.equipmentDao.getByNormalizedName(awid, normalizedName);
      if (existing && existing.id !== dtoIn.id) {
        throw new EquipmentErrors.EquipmentNameAlreadyExists({ uuAppErrorMap }, { name });
      }
      next.name = name;
      next.normalizedName = normalizedName;
    }

    const updated = await this.equipmentDao.update(next);
    return { ...updated, uuAppErrorMap };
  }

  async delete(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("equipmentDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.delete.unsupportedKeys.code,
      EquipmentErrors.InvalidDtoIn
    );

    const equipment = await this.equipmentDao.get(awid, dtoIn.id);
    if (!equipment) {
      throw new EquipmentErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    const activeCount = await this.reservationDao.countActiveByEquipmentId(awid, dtoIn.id);
    if (activeCount > 0) {
      throw new EquipmentErrors.EquipmentHasActiveReservation({ uuAppErrorMap }, { id: dtoIn.id });
    }

    await this.equipmentDao.remove({ awid, id: dtoIn.id });
    return { uuAppErrorMap };
  }
}

module.exports = new EquipmentAbl();
