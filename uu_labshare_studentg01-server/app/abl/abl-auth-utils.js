"use strict";

const PRIVILEGED_PROFILES = ["Executives", "Authorities", "AwidLicenseOwner"];

function getUuIdentityProfileList(authorizationResult) {
  if (!authorizationResult || typeof authorizationResult.getUuIdentityProfileList !== "function") {
    return [];
  }
  return authorizationResult.getUuIdentityProfileList() || [];
}

function hasPrivilegedProfile(authorizationResult) {
  const profiles = getUuIdentityProfileList(authorizationResult);
  return PRIVILEGED_PROFILES.some((profile) => profiles.includes(profile));
}

function assertReservationOwnerOrPrivileged(reservation, session, authorizationResult, errorClass, uuAppErrorMap) {
  if (hasPrivilegedProfile(authorizationResult)) {
    return;
  }
  const callerIdentity = session.getIdentity().getUuIdentity();
  if (reservation.uuIdentity !== callerIdentity) {
    throw new errorClass({ uuAppErrorMap }, { id: reservation.id });
  }
}

module.exports = {
  PRIVILEGED_PROFILES,
  getUuIdentityProfileList,
  hasPrivilegedProfile,
  assertReservationOwnerOrPrivileged,
};
