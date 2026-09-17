"use strict";
const WorkspaceAbl = require("../../abl/workspace-abl.js");
const EquipmentAbl = require("../../abl/equipment-abl.js");
const LocationAbl = require("../../abl/location-abl.js");
const ReservationAbl = require("../../abl/reservation-abl.js");

class LabshareStudentController {
  init(ucEnv) {
    return WorkspaceAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return WorkspaceAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadAbout(ucEnv) {
    return WorkspaceAbl.loadAbout(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  loadBasicData(ucEnv) {
    return WorkspaceAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }

  createEquipment(ucEnv) {
    return EquipmentAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  getEquipment(ucEnv) {
    return EquipmentAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  listEquipment(ucEnv) {
    return EquipmentAbl.list(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  updateEquipment(ucEnv) {
    return EquipmentAbl.update(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  deleteEquipment(ucEnv) {
    return EquipmentAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  createLocation(ucEnv) {
    return LocationAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  getLocation(ucEnv) {
    return LocationAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  listLocations(ucEnv) {
    return LocationAbl.list(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  updateLocation(ucEnv) {
    return LocationAbl.update(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  deleteLocation(ucEnv) {
    return LocationAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  createReservation(ucEnv) {
    return ReservationAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  getReservation(ucEnv) {
    return ReservationAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  listReservations(ucEnv) {
    return ReservationAbl.list(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  cancelReservation(ucEnv) {
    return ReservationAbl.cancel(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new LabshareStudentController();
