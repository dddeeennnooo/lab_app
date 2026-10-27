import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

// NOTE During frontend development it's possible to redirect uuApp command calls elsewhere, e.g. to production/staging
// backend, by configuring it in *-hi/env/development.json:
//   "uu5Environment": {
//     "callsBaseUri": "https://uuapp-dev.plus4u.net/vnd-app/awid"
//   }

const CALLS_BASE_URI = (
  (process.env.NODE_ENV !== "production" ? Environment.get("callsBaseUri") : null) || Environment.appBaseUri
).replace(/\/*$/, "/");

const Calls = {
  call(method, url, dtoIn, clientOptions) {
    return Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
  },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("cmdGet", commandUri);
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("cmdPost", commandUri, dtoInData);
  },

  getWorkspace(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("cmdGet", commandUri, dtoIn);
  },

  loadWorkspace(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/load");
    return Calls.call("cmdGet", commandUri, dtoIn);
  },

  loadBasicData(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/loadBasicData");
    return Calls.call("cmdGet", commandUri, dtoIn);
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  createEquipment(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("equipment/create"), dtoIn);
  },

  getEquipment(dtoIn) {
    return Calls.call("cmdGet", Calls.getCommandUri("equipment/get"), dtoIn);
  },

  listEquipment(dtoIn = {}) {
    return Calls.call("cmdGet", Calls.getCommandUri("equipment/list"), dtoIn);
  },

  updateEquipment(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("equipment/update"), dtoIn);
  },

  deleteEquipment(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("equipment/delete"), dtoIn);
  },

  suggestEquipment(dtoIn = {}) {
    return Calls.call("cmdGet", Calls.getCommandUri("equipment/suggest"), dtoIn);
  },

  createLocation(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("location/create"), dtoIn);
  },

  getLocation(dtoIn) {
    return Calls.call("cmdGet", Calls.getCommandUri("location/get"), dtoIn);
  },

  listLocations(dtoIn = {}) {
    return Calls.call("cmdGet", Calls.getCommandUri("location/list"), dtoIn);
  },

  updateLocation(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("location/update"), dtoIn);
  },

  deleteLocation(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("location/delete"), dtoIn);
  },

  createReservation(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("reservation/create"), dtoIn);
  },

  getReservation(dtoIn) {
    return Calls.call("cmdGet", Calls.getCommandUri("reservation/get"), dtoIn);
  },

  listReservations(dtoIn = {}) {
    return Calls.call("cmdGet", Calls.getCommandUri("reservation/list"), dtoIn);
  },

  cancelReservation(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("reservation/cancel"), dtoIn);
  },

  createReservationSession(dtoIn) {
    return Calls.call("cmdPost", Calls.getCommandUri("reservation/createSession"), dtoIn);
  },

  listWaitlist(dtoIn = {}) {
    return Calls.call("cmdGet", Calls.getCommandUri("waitlist/list"), dtoIn);
  },

  getCommandUri(useCase, baseUri = CALLS_BASE_URI) {
    return baseUri + (useCase.startsWith("/") ? useCase.slice(1) : useCase);
  },
};

export default Calls;
