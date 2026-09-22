"use strict";

const PRIVILEGED_PROFILES = require("./privileged-profiles.js");
const getUuIdentityProfileList = require("./get-uu-identity-profile-list.js");

function hasPrivilegedProfile(authorizationResult) {
  const profiles = getUuIdentityProfileList(authorizationResult);
  return PRIVILEGED_PROFILES.some((profile) => profiles.includes(profile));
}

module.exports = hasPrivilegedProfile;
