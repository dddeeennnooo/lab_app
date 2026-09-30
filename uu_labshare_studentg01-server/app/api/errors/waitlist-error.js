"use strict";
const LabshareStudentUseCaseError = require("./labshare-student-use-case-error.js");

const UC_CODE = `${LabshareStudentUseCaseError.ERROR_PREFIX}waitlist/`;

const InvalidDtoIn = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}invalidDtoIn`;
    this.message = "DtoIn is not valid.";
  }
};

module.exports = {
  UC_CODE,
  InvalidDtoIn,
};
