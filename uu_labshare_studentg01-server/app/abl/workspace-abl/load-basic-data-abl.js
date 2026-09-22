"use strict";

const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const attachLab = require("./attach-lab.js");

async function loadBasicData(uri, session, uuAppErrorMap = {}) {
  const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);
  return await attachLab(dtoOut, uri.getAwid());
}

module.exports = loadBasicData;
