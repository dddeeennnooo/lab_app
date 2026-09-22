"use strict";

const halfOpenIntervalsOverlap = require("./half-open-intervals-overlap.js");

function hasOverlapWithBlockingReservations(blockingList, startMs, endMs) {
  const sorted = [...blockingList].sort(
    (a, b) => new Date(a.interval.start).getTime() - new Date(b.interval.start).getTime(),
  );
  for (const reservation of sorted) {
    const otherStart = new Date(reservation.interval.start).getTime();
    const otherEnd = new Date(reservation.interval.end).getTime();
    if (halfOpenIntervalsOverlap(startMs, endMs, otherStart, otherEnd)) {
      return true;
    }
  }
  return false;
}

module.exports = hasOverlapWithBlockingReservations;
