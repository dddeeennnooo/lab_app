"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/labshare-student-error.js");
const { timeToMinutes } = require("./abl-utils.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
  loadUnsupportedKeys: {
    code: `${Errors.Load.UC_CODE}unsupportedKeys`,
  },
};

const APP_NAME = "uuLabShare";
const ABOUT_DESCRIPTION = "Lab equipment sharing application";
const ABOUT_VENDOR = { code: "uu", name: "Unicorn" };
const logger = LoggerFactory.get("WorkspaceAbl");

const INIT_SCHEMAS = ["labshareStudent", "equipment", "location", "reservation"];

class WorkspaceAbl {
  constructor() {
    this.validator = Validator.load();
    this.labDao = DaoFactory.getDao("labshareStudent");
  }

  async _setProfile(awid, profile, roleUri, uuAppErrorMap) {
    if (!roleUri) return;
    try {
      await Profile.set(awid, profile, roleUri);
    } catch (e) {
      if (e instanceof UuAppWorkspaceError) {
        throw new Errors.Init.SetProfileFailed({ uuAppErrorMap }, { profile, role: roleUri }, e);
      }
      throw e;
    }
  }

  async _attachLab(dtoOut, awid) {
    const workspace = await UuAppWorkspace.get(awid);
    if (
      workspace.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
      workspace.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    ) {
      const lab = await this.labDao.getByAwid(awid);
      if (lab) {
        dtoOut.data = { ...lab, relatedObjectsMap: {} };
      }
    }
    return dtoOut;
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    if (timeToMinutes(dtoIn.openingHours.from) >= timeToMinutes(dtoIn.openingHours.to)) {
      throw new Errors.Init.InvalidOpeningHours({ uuAppErrorMap }, { openingHours: dtoIn.openingHours });
    }

    for (const schema of INIT_SCHEMAS) {
      try {
        await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    }

    if (await this.labDao.getByAwid(awid)) {
      throw new Errors.Init.LabAlreadyExists({ uuAppErrorMap }, { awid });
    }

    if (dtoIn.uuBtLocationUri) {
      const baseUri = uri.getBaseUri();
      const uuBtUriBuilder = UriBuilder.parse(dtoIn.uuBtLocationUri);
      const location = uuBtUriBuilder.getParameters().id;
      const uuBtBaseUri = uuBtUriBuilder.toUri().getBaseUri();

      const awscCreateUri = uuBtUriBuilder.setUseCase("uuAwsc/create").toUri();
      const appClientToken = await AppClientTokenService.createToken(uri, uuBtBaseUri);
      const callOpts = AppClientTokenService.setToken({ session }, appClientToken);

      let awscId;
      try {
        const awscDtoOut = await AppClient.post(
          awscCreateUri,
          {
            name: "UuLabshare",
            typeCode: "uu-labshare-studentg01",
            location,
            uuAppWorkspaceUri: baseUri,
          },
          callOpts
        );
        awscId = awscDtoOut.id;
      } catch (e) {
        if (e.code?.includes("applicationIsAlreadyConnected") && e.paramMap?.id) {
          logger.warn(`Awsc already exists id=${e.paramMap.id}.`, e);
          awscId = e.paramMap.id;
        } else {
          throw new Errors.Init.CreateAwscFailed({ uuAppErrorMap }, { location: dtoIn.uuBtLocationUri }, e);
        }
      }

      const artifactUri = uuBtUriBuilder.setUseCase(null).clearParameters().setParameter("id", awscId).toUri();
      await UuAppWorkspace.connectArtifact(
        baseUri,
        { artifactUri: artifactUri.toString(), synchronizeArtifactBasicAttributes: false },
        session
      );
    }

    await this._setProfile(awid, "Authorities", dtoIn.uuAppProfileAuthorities, uuAppErrorMap);
    await this._setProfile(awid, "Executives", dtoIn.uuAppProfileExecutives, uuAppErrorMap);
    await this._setProfile(awid, "Readers", dtoIn.uuAppProfileReaders, uuAppErrorMap);

    const lab = await this.labDao.create({
      awid,
      name: dtoIn.name.trim(),
      openingHours: dtoIn.openingHours,
    });

    await UuAppWorkspace.setActiveSysState(awid);
    const workspace = await UuAppWorkspace.get(awid);

    return {
      sysData: {
        relatedObjectsMap: {},
        awidData: { awid: workspace.awid, sysState: workspace.sysState },
      },
      lab,
      uuAppErrorMap,
    };
  }

  async load(uri, session, uuAppErrorMap = {}) {
    const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);
    return await this._attachLab(dtoOut, uri.getAwid());
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);
    return await this._attachLab(dtoOut, uri.getAwid());
  }

  async loadAbout(uri, dtoIn = {}) {
    const awid = uri.getAwid();

    let validationResult = this.validator.validate("loadDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.loadUnsupportedKeys.code,
      Errors.Load.InvalidDtoIn
    );

    let workspace = null;
    try {
      workspace = await UuAppWorkspace.get(awid);
    } catch (e) {
      logger.warn(`Workspace data are not available for awid=${awid}.`, e);
    }

    const lab = await this.labDao.getByAwid(awid);
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
}

module.exports = new WorkspaceAbl();
