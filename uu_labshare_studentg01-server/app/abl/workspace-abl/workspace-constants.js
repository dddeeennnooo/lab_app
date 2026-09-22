"use strict";

const Errors = require("../../api/errors/labshare-student-error.js");

module.exports = {
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
