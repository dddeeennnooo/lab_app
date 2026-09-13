"use strict";
const LabshareStudentUseCaseError = require("./labshare-student-use-case-error.js");
const Equipment = require("./equipment-error.js");
const Location = require("./location-error.js");

const Init = {
  UC_CODE: `${LabshareStudentUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  InvalidOpeningHours: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidOpeningHours`;
      this.message = "Opening hours must have from < to.";
    }
  },

  LabAlreadyExists: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}labAlreadyExists`;
      this.message = "Lab already exists.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
};

const Load = {
  UC_CODE: `${LabshareStudentUseCaseError.ERROR_PREFIX}load/`,

  InvalidDtoIn: class extends LabshareStudentUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  Init,
  Load,
  Equipment,
  Location,
};
