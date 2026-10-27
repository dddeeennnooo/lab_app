"use strict";
const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "insomnia-labshare-cmds.json");

const WRK = "wrk_labshare_insomnia_cmds_01";
const ENV_BASE = "env_labshare_insomnia_base_01";
const ENV_LOCAL = "env_labshare_insomnia_localhost_01";
const FLD_LOCATION = "fld_labshare_location_cmds";
const FLD_EQUIPMENT = "fld_labshare_equipment_cmds";
const FLD_RESERVATION = "fld_labshare_reservation_cmds";

function req(id, name, method, url, bodyText, parentId, metaSortKey, description = "") {
  const r = {
    _id: id,
    authentication: { token: "{{ token }}", type: "bearer" },
    body: {},
    created: Date.now(),
    description,
    headers: [],
    isPrivate: false,
    metaSortKey,
    method,
    modified: Date.now(),
    name,
    parameters: [],
    parentId,
    settingDisableRenderRequestBody: false,
    settingEncodeUrl: true,
    settingFollowRedirects: "global",
    settingRebuildPath: true,
    settingSendCookies: true,
    settingStoreCookies: true,
    url,
    _type: "request",
  };
  if (method === "POST") {
    r.body = { mimeType: "application/json", text: bodyText || "{}" };
    r.headers = [{ id: `pair_${id}`, name: "Content-Type", value: "application/json" }];
  } else {
    r.body = {};
  }
  return r;
}

function folder(id, name, parentId, metaSortKey) {
  return {
    _id: id,
    created: Date.now(),
    description: "uuLabShare app CMDs (T3–T8). Import this JSON file in Insomnia.",
    environment: {},
    environmentPropertyOrder: null,
    metaSortKey,
    modified: Date.now(),
    name,
    parentId,
    _type: "request_group",
  };
}

const base = "{{ host }}/{{ contextPath }}/{{ awid }}";

const resources = [
  {
    _id: WRK,
    created: Date.now(),
    modified: Date.now(),
    name: "uuLabShare app CMDs",
    parentId: null,
    scope: "collection",
    _type: "workspace",
  },
  {
    _id: ENV_BASE,
    color: null,
    created: Date.now(),
    data: { contextPath: "uu-labshare-studentg01", token: "" },
    dataPropertyOrder: { "&": ["contextPath", "token"] },
    isPrivate: false,
    metaSortKey: 1,
    modified: Date.now(),
    name: "Base Environment",
    parentId: WRK,
    _type: "environment",
  },
  {
    _id: ENV_LOCAL,
    color: "#7d69cb",
    created: Date.now(),
    data: {
      host: "http://localhost:8080",
      contextPath: "uu-labshare-studentg01",
      asid: "11111111111111111111111111111111",
      awid: "22222222222222222222222222222222",
      token: "",
      locationId: "",
      equipmentId: "",
      reservationId: "",
    },
    dataPropertyOrder: {
      "&": ["host", "contextPath", "asid", "awid", "token", "locationId", "equipmentId", "reservationId"],
    },
    isPrivate: false,
    metaSortKey: 2,
    modified: Date.now(),
    name: "localhost",
    parentId: ENV_BASE,
    _type: "environment",
  },
  folder(FLD_LOCATION, "location (T5)", WRK, 100),
  folder(FLD_EQUIPMENT, "equipment (T3–T5)", WRK, 200),
  folder(FLD_RESERVATION, "reservation (T7–T8)", WRK, 300),

  req(
    "req_labshare_loc_create",
    "location/create",
    "POST",
    `${base}/location/create`,
    '{\n  "name": "Room A"\n}',
    FLD_LOCATION,
    10,
    "Copy response id to environment locationId.",
  ),
  req(
    "req_labshare_loc_get",
    "location/get",
    "GET",
    `${base}/location/get?id={{ locationId }}`,
    null,
    FLD_LOCATION,
    20,
  ),
  req(
    "req_labshare_loc_list",
    "location/list",
    "GET",
    `${base}/location/list?pageIndex=0&pageSize=20`,
    null,
    FLD_LOCATION,
    30,
    "Public: disable Bearer auth to test without login.",
  ),
  req(
    "req_labshare_loc_update",
    "location/update",
    "POST",
    `${base}/location/update`,
    '{\n  "id": "{{ locationId }}",\n  "name": "Room A renamed"\n}',
    FLD_LOCATION,
    40,
  ),
  req(
    "req_labshare_loc_delete",
    "location/delete",
    "POST",
    `${base}/location/delete`,
    '{\n  "id": "{{ locationId }}"\n}',
    FLD_LOCATION,
    50,
  ),

  req(
    "req_labshare_eq_create",
    "equipment/create",
    "POST",
    `${base}/equipment/create`,
    '{\n  "name": "Microscope",\n  "locationId": "{{ locationId }}"\n}',
    FLD_EQUIPMENT,
    10,
  ),
  req(
    "req_labshare_eq_get",
    "equipment/get",
    "GET",
    `${base}/equipment/get?id={{ equipmentId }}`,
    null,
    FLD_EQUIPMENT,
    20,
  ),
  req(
    "req_labshare_eq_list",
    "equipment/list",
    "GET",
    `${base}/equipment/list?pageIndex=0&pageSize=20`,
    null,
    FLD_EQUIPMENT,
    30,
    "Public: disable Bearer auth to test without login.",
  ),
  req(
    "req_labshare_eq_list_filter",
    "equipment/list (name + location)",
    "GET",
    `${base}/equipment/list?name=Micro&locationId={{ locationId }}&sortBy=name&order=asc&pageIndex=0&pageSize=20`,
    null,
    FLD_EQUIPMENT,
    35,
  ),
  req(
    "req_labshare_eq_update",
    "equipment/update",
    "POST",
    `${base}/equipment/update`,
    '{\n  "id": "{{ equipmentId }}",\n  "name": "Microscope Pro"\n}',
    FLD_EQUIPMENT,
    40,
  ),
  req(
    "req_labshare_eq_delete",
    "equipment/delete",
    "POST",
    `${base}/equipment/delete`,
    '{\n  "id": "{{ equipmentId }}"\n}',
    FLD_EQUIPMENT,
    50,
  ),

  req(
    "req_labshare_res_create",
    "reservation/create",
    "POST",
    `${base}/reservation/create`,
    '{\n  "equipmentId": "{{ equipmentId }}",\n  "interval": {\n    "start": "2026-08-01T10:00:00.000Z",\n    "end": "2026-08-01T12:00:00.000Z"\n  }\n}',
    FLD_RESERVATION,
    10,
  ),
  req(
    "req_labshare_res_get",
    "reservation/get",
    "GET",
    `${base}/reservation/get?id={{ reservationId }}`,
    null,
    FLD_RESERVATION,
    20,
  ),
  req(
    "req_labshare_res_list",
    "reservation/list",
    "GET",
    `${base}/reservation/list?equipmentId={{ equipmentId }}&pageIndex=0&pageSize=20`,
    null,
    FLD_RESERVATION,
    30,
  ),
  req(
    "req_labshare_res_cancel",
    "reservation/cancel",
    "POST",
    `${base}/reservation/cancel`,
    '{\n  "id": "{{ reservationId }}"\n}',
    FLD_RESERVATION,
    40,
  ),
];

const exportDoc = {
  _type: "export",
  __export_format: 4,
  __export_date: new Date().toISOString(),
  __export_source: "uuLabShare training",
  resources,
};

fs.writeFileSync(outPath, JSON.stringify(exportDoc, null, 2) + "\n");
console.log("Wrote", outPath);
