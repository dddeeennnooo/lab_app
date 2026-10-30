//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import LocationList from "../location/list.js";
//@@viewOff:imports

const UU5_TAG = Config.TAG + "LocationList";

let LocationListRoute = createVisualComponent({
  uu5Tag: UU5_TAG,

  render(props) {
    return <LocationList {...props} />;
  },
});

LocationListRoute = withRoute(LocationListRoute, { authenticated: true });

export { LocationListRoute };
export default LocationListRoute;
