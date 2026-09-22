"use strict";

function getUuIdentityProfileList(authorizationResult) {
  if (!authorizationResult || typeof authorizationResult.getUuIdentityProfileList !== "function") {
    return [];
  }
  return authorizationResult.getUuIdentityProfileList() || [];
}

module.exports = getUuIdentityProfileList;
