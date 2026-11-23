//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
import ListProvider from "./list-provider.js";
import LocationListProvider from "../location/list-provider.js";
import ListView from "./list/view.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const List = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "List",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ListProvider>
        {({ equipmentDataList, filterList, sorterList }) => (
          <LocationListProvider>
            {(locationDataList) => (
              <ListView
                equipmentDataList={equipmentDataList}
                locationDataList={locationDataList}
                filterList={filterList}
                sorterList={sorterList}
              />
            )}
          </LocationListProvider>
        )}
      </ListProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { List };
export default List;
//@@viewOff:exports
