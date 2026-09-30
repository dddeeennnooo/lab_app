"use strict";

const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { hasOverlapWithBlockingReservations } = require("./abl-utils.js");
const { completedReservationHoursMs } = require("./completed-reservation-hours.js");

async function promoteWaitlistAfterCancel(awid, equipmentId) {
  const waitlistDao = DaoFactory.getDao("waitlistEntry");
  const reservationDao = DaoFactory.getDao("reservation");

  const waitingList = await waitlistDao.listWaitingByEquipmentId(awid, equipmentId);
  if (!waitingList.length) {
    return null;
  }

  const hoursByIdentity = new Map();
  for (const entry of waitingList) {
    if (!hoursByIdentity.has(entry.uuIdentity)) {
      const userReservations = await reservationDao.listByUuIdentity(awid, entry.uuIdentity);
      hoursByIdentity.set(entry.uuIdentity, completedReservationHoursMs(userReservations));
    }
  }

  const sorted = [...waitingList].sort((a, b) => {
    const hoursA = hoursByIdentity.get(a.uuIdentity) ?? 0;
    const hoursB = hoursByIdentity.get(b.uuIdentity) ?? 0;
    if (hoursA !== hoursB) {
      return hoursA - hoursB;
    }
    const enqA = new Date(a.enqueuedAt).getTime();
    const enqB = new Date(b.enqueuedAt).getTime();
    return enqA - enqB;
  });

  const blockingList = await reservationDao.listBlockingByEquipmentId(awid, equipmentId);

  for (const entry of sorted) {
    const startMs = new Date(entry.interval.start).getTime();
    const endMs = new Date(entry.interval.end).getTime();
    if (hasOverlapWithBlockingReservations(blockingList, startMs, endMs)) {
      continue;
    }

    const reservation = await reservationDao.create({
      awid,
      equipmentId: entry.equipmentId,
      interval: {
        start: new Date(entry.interval.start).toISOString(),
        end: new Date(entry.interval.end).toISOString(),
      },
      state: "requested",
      uuIdentity: entry.uuIdentity,
    });

    await waitlistDao.update({
      ...entry,
      state: "promoted",
      promotedReservationId: reservation.id,
    });

    return { waitlistEntry: { ...entry, state: "promoted", promotedReservationId: reservation.id }, reservation };
  }

  return null;
}

module.exports = promoteWaitlistAfterCancel;
