"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class EquipmentMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, normalizedName: 1 }, { unique: true });
    await super.createIndex({ awid: 1, locationId: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async getByNormalizedName(awid, normalizedName) {
    return await super.findOne({ awid, normalizedName });
  }
  async listByFilter(filter, pageInfo, sort) {
    return await super.find(filter, pageInfo, sort);
  }

  async countByFilter(filter) {
    return await super.count(filter);
  }

  async countByLocationId(awid, locationId) {
    return await super.count({ awid, locationId });
  }

  async update(uuObject) {
    return await super.findOneAndUpdate(
      { awid: uuObject.awid, id: uuObject.id },
      uuObject,
      "NONE"
    );
  }

  async remove(uuObject) {
    return await super.deleteOne({ awid: uuObject.awid, id: uuObject.id });
  }
}


module.exports = EquipmentMongo;
