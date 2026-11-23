//@@viewOn:imports
import { createVisualComponent, useScreenSize } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

const Css = {
  routeContainer: (screenSize) => {
    let padding;
    switch (screenSize) {
      case "xs":
      case "s":
        padding = "8px 8px";
        break;
      case "m":
      case "l":
      case "xl":
      default:
        padding = "16px 16px";
    }
    return Config.Css.css`padding: ${padding};`;
  },
};

export const RouteContainer = createVisualComponent({
  render(props) {
    const [screenSize] = useScreenSize();
    return <div className={Css.routeContainer(screenSize)}>{props.children}</div>;
  },
});

export default RouteContainer;