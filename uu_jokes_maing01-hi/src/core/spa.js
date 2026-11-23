//@@viewOn:imports
import { createVisualComponent, Utils, Environment } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";
import RouteBar from "./route-bar";

import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
const About = Utils.Component.lazy(() => import("../routes/about.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
const Jokes = Utils.Component.lazy(() => import("../routes/jokes.js"));
const Joke = Utils.Component.lazy(() => import("../routes/joke.js"));
const EquipmentList = Utils.Component.lazy(() => import("../routes/equipment-list.js"));
const LocationList = Utils.Component.lazy(() => import("../routes/location-list.js"));
const ReservationList = Utils.Component.lazy(() => import("../routes/reservation-list.js"));
const ReservationDetail = Utils.Component.lazy(() => import("../routes/reservation-detail.js"));

const ROUTE_MAP = {
  "": { redirect: "jokes" },
  jokes: (props) => <Jokes {...props} />,
  jokeDetail: (props) => <Joke {...props} />,
  about: (props) => <About {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  equipmentList: (props) => <EquipmentList {...props} />,
  locationList: (props) => <LocationList {...props} />,
  reservationList: (props) => <ReservationList {...props} />,
  reservationDetail: (props) => <ReservationDetail {...props} />,
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

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider
        initialLanguageList={["en", "cs"]}
        baseUri={Environment.get("callsBaseUri")}>
        <Uu5Elements.ModalBus>
          <Plus4U5App.Spa>
            <RouteBar />
            <Plus4U5App.Router routeMap={ROUTE_MAP} />
          </Plus4U5App.Spa>
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
