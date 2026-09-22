"use strict";

function unwrapList(listResult) {
  return Array.isArray(listResult) ? listResult : listResult.itemList;
}

module.exports = unwrapList;
