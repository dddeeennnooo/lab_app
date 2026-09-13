"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ReservationMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, equipmentId: 1, state: 1 });
  }

  async countActiveByEquipmentId(awid, equipmentId) {
    return await super.count({ awid, equipmentId, state: "active" });
  }
}

module.exports = ReservationMongo;
