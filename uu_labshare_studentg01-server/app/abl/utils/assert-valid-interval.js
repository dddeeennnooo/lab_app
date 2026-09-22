"use strict";

function assertValidInterval(start, end) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs >= endMs) {
    return null;
  }
  return { startMs, endMs };
}

module.exports = assertValidInterval;
