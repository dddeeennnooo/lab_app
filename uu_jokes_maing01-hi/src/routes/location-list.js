//@@viewOn:imports
import { createVisualComponent, Utils, useDataObject } from "uu5g05";
import Config from "./config/config.js";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import List from "../core/location/list";
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

const LocationList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "LocationList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { children } = props;
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    return (
      <RouteController>
        <RouteContainer>
          <List />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { LocationList };
export default LocationList;
//@@viewOff:exports
