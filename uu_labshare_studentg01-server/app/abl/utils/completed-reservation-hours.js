"use strict";

/** Sum of hours for returned reservations of a user in the AWID (used for waitlist priority). */
function completedReservationHoursMs(reservationList) {
  let totalMs = 0;
  for (const reservation of reservationList) {
    if (reservation.state !== "returned") {
      continue;
    }
    const start = new Date(reservation.interval.start).getTime();
    const end = new Date(reservation.interval.end).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      totalMs += end - start;
    }
  }
  return totalMs;
}

module.exports = { completedReservationHoursMs };
