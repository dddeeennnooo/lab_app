"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const ReservationErrors = require("../../api/errors/reservation-error.js");
const assertReservationOwnerOrPrivileged = require("../utils/assert-reservation-owner-or-privileged.js");

const CANCELLABLE_STATES = ["requested", "active"];
const UNSUPPORTED_KEYS_WARNING = `${ReservationErrors.UC_CODE}cancel/unsupportedKeys`;

async function cancel(uri, dtoIn, session, authorizationResult) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const reservationDao = DaoFactory.getDao("reservation");

  let validationResult = validator.validate("reservationCancelDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    UNSUPPORTED_KEYS_WARNING,
    ReservationErrors.InvalidDtoIn,
  );

  const reservation = await reservationDao.get(awid, dtoIn.id);
  if (!reservation) {
    throw new ReservationErrors.ReservationDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
  }

  if (!CANCELLABLE_STATES.includes(reservation.state)) {
    throw new ReservationErrors.ReservationNotCancellable(
      { uuAppErrorMap },
      { id: dtoIn.id, state: reservation.state },
    );
  }

  assertReservationOwnerOrPrivileged(
    reservation,
    session,
    authorizationResult,
    ReservationErrors.NotAuthorized,
    uuAppErrorMap,
  );

  const updated = await reservationDao.update({
    ...reservation,
    state: "cancelled",
  });

  return { ...updated, uuAppErrorMap };
}

module.exports = cancel;
