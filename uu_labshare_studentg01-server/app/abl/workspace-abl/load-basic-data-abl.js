"use strict";

const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const attachLab = require("./attach-lab.js");
const { attachPlus4u5LocalNavigation } = require("./plus4u5-local-navigation.js");

async function loadBasicData(uri, session, uuAppErrorMap = {}) {
  const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);
  await attachLab(dtoOut, uri.getAwid());
  return attachPlus4u5LocalNavigation(dtoOut, uri.getBaseUri());
}

module.exports = loadBasicData;
