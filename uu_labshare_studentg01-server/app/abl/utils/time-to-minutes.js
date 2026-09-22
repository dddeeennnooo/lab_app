"use strict";

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

module.exports = timeToMinutes;
