"use strict";
const LabshareStudentUseCaseError = require("./labshare-student-use-case-error.js");

const UC_CODE = `${LabshareStudentUseCaseError.ERROR_PREFIX}equipment/`;

const InvalidDtoIn = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}invalidDtoIn`;
    this.message = "DtoIn is not valid.";
  }
};

const EquipmentDoesNotExist = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}equipmentDoesNotExist`;
    this.message = "Equipment does not exist.";
  }
};

const EquipmentNameAlreadyExists = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}equipmentNameAlreadyExists`;
    this.message = "Equipment with this name already exists.";
  }
};

const LocationDoesNotExist = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}locationDoesNotExist`;
    this.message = "Location does not exist.";
  }
};

const EquipmentHasActiveReservation = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}equipmentHasActiveReservation`;
    this.message = "Equipment has an active reservation.";
  }
};

module.exports = {
  UC_CODE,
  InvalidDtoIn,
  EquipmentDoesNotExist,
  EquipmentNameAlreadyExists,
  LocationDoesNotExist,
  EquipmentHasActiveReservation,
};
