/* eslint-disable */

const waitlistListDtoInType = shape({
  equipmentId: string(255),
  state: oneOf(["waiting", "promoted", "expired"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});
