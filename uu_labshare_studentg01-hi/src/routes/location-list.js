//@@viewOn:imports
import { createVisualComponent, useLsi } from "uu5g05";
import Plus4U5Elements from "uu_plus4u5g02-elements";
import { withRoute } from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

const UU5_TAG = Config.TAG + "LocationList";

let LocationList = createVisualComponent({
  uu5Tag: UU5_TAG,

  render(props) {
    const lsi = useLsi(importLsi, [UU5_TAG]);
    const { containerProps } = Plus4U5Elements.ContentContainer.splitProps(props, { title: lsi.title });

    return <Plus4U5Elements.ContentContainer {...containerProps} nestingLevel="route" />;
  },
});

LocationList = withRoute(LocationList, { authenticated: true });

export { LocationList };
export default LocationList;
