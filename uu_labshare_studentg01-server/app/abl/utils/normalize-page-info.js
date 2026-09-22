"use strict";

const DEFAULT_PAGE_SIZE = 20;

function normalizePageInfo(pageInfo) {
  const pageIndex = Number.isInteger(pageInfo?.pageIndex) && pageInfo.pageIndex >= 0 ? pageInfo.pageIndex : 0;
  const pageSize = Number.isInteger(pageInfo?.pageSize) && pageInfo.pageSize > 0 ? pageInfo.pageSize : DEFAULT_PAGE_SIZE;
  return { pageIndex, pageSize };
}

module.exports = normalizePageInfo;
