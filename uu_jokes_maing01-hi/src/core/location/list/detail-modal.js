//@@viewOn:imports
import { createVisualComponent, useDataObject } from "uu5g05";
import Config from "./config/config.js";
import { Modal, InfoGroup } from "uu5g05-elements";
import DataObjectStateResolver from "../../data-object-state-resolver.js";
import Calls from "calls";

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

const DetailModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const locationDto = useDataObject({
      handlerMap: { load: () => Calls.Location.get({ id: props.id }) },
    });
    const location = locationDto.data;

    return (
      <Modal header="Location" open onClose={props.onClose}>
        <DataObjectStateResolver dataObject={locationDto}>
          <InfoGroup
            itemList={[
              { subtitle: "Name", title: location?.name },
              { subtitle: "Usage", title: location?.mapX },
              { subtitle: "Availability", title: location?.mapY },
            ]}
          />
        </DataObjectStateResolver>
      </Modal>
    );
  }
});

//@@viewOn:exports
export { DetailModal };
export default DetailModal;
//@@viewOff:exports
