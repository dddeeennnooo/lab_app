//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import List from "../core/equipment/list";
import Config from "./config/config";
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

const EquipmentList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "EquipmentList",
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
export { EquipmentList };
export default EquipmentList;
//@@viewOff:exports
