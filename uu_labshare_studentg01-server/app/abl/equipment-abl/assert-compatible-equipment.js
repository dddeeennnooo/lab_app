"use strict";

const EquipmentErrors = require("../../api/errors/equipment-error.js");

async function assertCompatibleEquipmentIds(awid, equipmentId, compatibleIdList, equipmentDao, uuAppErrorMap) {
  if (!compatibleIdList || !compatibleIdList.length) {
    return;
  }
  const unique = [...new Set(compatibleIdList)];
  for (const otherId of unique) {
    if (equipmentId && otherId === equipmentId) {
      throw new EquipmentErrors.InvalidDtoIn({ uuAppErrorMap });
    }
    if (!(await equipmentDao.get(awid, otherId))) {
      throw new EquipmentErrors.CompatibleEquipmentDoesNotExist({ uuAppErrorMap }, { equipmentId: otherId });
    }
  }
}

module.exports = assertCompatibleEquipmentIds;
