"use strict";

const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/labshare-student-error.js");

async function setProfile(awid, profile, roleUri, uuAppErrorMap) {
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

module.exports = setProfile;
