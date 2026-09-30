/* eslint-disable */

const equipmentCreateDtoInType = shape({
  name: string(255).isRequired(),
  locationId: string(255).isRequired(),
  equipmentType: string(255),
  compatibleIdList: array(string(255), 0, 100),
});

const equipmentSuggestDtoInType = shape({
  equipmentId: string(255).isRequired(),
  interval: shape({
    start: datetime().isRequired(),
    end: datetime().isRequired(),
  }).isRequired(),
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
  equipmentType: string(255),
  compatibleIdList: array(string(255), 0, 100),
});

const equipmentDeleteDtoInType = shape({
  id: string(255).isRequired(),
});
