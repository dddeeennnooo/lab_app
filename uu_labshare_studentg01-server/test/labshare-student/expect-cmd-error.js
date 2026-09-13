async function expectCmdError(promise, expectedStatus = 400) {
  try {
    await promise;
    throw new Error("Expected command to fail");
  } catch (e) {
    expect(e.status).toBe(expectedStatus);
    return e.dtoOut || e.response?.data;
  }
}

module.exports = { expectCmdError };
