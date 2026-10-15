"use strict";

function locationCoords(location) {
  const x = Number.isFinite(location?.mapX) ? location.mapX : 0;
  const y = Number.isFinite(location?.mapY) ? location.mapY : 0;
  return { x, y };
}

function walkingCostBetweenLocations(locationA, locationB) {
  const a = locationCoords(locationA);
  const b = locationCoords(locationB);
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

module.exports = { walkingCostBetweenLocations, locationCoords };
