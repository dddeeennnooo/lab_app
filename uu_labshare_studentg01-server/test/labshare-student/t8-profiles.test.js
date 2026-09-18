const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");
const { expectCmdError } = require("./expect-cmd-error.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace(getInitDtoIn({ name: "T8 Lab" }));
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("T8 who can do what", () => {
  let ownerSession;
  let readerSession;
  let readerOtherSession;
  let executiveSession;
  let equipmentId;

  const interval = {
    start: "2026-07-01T10:00:00.000Z",
    end: "2026-07-01T12:00:00.000Z",
  };

  beforeAll(async () => {
    ownerSession = await TestHelper.login("AwidLicenseOwner", false, false);
    readerSession = await TestHelper.login("Readers", true, false);
    readerOtherSession = await TestHelper.login("ReaderOther", true, false);
    executiveSession = await TestHelper.login("Executives", true, false);

    const loc = await TestHelper.executePostCommand("location/create", { name: "T8 Room" }, ownerSession);
    const eq = await TestHelper.executePostCommand(
      "equipment/create",
      { name: "T8 Scope", locationId: loc.data.id },
      ownerSession,
    );
    equipmentId = eq.data.id;
  });

  test("Public may equipment/list without login", async () => {
    const result = await TestHelper.executeGetCommand("equipment/list", {}, null);
    expect(result.status).toBe(200);
  });

  test("Public may not reservation/list", async () => {
    await expectCmdError(TestHelper.executeGetCommand("reservation/list", {}, null), 401);
  });

  test("Reader creates reservation for own uuIdentity", async () => {
    const result = await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId, interval },
      readerSession,
    );
    expect(result.status).toBe(200);
    expect(result.data.uuIdentity).toBe("3039-912-8064-0002");
  });

  test("Reader cannot cancel another reader reservation", async () => {
    const created = await TestHelper.executePostCommand(
      "reservation/create",
      {
        equipmentId,
        interval: { start: "2026-07-02T10:00:00.000Z", end: "2026-07-02T12:00:00.000Z" },
      },
      readerSession,
    );
    const err = await expectCmdError(
      TestHelper.executePostCommand("reservation/cancel", { id: created.data.id }, readerOtherSession),
    );
    expect(err.uuAppErrorMap?.["uu-labshare-student/reservation/notAuthorized"]).toBeDefined();
  });

  test("Executive may cancel any reservation", async () => {
    const created = await TestHelper.executePostCommand(
      "reservation/create",
      {
        equipmentId,
        interval: { start: "2026-07-03T10:00:00.000Z", end: "2026-07-03T12:00:00.000Z" },
      },
      readerSession,
    );
    const cancelled = await TestHelper.executePostCommand(
      "reservation/cancel",
      { id: created.data.id },
      executiveSession,
    );
    expect(cancelled.status).toBe(200);
    expect(cancelled.data.state).toBe("cancelled");
  });
});
