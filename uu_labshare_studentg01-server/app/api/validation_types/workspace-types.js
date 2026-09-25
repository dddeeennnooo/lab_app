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
