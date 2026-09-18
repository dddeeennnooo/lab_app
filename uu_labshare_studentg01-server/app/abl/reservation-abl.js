"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../api/errors/reservation-error.js");
const {
  generateId,
  normalizePageInfo,
  assertValidInterval,
  hasOverlapWithBlockingReservations,
} = require("./abl-utils.js");
const { assertReservationOwnerOrPrivileged } = require("./abl-auth-utils.js");

const CANCELLABLE_STATES = ["requested", "active"];

const WARNINGS = {
  create: { unsupportedKeys: { code: `${ReservationErrors.UC_CODE}create/unsupportedKeys` } },
  get: { unsupportedKeys: { code: `${ReservationErrors.UC_CODE}get/unsupportedKeys` } },
  list: { unsupportedKeys: { code: `${ReservationErrors.UC_CODE}list/unsupportedKeys` } },
  cancel: { unsupportedKeys: { code: `${ReservationErrors.UC_CODE}cancel/unsupportedKeys` } },
};

class ReservationAbl {
  constructor() {
    this.validator = Validator.load();
    this.reservationDao = DaoFactory.getDao("reservation");
    this.equipmentDao = DaoFactory.getDao("equipment");
  }

  _unwrapList(listResult) {
    return Array.isArray(listResult) ? listResult : listResult.itemList;
  }

  async _assertEquipmentExists(awid, equipmentId, uuAppErrorMap) {
    const equipment = await this.equipmentDao.get(awid, equipmentId);
    if (!equipment) {
      throw new ReservationErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { equipmentId });
    }
    return equipment;
  }

  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("reservationCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.create.unsupportedKeys.code,
      ReservationErrors.InvalidDtoIn,
    );

    const intervalBounds = assertValidInterval(dtoIn.interval.start, dtoIn.interval.end);
    if (!intervalBounds) {
      throw new ReservationErrors.InvalidDtoIn({ uuAppErrorMap });
    }

    await this._assertEquipmentExists(awid, dtoIn.equipmentId, uuAppErrorMap);

    const blockingList = this._unwrapList(
      await this.reservationDao.listBlockingByEquipmentId(awid, dtoIn.equipmentId),
    );
    if (hasOverlapWithBlockingReservations(blockingList, intervalBounds.startMs, intervalBounds.endMs)) {
      throw new ReservationErrors.EquipmentNotAvailable(
        { uuAppErrorMap },
        { equipmentId: dtoIn.equipmentId },
      );
    }

    const uuIdentity = session.getIdentity().getUuIdentity();
    const reservation = await this.reservationDao.create({
      awid,
      id: generateId("reservation-"),
      equipmentId: dtoIn.equipmentId,
      interval: {
        start: new Date(dtoIn.interval.start).toISOString(),
        end: new Date(dtoIn.interval.end).toISOString(),
      },
      state: "requested",
      uuIdentity,
    });

    return { ...reservation, uuAppErrorMap };
  }

  async get(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("reservationGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.get.unsupportedKeys.code,
      ReservationErrors.InvalidDtoIn,
    );

    const reservation = await this.reservationDao.get(awid, dtoIn.id);
    if (!reservation) {
      throw new ReservationErrors.ReservationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    return { ...reservation, uuAppErrorMap };
  }

  async list(uri, dtoIn) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("reservationListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.list.unsupportedKeys.code,
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
    const listResult = await this.reservationDao.listByFilter(filter, pageInfo, sort);
    const itemList = this._unwrapList(listResult);
    const total = await this.reservationDao.countByFilter(filter);

    return {
      itemList,
      pageInfo: { ...pageInfo, total },
      uuAppErrorMap,
    };
  }

  async cancel(uri, dtoIn, session, authorizationResult) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("reservationCancelDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.cancel.unsupportedKeys.code,
      ReservationErrors.InvalidDtoIn,
    );

    const reservation = await this.reservationDao.get(awid, dtoIn.id);
    if (!reservation) {
      throw new ReservationErrors.ReservationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    if (!CANCELLABLE_STATES.includes(reservation.state)) {
      throw new ReservationErrors.ReservationNotCancellable({ uuAppErrorMap }, { id: dtoIn.id, state: reservation.state });
    }

    assertReservationOwnerOrPrivileged(
      reservation,
      session,
      authorizationResult,
      ReservationErrors.NotAuthorized,
      uuAppErrorMap,
    );

    const updated = await this.reservationDao.update({
      ...reservation,
      state: "cancelled",
    });

    return { ...updated, uuAppErrorMap };
  }
}

module.exports = new ReservationAbl();
