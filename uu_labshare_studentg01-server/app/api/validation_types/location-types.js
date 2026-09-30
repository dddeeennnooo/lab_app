/* eslint-disable */

const locationCreateDtoInType = shape({
  name: string(255).isRequired(),
  mapX: number(),
  mapY: number(),
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
  mapX: number(),
  mapY: number(),
});

const locationDeleteDtoInType = shape({
  id: string(255).isRequired(),
});
