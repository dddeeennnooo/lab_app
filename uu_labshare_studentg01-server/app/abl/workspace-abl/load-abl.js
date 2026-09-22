"use strict";

const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const attachLab = require("./attach-lab.js");

async function load(uri, session, uuAppErrorMap = {}) {
  const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);
  return await attachLab(dtoOut, uri.getAwid());
}

module.exports = load;
