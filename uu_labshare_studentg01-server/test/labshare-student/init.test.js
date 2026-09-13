const { TestHelper } = require("uu_appg01_server-test");
const { getInitDtoIn } = require("./init-dto-in.js");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let result = await TestHelper.executePostCommand("sys/uuAppWorkspace/init", getInitDtoIn(), session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.lab.name).toEqual("Test Lab");
  });
});
