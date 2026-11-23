//@@viewOn:imports
import { createComponent, useDataList, useRef } from "uu5g05";
import Calls from "calls";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
function toDtoIn(filterList, sorterList, pageInfo) {
  const filterMap = Object.fromEntries(filterList.map((filter) => [filter.key, filter.value]));
  const sorter = sorterList[0];
  return {
    name: filterMap.name,
    locationId: filterMap.locationId,
    sortBy: sorter?.key,
    order: sorter ? (sorter.ascending === false ? "desc" : "asc") : undefined,
    pageInfo,
  };
}
//@@viewOff:helpers

const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const filterList = useRef([]);
    const sorterList = useRef([]);

    const equipmentDataList = useDataList({
      handlerMap: {
        load(criteria) {
          filterList.current = criteria?.filterList || [];
          sorterList.current = criteria?.sorterList || [];
          return Calls.Equipment.list(toDtoIn(filterList.current, sorterList.current, criteria?.pageInfo));
        },
        loadNext(pageInfo) {
          return Calls.Equipment.list(toDtoIn(filterList.current, sorterList.current, pageInfo));
        },
        create: (dtoIn) => Calls.Equipment.create(dtoIn),
      },
      itemHandlerMap: {
        update: (dtoIn) => Calls.Equipment.update(dtoIn),
        delete: (equipment) => Calls.Equipment.delete({ id: equipment.id }),
      },
    });

    const value = { equipmentDataList, filterList: filterList.current, sorterList: sorterList.current };
    return typeof props.children === "function" ? props.children(value) : props.children;
  }
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
