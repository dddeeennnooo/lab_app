"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const Errors = require("../../api/errors/labshare-student-error.js");
const { APP_NAME, ABOUT_DESCRIPTION, ABOUT_VENDOR, WARNINGS } = require("./workspace-constants.js");

const logger = LoggerFactory.get("WorkspaceAbl");

async function loadAbout(uri, dtoIn = {}) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const labDao = DaoFactory.getDao("labshareStudent");

  let validationResult = validator.validate("loadDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    WARNINGS.loadUnsupportedKeys.code,
    Errors.Load.InvalidDtoIn,
  );

  let workspace = null;
  try {
    workspace = await UuAppWorkspace.get(awid);
  } catch (e) {
    logger.warn(`Workspace data are not available for awid=${awid}.`, e);
  }

  const lab = await labDao.getByAwid(awid);
  const labName = lab?.name && !String(lab.name).includes("{") ? lab.name.trim() : "";

  return {
    awid,
    sysState: workspace?.sysState,
    name: labName || workspace?.name || APP_NAME,
    appName: APP_NAME,
    description: ABOUT_DESCRIPTION,
    vendor: ABOUT_VENDOR,
    productLicenseList: [],
    customDataMap: lab ? { openingHours: lab.openingHours } : {},
    uuAppErrorMap,
  };
}

module.exports = loadAbout;
