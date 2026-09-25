"use strict";

const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { AppClientTokenService, UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../../api/errors/labshare-student-error.js");
const { timeToMinutes } = require("../utils/abl-utils.js");
const { INIT_SCHEMAS, WARNINGS } = require("./workspace-constants.js");
const setProfile = require("./set-profile.js");

const logger = LoggerFactory.get("WorkspaceAbl");

async function init(uri, dtoIn, session) {
  const awid = uri.getAwid();
  const validator = Validator.load();
  const labDao = DaoFactory.getDao("labshareStudent");

  let validationResult = validator.validate("initDtoInType", dtoIn);
  let uuAppErrorMap = ValidationHelper.processValidationResult(
    dtoIn,
    validationResult,
    WARNINGS.initUnsupportedKeys.code,
    Errors.Init.InvalidDtoIn,
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

  if (await labDao.getByAwid(awid)) {
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
        callOpts,
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
      session,
    );
  }

  await setProfile(awid, "Authorities", dtoIn.uuAppProfileAuthorities, uuAppErrorMap);
  await setProfile(awid, "Executives", dtoIn.uuAppProfileExecutives, uuAppErrorMap);
  await setProfile(awid, "Readers", dtoIn.uuAppProfileReaders, uuAppErrorMap);

  const lab = await labDao.create({
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

module.exports = init;
