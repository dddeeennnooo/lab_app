"use strict";

const Errors = require("../../api/errors/labshare-student-error.js");

const UVE_ROUTES = {
  HOME: "home",
  LOCATION_LIST: "locationList",
  EQUIPMENT_LIST: "equipmentList",
  RESERVATION_LIST: "reservationList",
  CONTROL_PANEL: "controlPanel",
  INIT_UVE: "sys/uuAppWorkspace/initUve",
};

module.exports = {
  UVE_ROUTES,
  APP_NAME: "uuLabShare",
  ABOUT_DESCRIPTION: "Lab equipment sharing application",
  ABOUT_VENDOR: { code: "uu", name: "Unicorn" },
  INIT_SCHEMAS: ["labshareStudent", "equipment", "location", "reservation"],
  WARNINGS: {
    initUnsupportedKeys: {
      code: `${Errors.Init.UC_CODE}unsupportedKeys`,
    },
    loadUnsupportedKeys: {
      code: `${Errors.Load.UC_CODE}unsupportedKeys`,
    },
  },
};
