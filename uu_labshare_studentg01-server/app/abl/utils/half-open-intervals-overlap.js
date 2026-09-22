"use strict";

/** Half-open intervals [start, end). */
function halfOpenIntervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

module.exports = halfOpenIntervalsOverlap;
