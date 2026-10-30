//@@viewOn:imports
import { createComponent, useDataList, useMemo } from "uu5g05";
import Calls from "calls";

import Location from "./constants.js";
import { LocationListContext } from "./use-location-list.js";
//@@viewOff:imports

const LocationListProvider = createComponent({
  render({ children }) {
    //@@viewOn:private
    const handlerMap = useMemo(
      () => ({
        load: (dtoIn) =>
          Calls.listLocations({
            pageInfo: {
              pageIndex: dtoIn?.pageInfo?.pageIndex ?? 0,
              pageSize: Location.PAGE_SIZE,
            },
          }),
        loadNext: (dtoIn) =>
          Calls.listLocations({
            pageInfo: {
              pageIndex: dtoIn?.pageInfo?.pageIndex ?? 0,
              pageSize: Location.PAGE_SIZE,
            },
          }),
        createItem: (values) => Calls.createLocation(values),
        updateItem: (dtoIn) => Calls.updateLocation(dtoIn),
        deleteItem: (dtoIn) => Calls.deleteLocation(dtoIn),
      }),
      [],
    );

    const locationDataList = useDataList({
      handlerMap,
      pageSize: Location.PAGE_SIZE,
      initialDtoIn: { pageInfo: { pageIndex: 0 } },
    });
    //@@viewOff:private

    return <LocationListContext.Provider value={locationDataList}>{children}</LocationListContext.Provider>;
  },
});

export { LocationListProvider };
export default LocationListProvider;
