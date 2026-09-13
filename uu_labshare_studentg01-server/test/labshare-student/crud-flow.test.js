const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");
const { expectCmdError } = require("./expect-cmd-error.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace(getInitDtoIn({ name: "CRUD Lab" }));
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("T3–T5 location and equipment flow", () => {
  let session;
  let locationId;
  let equipmentId;

  beforeAll(async () => {
    session = await TestHelper.login("AwidLicenseOwner", false, false);
  });

  test("location/create and equipment/create (T3/T5)", async () => {
    const loc = await TestHelper.executePostCommand("location/create", { name: "  Room A  " }, session);
    expect(loc.status).toBe(200);
    locationId = loc.data.id;
    expect(loc.data.name).toBe("Room A");

    const eq = await TestHelper.executePostCommand(
      "equipment/create",
      { name: "Microscope", locationId },
      session
    );
    expect(eq.status).toBe(200);
    equipmentId = eq.data.id;
    expect(eq.data.locationId).toBe(locationId);
  });

  test("equipment/create duplicate name fails", async () => {
    await expectCmdError(
      TestHelper.executePostCommand("equipment/create", { name: "microscope", locationId }, session)
    );
  });

  test("equipment/get and equipment/list (T4)", async () => {
    const got = await TestHelper.executeGetCommand("equipment/get", { id: equipmentId }, session);
    expect(got.status).toBe(200);
    expect(got.data.name).toBe("Microscope");

    const list = await TestHelper.executeGetCommand(
      "equipment/list",
      { name: "Micro", locationId, sortBy: "name", order: "asc" },
      session
    );
    expect(list.status).toBe(200);
    expect(list.data.itemList.length).toBeGreaterThanOrEqual(1);
    expect(list.data.pageInfo.total).toBeGreaterThanOrEqual(1);
  });

  test("location/delete blocked when equipment references location", async () => {
    await expectCmdError(TestHelper.executePostCommand("location/delete", { id: locationId }, session));
  });

  test("equipment/delete then location/delete succeed", async () => {
    let delEq = await TestHelper.executePostCommand("equipment/delete", { id: equipmentId }, session);
    expect(delEq.status).toBe(200);

    let delLoc = await TestHelper.executePostCommand("location/delete", { id: locationId }, session);
    expect(delLoc.status).toBe(200);
  });
});
