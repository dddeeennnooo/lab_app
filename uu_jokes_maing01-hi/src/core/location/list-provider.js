//@@viewOn:imports
import { createComponent, useDataList } from "uu5g05";
import Calls from "calls";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
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
    const locationDataList = useDataList({
      handlerMap: {
        load: () => Calls.Location.list({ pageInfo: { pageIndex: 0, pageSize: 20 } }),
        loadNext: (pageInfo) => Calls.Location.list({ pageInfo }),
        create: (dtoIn) => Calls.Location.create(dtoIn),
      },
      itemHandlerMap: {
        update: (dtoIn) => Calls.Location.update(dtoIn),
        delete: (location) => Calls.Location.delete({ id: location.id }),
      },
    });
    return typeof props.children === "function" ? props.children(locationDataList) : props.children;
  }
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports
