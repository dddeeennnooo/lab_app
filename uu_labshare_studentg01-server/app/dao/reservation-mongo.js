"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ReservationMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, equipmentId: 1, state: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async listByFilter(filter, pageInfo, sort) {
    return await super.find(filter, pageInfo, sort);
  }

  async countByFilter(filter) {
    return await super.count(filter);
  }

  async listBlockingByEquipmentId(awid, equipmentId) {
    return await super.find({ awid, equipmentId, state: { $in: ["requested", "active"] } });
  }

  async countActiveByEquipmentId(awid, equipmentId) {
    return await super.count({ awid, equipmentId, state: "active" });
  }

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, id: uuObject.id }, uuObject, "NONE");
  }
}

module.exports = ReservationMongo;
