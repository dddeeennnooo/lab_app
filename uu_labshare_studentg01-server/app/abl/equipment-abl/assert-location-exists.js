"use strict";

const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const EquipmentErrors = require("../../api/errors/equipment-error.js");

async function assertLocationExists(awid, locationId, uuAppErrorMap) {
  const locationDao = DaoFactory.getDao("location");
  const location = await locationDao.get(awid, locationId);
  if (!location) {
    throw new EquipmentErrors.LocationDoesNotExist({ uuAppErrorMap }, { locationId });
  }
  return location;
}

module.exports = assertLocationExists;
