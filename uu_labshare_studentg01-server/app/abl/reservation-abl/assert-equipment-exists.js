"use strict";

const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ReservationErrors = require("../../api/errors/reservation-error.js");

async function assertEquipmentExists(awid, equipmentId, uuAppErrorMap) {
  const equipmentDao = DaoFactory.getDao("equipment");
  const equipment = await equipmentDao.get(awid, equipmentId);
  if (!equipment) {
    throw new ReservationErrors.EquipmentDoesNotExist({ uuAppErrorMap }, { equipmentId });
  }
  return equipment;
}

module.exports = assertEquipmentExists;
