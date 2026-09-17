/* eslint-disable */

const initDtoInType = shape({
  name: string(512).isRequired(),
  openingHours: shape({
    from: string(/^\d{2}:\d{2}$/).isRequired(),
    to: string(/^\d{2}:\d{2}$/).isRequired(),
  }).isRequired(),
  uuAppProfileAuthorities: uri().isRequired(),
  uuAppProfileExecutives: uri(),
  uuAppProfileReaders: uri(),
  uuBtLocationUri: uri(),
  sysState: oneOf(["active", "restricted", "readOnly"]),
  adviceNote: shape({
    message: uu5String().isRequired(),
    severity: oneOf(["debug", "info", "warning", "error", "fatal"]),
    estimatedEndTime: datetime(),
  }),
});

const loadDtoInType = shape({});

const equipmentCreateDtoInType = shape({
  name: string(255).isRequired(),
  locationId: string(255).isRequired(),
});

const equipmentGetDtoInType = shape({
  id: string(255).isRequired(),
});

const equipmentListDtoInType = shape({
  name: string(255),
  locationId: string(255),
  sortBy: oneOf(["name", "sys.cts"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const equipmentUpdateDtoInType = shape({
  id: string(255).isRequired(),
  name: string(255),
  locationId: string(255),
});

const equipmentDeleteDtoInType = shape({
  id: string(255).isRequired(),
});

const locationCreateDtoInType = shape({
  name: string(255).isRequired(),
});

const locationGetDtoInType = shape({
  id: string(255).isRequired(),
});

const locationListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const locationUpdateDtoInType = shape({
  id: string(255).isRequired(),
  name: string(255).isRequired(),
});

const locationDeleteDtoInType = shape({
  id: string(255).isRequired(),
});

const reservationCreateDtoInType = shape({
  equipmentId: string(255).isRequired(),
  interval: shape({
    start: datetime().isRequired(),
    end: datetime().isRequired(),
  }).isRequired(),
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
