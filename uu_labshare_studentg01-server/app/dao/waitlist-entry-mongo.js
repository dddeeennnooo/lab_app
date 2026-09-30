"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { toItemList, dropLegacyAwidIdIndex } = require("./dao-utils.js");

class WaitlistEntryMongo extends UuObjectDao {
  async createSchema() {
    await dropLegacyAwidIdIndex(this);
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, equipmentId: 1, state: 1 });
    await super.createIndex({ awid: 1, uuIdentity: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async listByFilter(filter, pageInfo, sort) {
    return toItemList(await super.find(filter, pageInfo, sort));
  }

  async countByFilter(filter) {
    return await super.count(filter);
  }

  async listWaitingByEquipmentId(awid, equipmentId) {
    return toItemList(
      await super.find({ awid, equipmentId, state: "waiting" }, { pageIndex: 0, pageSize: 1000 }),
    );
  }

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, id: uuObject.id }, uuObject, "NONE");
  }
}

module.exports = WaitlistEntryMongo;
