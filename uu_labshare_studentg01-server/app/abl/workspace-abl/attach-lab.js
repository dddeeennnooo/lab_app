"use strict";

const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;

async function attachLab(dtoOut, awid) {
  const workspace = await UuAppWorkspace.get(awid);
  if (
    workspace.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
    workspace.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
  ) {
    const labDao = DaoFactory.getDao("labshareStudent");
    const lab = await labDao.getByAwid(awid);
    if (lab) {
      dtoOut.data = { ...lab, relatedObjectsMap: {} };
    }
  }
  return dtoOut;
}

module.exports = attachLab;
