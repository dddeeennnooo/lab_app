"use strict";

function toItemList(findResult) {
  return Array.isArray(findResult) ? findResult : findResult.itemList;
}

/** ObjectStore may expose business id as `id` or only as `_id` depending on load path. */
function withBusinessId(uuObject) {
  if (!uuObject) {
    return uuObject;
  }
  if (uuObject.id != null) {
    return { ...uuObject, id: String(uuObject.id) };
  }
  if (uuObject._id != null) {
    return { ...uuObject, id: String(uuObject._id) };
  }
  return uuObject;
}

function withBusinessIdList(itemList) {
  return (itemList || []).map((item) => withBusinessId(item));
}

/** ObjectStore stores business id in _id; legacy schemas indexed missing field `id`. */
async function dropLegacyAwidIdIndex(dao) {
  try {
    await dao.dropIndex("awid_1_id_1");
  } catch {
    // Index already removed or never created.
  }
}

module.exports = { toItemList, withBusinessId, withBusinessIdList, dropLegacyAwidIdIndex };
