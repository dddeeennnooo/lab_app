"use strict";

const hasPrivilegedProfile = require("./has-privileged-profile.js");

function assertReservationOwnerOrPrivileged(reservation, session, authorizationResult, errorClass, uuAppErrorMap) {
  if (hasPrivilegedProfile(authorizationResult)) {
    return;
  }
  const callerIdentity = session.getIdentity().getUuIdentity();
  if (reservation.uuIdentity !== callerIdentity) {
    throw new errorClass({ uuAppErrorMap }, { id: reservation.id });
  }
}

module.exports = assertReservationOwnerOrPrivileged;
