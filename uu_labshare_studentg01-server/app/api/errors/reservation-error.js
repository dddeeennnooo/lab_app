"use strict";
const LabshareStudentUseCaseError = require("./labshare-student-use-case-error.js");

const UC_CODE = `${LabshareStudentUseCaseError.ERROR_PREFIX}reservation/`;

const InvalidDtoIn = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}invalidDtoIn`;
    this.message = "DtoIn is not valid.";
  }
};

const ReservationDoesNotExist = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}reservationDoesNotExist`;
    this.message = "Reservation does not exist.";
  }
};

const EquipmentDoesNotExist = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}equipmentDoesNotExist`;
    this.message = "Equipment does not exist.";
  }
};

const EquipmentNotAvailable = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}equipmentNotAvailable`;
    this.message = "Equipment is not available for the requested interval.";
  }
};

const ReservationNotCancellable = class extends LabshareStudentUseCaseError {
  constructor() {
    super(...arguments);
    this.code = `${UC_CODE}reservationNotCancellable`;
    this.message = "Reservation cannot be cancelled.";
  }
};

module.exports = {
  UC_CODE,
  InvalidDtoIn,
  ReservationDoesNotExist,
  EquipmentDoesNotExist,
  EquipmentNotAvailable,
  ReservationNotCancellable,
};
