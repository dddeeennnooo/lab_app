const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");
const { expectCmdError } = require("./expect-cmd-error.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace(getInitDtoIn({ name: "Waitlist Lab" }));
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("T9 waitlist", () => {
  let session;
  let equipmentId;

  beforeAll(async () => {
    session = await TestHelper.login("AwidLicenseOwner", false, false);
    const loc = await TestHelper.executePostCommand("location/create", { name: "Bench W" }, session);
    const eq = await TestHelper.executePostCommand(
      "equipment/create",
      { name: "Scope W", locationId: loc.data.id },
      session,
    );
    equipmentId = eq.data.id;
  });

  const interval = (startHour, endHour) => ({
    start: `2026-07-01T${String(startHour).padStart(2, "0")}:00:00.000Z`,
    end: `2026-07-01T${String(endHour).padStart(2, "0")}:00:00.000Z`,
  });

  test("enqueueIfBusy creates waitlistEntry on overlap", async () => {
    await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(8, 10) },
      session,
    );

    const result = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(9, 11), enqueueIfBusy: true },
      session,
    );
    expect(result.status).toBe(200);
    expect(result.data.waitlistEntry).toBeDefined();
    expect(result.data.waitlistEntry.state).toBe("waiting");
    expect(result.data.reservation).toBeUndefined();
  });

  test("cancel promotes one fitting waiter", async () => {
    const blocking = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(12, 14) },
      session,
    );
    await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval: interval(12, 14), enqueueIfBusy: true },
      session,
    );

    const cancelResult = await TestHelper.executePostCommand(
      "reservation/cancel",
      { id: blocking.data.id },
      session,
    );
    expect(cancelResult.data.promotedReservation).toBeDefined();
    expect(cancelResult.data.promotedWaitlistEntry.state).toBe("promoted");
  });

  test("waitlist/list returns entries", async () => {
    const list = await TestHelper.executeGetCommand("waitlist/list", { equipmentId }, session);
    expect(list.status).toBe(200);
    expect(list.data.itemList.length).toBeGreaterThan(0);
  });
});
