"use strict";

function equipmentId(equipment) {
  if (!equipment) {
    return null;
  }
  if (equipment.id != null) {
    return String(equipment.id);
  }
  if (equipment._id != null) {
    return String(equipment._id);
  }
  return null;
}

function buildAdjacency(equipmentList) {
  const byId = new Map();
  for (const eq of equipmentList) {
    const id = equipmentId(eq);
    if (id) {
      byId.set(id, eq);
    }
  }
  const adjacency = new Map();

  for (const equipment of equipmentList) {
    const selfId = equipmentId(equipment);
    if (!selfId) {
      continue;
    }
    const neighbors = new Set();
    const compatible = equipment.compatibleIdList || [];
    for (const otherId of compatible) {
      const neighborId = String(otherId);
      if (byId.has(neighborId) && neighborId !== selfId) {
        neighbors.add(neighborId);
      }
    }
    for (const other of equipmentList) {
      const otherId = equipmentId(other);
      if (!otherId || otherId === selfId) {
        continue;
      }
      const otherCompatible = other.compatibleIdList || [];
      if (otherCompatible.map(String).includes(selfId)) {
        neighbors.add(otherId);
      }
    }
    adjacency.set(selfId, neighbors);
  }

  return { byId, adjacency };
}

/** BFS distances from startId over undirected compatibleIdList graph. */
function bfsDistances(startId, adjacency) {
  const distances = new Map();
  const rootId = String(startId);
  if (!adjacency.has(rootId)) {
    return distances;
  }
  const queue = [rootId];
  distances.set(rootId, 0);
  while (queue.length) {
    const current = queue.shift();
    const dist = distances.get(current);
    for (const neighbor of adjacency.get(current) || []) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, dist + 1);
        queue.push(neighbor);
      }
    }
  }
  return distances;
}

module.exports = { equipmentId, buildAdjacency, bfsDistances };
