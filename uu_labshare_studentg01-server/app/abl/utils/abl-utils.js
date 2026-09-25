"use strict";

const DEFAULT_PAGE_SIZE = 20;
const PRIVILEGED_PROFILES = ["Executives", "Authorities", "AwidLicenseOwner"];

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function generateId(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function normalizePageInfo(pageInfo) {
  const pageIndex = Number.isInteger(pageInfo?.pageIndex) && pageInfo.pageIndex >= 0 ? pageInfo.pageIndex : 0;
  const pageSize = Number.isInteger(pageInfo?.pageSize) && pageInfo.pageSize > 0 ? pageInfo.pageSize : DEFAULT_PAGE_SIZE;
  return { pageIndex, pageSize };
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function assertValidInterval(start, end) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs >= endMs) {
    return null;
  }
  return { startMs, endMs };
}

/** Half-open intervals [start, end). */
function hasOverlapWithBlockingReservations(blockingList, startMs, endMs) {
  const sorted = [...blockingList].sort(
    (a, b) => new Date(a.interval.start).getTime() - new Date(b.interval.start).getTime(),
  );
  for (const reservation of sorted) {
    const otherStart = new Date(reservation.interval.start).getTime();
    const otherEnd = new Date(reservation.interval.end).getTime();
    if (startMs < otherEnd && otherStart < endMs) {
      return true;
    }
  }
  return false;
}

function assertReservationOwnerOrPrivileged(reservation, session, authorizationResult, errorClass, uuAppErrorMap) {
  const profiles =
    authorizationResult && typeof authorizationResult.getUuIdentityProfileList === "function"
      ? authorizationResult.getUuIdentityProfileList() || []
      : [];
  if (PRIVILEGED_PROFILES.some((profile) => profiles.includes(profile))) {
    return;
  }
  const callerIdentity = session.getIdentity().getUuIdentity();
  if (reservation.uuIdentity !== callerIdentity) {
    throw new errorClass({ uuAppErrorMap }, { id: reservation.id });
  }
}

module.exports = {
  normalizeName,
  generateId,
  normalizePageInfo,
  escapeRegex,
  timeToMinutes,
  assertValidInterval,
  hasOverlapWithBlockingReservations,
  assertReservationOwnerOrPrivileged,
};
