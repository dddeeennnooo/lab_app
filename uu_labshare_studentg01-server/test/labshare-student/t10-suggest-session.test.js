const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");
const { expectCmdError } = require("./expect-cmd-error.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace(getInitDtoIn({ name: "Suggest Lab" }));
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("T10 suggest and createSession", () => {
  let session;
  let locA;
  let locB;
  let eqPrimary;
  let eqSubstitute;

  beforeAll(async () => {
    session = await TestHelper.login("AwidLicenseOwner", false, false);
    locA = (
      await TestHelper.executePostCommand("location/create", { name: "A", mapX: 0, mapY: 0 }, session)
    ).data;
    locB = (
      await TestHelper.executePostCommand("location/create", { name: "B", mapX: 10, mapY: 0 }, session)
    ).data;

    eqPrimary = (
      await TestHelper.executePostCommand(
        "equipment/create",
        { name: "Microscope A", locationId: locA.id, equipmentType: "microscope" },
        session,
      )
    ).data;
    eqSubstitute = (
      await TestHelper.executePostCommand(
        "equipment/create",
        {
          name: "Microscope B",
          locationId: locB.id,
          equipmentType: "microscope",
          compatibleIdList: [eqPrimary.id],
        },
        session,
      )
    ).data;
    await TestHelper.executePostCommand(
      "equipment/update",
      { id: eqPrimary.id, compatibleIdList: [eqSubstitute.id] },
      session,
    );
  });

  const interval = (startHour, endHour) => ({
    start: `2026-08-01T${String(startHour).padStart(2, "0")}:00:00.000Z`,
    end: `2026-08-01T${String(endHour).padStart(2, "0")}:00:00.000Z`,
  });

  test("equipment/suggest returns free substitute by BFS distance", async () => {
    await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId: eqPrimary.id, interval: interval(10, 12) },
      session,
    );

    const suggest = await TestHelper.executeGetCommand(
      "equipment/suggest",
      { equipmentId: eqPrimary.id, interval: interval(10, 12) },
      session,
    );
    expect(suggest.status).toBe(200);
    expect(suggest.data.itemList.length).toBe(1);
    expect(suggest.data.itemList[0].equipmentId).toBe(eqSubstitute.id);
    expect(suggest.data.itemList[0].distance).toBe(1);
  });

  test("equipment/suggest empty when no compatible path", async () => {
    const lone = (
      await TestHelper.executePostCommand(
        "equipment/create",
        { name: "Isolated", locationId: locA.id },
        session,
      )
    ).data;
    const suggest = await TestHelper.executeGetCommand(
      "equipment/suggest",
      { equipmentId: lone.id, interval: interval(14, 16) },
      session,
    );
    expect(suggest.data.itemList).toEqual([]);
  });

  test("reservation/createSession creates all reservations or none", async () => {
    const result = await TestHelper.executePostCommand(
      "reservation/createSession",
      {
        interval: interval(18, 20),
        requirementList: [{ equipmentType: "microscope" }, { equipmentType: "microscope" }],
      },
      session,
    );
    expect(result.status).toBe(200);
    expect(result.data.itemList.length).toBe(2);
    expect(result.data.sessionId).toBeDefined();
  });

  test("reservation/createSession fails when not enough free equipment", async () => {
    await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId: eqPrimary.id, interval: interval(20, 22) },
      session,
    );
    await TestHelper.executePostCommand(
      "reservation/create",
      { equipmentId: eqSubstitute.id, interval: interval(20, 22) },
      session,
    );

    const err = await expectCmdError(
      TestHelper.executePostCommand(
        "reservation/createSession",
        {
          interval: interval(20, 22),
          requirementList: [{ equipmentType: "microscope" }, { equipmentType: "microscope" }],
        },
        session,
      ),
    );
    expect(err.uuAppErrorMap?.["uu-labshare-student/reservation/sessionCannotBeSatisfied"]).toBeDefined();
  });
});
