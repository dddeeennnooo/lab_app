"use strict";
const LabshareStudentUseCaseError = require("./labshare-student-use-case-error.js");

const UC_CODE = `${LabshareStudentUseCaseError.ERROR_PREFIX}location/`;

const InvalidDtoIn = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}invalidDtoIn`;
    this.message = "DtoIn is not valid.";
  }
};

const LocationDoesNotExist = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}locationDoesNotExist`;
    this.message = "Location does not exist.";
  }
};

const LocationAlreadyExists = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}locationAlreadyExists`;
    this.message = "Location with this name already exists.";
  }
};

const LocationIsUsed = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}locationIsUsed`;
    this.message = "Location is used by equipment.";
  }
};

module.exports = {
  UC_CODE,
  InvalidDtoIn,
  LocationDoesNotExist,
  LocationAlreadyExists,
  LocationIsUsed,
};
