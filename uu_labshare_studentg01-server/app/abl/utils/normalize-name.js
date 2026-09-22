"use strict";

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

module.exports = normalizeName;
