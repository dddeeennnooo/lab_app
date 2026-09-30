/* eslint-disable */

const reservationCreateDtoInType = shape({
  equipmentId: string(255).isRequired(),
  interval: shape({
    start: datetime().isRequired(),
    end: datetime().isRequired(),
  }).isRequired(),
  enqueueIfBusy: boolean(),
});

const reservationCreateSessionDtoInType = shape({
  interval: shape({
    start: datetime().isRequired(),
    end: datetime().isRequired(),
  }).isRequired(),
  requirementList: array(
    shape({
      equipmentId: string(255),
      equipmentType: string(255),
    }).isRequired(),
    1,
    50,
  ).isRequired(),
});

const reservationGetDtoInType = shape({
  id: string(255).isRequired(),
});

const reservationListDtoInType = shape({
  equipmentId: string(255),
  state: oneOf(["requested", "active", "returned", "cancelled"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const reservationCancelDtoInType = shape({
  id: string(255).isRequired(),
});
