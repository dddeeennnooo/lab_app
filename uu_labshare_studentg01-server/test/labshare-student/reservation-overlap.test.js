const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");
const { expectCmdError } = require("./expect-cmd-error.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace(getInitDtoIn({ name: "Reservation Lab" }));
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("T7 reservation overlap", () => {
  let session;
  let locationId;
  let equipmentId;

  beforeAll(async () => {
    session = await TestHelper.login("AwidLicenseOwner", false, false);
    const loc = await TestHelper.executePostCommand("location/create", { name: "Bench 1" }, session);
    locationId = loc.data.id;
    const eq = await TestHelper.executePostCommand(
      "equipment/create",
      { name: "Oscilloscope", locationId },
      session,
    );
    equipmentId = eq.data.id;
  });

  const interval = (startHour, endHour) => ({
    start: `2026-06-01T${String(startHour).padStart(2, "0")}:00:00.000Z`,
    end: `2026-06-01T${String(endHour).padStart(2, "0")}:00:00.000Z`,
  });

  test("reservation/create succeeds", async () => {
    const result = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(10, 12) },
      session,
    );
    expect(result.status).toBe(200);
    expect(result.data.state).toBe("requested");
    expect(result.data.equipmentId).toBe(equipmentId);
  });

  test("overlapping reservation fails with equipmentNotAvailable", async () => {
    const err = await expectCmdError(
      TestHelper.executePostCommand(
        "reservation/create",
        { equipmentId, interval: interval(11, 13) },
        session,
      ),
    );
    expect(err.uuAppErrorMap?.["uu-labshare-student/reservation/equipmentNotAvailable"]).toBeDefined();
  });

  test("adjacent reservation [12,14) is allowed after [10,12)", async () => {
    const result = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(12, 14) },
      session,
    );
    expect(result.status).toBe(200);
  });

  test("cancelled reservation does not block the same interval", async () => {
    const first = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(20, 22) },
      session,
    );
    await TestHelper.executePostCommand("reservation/cancel", { id: first.data.id }, session);

    const second = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(20, 22) },
      session,
    );
    expect(second.status).toBe(200);
  });

  test("equipment/delete blocked while active reservation exists", async () => {
    const created = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(40, 42) },
      session,
    );
    const { uuAppErrorMap, ...reservation } = created.data;
    const { DaoFactory } = require("uu_appg01_server").ObjectStore;
    const reservationDao = DaoFactory.getDao("reservation");
    await reservationDao.update({ ...reservation, state: "active" });

    await expectCmdError(TestHelper.executePostCommand("equipment/delete", { id: equipmentId }, session));
  });
});
