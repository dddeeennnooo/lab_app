//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
//@@viewOff:imports

// App section navigation is provided by sys/uuAppWorkspace/load → data.plus4u5LocalNavigation (see server).
// Use this wrapper only for non-ContentContainer routes that need route-level actions (Help, etc.), not for menu links.

const RouteBar = createVisualComponent({
  uu5Tag: Config.TAG + "RouteBar",

  propTypes: {
    ...Plus4U5App.PositionBar.propTypes,
  },

  render(props) {
    return <Plus4U5App.PositionBar actionList={[]} {...props} />;
  },
});

export { RouteBar };
export default RouteBar;
