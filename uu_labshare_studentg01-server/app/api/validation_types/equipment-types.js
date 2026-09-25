/* eslint-disable */

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
