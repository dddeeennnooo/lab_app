"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { toItemList, dropLegacyAwidIdIndex } = require("./dao-utils.js");

class LocationMongo extends UuObjectDao {
  async createSchema() {
    await dropLegacyAwidIdIndex(this);
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, normalizedName: 1 }, { unique: true });
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

  async list(awid, pageInfo, sort = { name: 1, id: 1 }) {
    return toItemList(await super.find({ awid }, pageInfo, sort));
  }

  async count(awid) {
    return await super.count({ awid });
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

module.exports = LocationMongo;
