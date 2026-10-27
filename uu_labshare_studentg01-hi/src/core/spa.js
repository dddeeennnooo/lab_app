//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Route from "../utils/route.js";
import Home from "../routes/home.js";

const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
const LocationList = Utils.Component.lazy(() => import("../routes/location-list.js"));
const EquipmentList = Utils.Component.lazy(() => import("../routes/equipment-list.js"));
const ReservationList = Utils.Component.lazy(() => import("../routes/reservation-list.js"));
//@@viewOff:imports

//@@viewOn:constants
const ROUTE_MAP = {
  "": { redirect: Route.HOME },
  [Route.HOME]: (props) => <Home {...props} />,
  [Route.LOCATION_LIST]: (props) => <LocationList {...props} />,
  [Route.EQUIPMENT_LIST]: (props) => <EquipmentList {...props} />,
  [Route.RESERVATION_LIST]: (props) => <ReservationList {...props} />,
  [Route.INIT_UVE]: (props) => <InitAppWorkspace {...props} />,
  [Route.CONTROL_PANEL]: (props) => <ControlPanel {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
};
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider
        initialLanguageList={["en", "cs"]}
        localNavigation={{ display: "sidebar", type: "expanded", open: true }}
      >
        <Uu5Elements.ModalBus>
          <Plus4U5App.Spa routeMap={ROUTE_MAP} />
        </Uu5Elements.ModalBus>
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
