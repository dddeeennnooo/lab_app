const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace(getInitDtoIn());
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the load uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let result = await TestHelper.executeGetCommand("sys/uuAppWorkspace/load", {}, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.data?.name).toEqual("Test Lab");
  });
});
