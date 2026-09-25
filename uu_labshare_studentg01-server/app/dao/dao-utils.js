"use strict";

function toItemList(findResult) {
  return Array.isArray(findResult) ? findResult : findResult.itemList;
}

/** ObjectStore stores business id in _id; legacy schemas indexed missing field `id`. */
async function dropLegacyAwidIdIndex(dao) {
  try {
    await dao.dropIndex("awid_1_id_1");
  } catch {
    // Index already removed or never created.
  }
}

module.exports = { toItemList, dropLegacyAwidIdIndex };
