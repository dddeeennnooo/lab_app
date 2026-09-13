/** Shared dtoIn for sys/uuAppWorkspace/init (T2). */
function getInitDtoIn(overrides = {}) {
  return {
    name: "Test Lab",
    openingHours: { from: "08:00", to: "18:00" },
    uuAppProfileAuthorities: "urn:uu:GGALL",
    ...overrides,
  };
}

module.exports = { getInitDtoIn };
