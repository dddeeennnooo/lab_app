//@@viewOn:imports
import { createVisualComponent, Utils, useState } from "uu5g05";
import Config from "./config/config.js";
import { Dialog } from "uu5g05-elements";
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

const DeleteModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DeleteModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [error, setError] = useState();

    async function handleDelete() {
      try {
        await props.equipment.handlerMap.delete(props.equipment.data);
        props.onDeleteDone();
      } catch (e) {
        if (e.code?.endsWith("equipmentHasActiveReservation")) {
          setError(e.message);
          return;
        }
        throw e;
      }
    }
    //@@viewOff:render
    return (
      <Dialog
        open
        onClose={props.onClose}
        header="Delete equipment"
        info={error || "Delete " + props.equipment.data.name + "?"}
        actionList={[
          { children: "Cancel", onClick: props.onClose },
          { children: "Delete", onClick: handleDelete },
        ]}
      />
    );
  },
});

//@@viewOn:exports
export { DeleteModal };
export default DeleteModal;
//@@viewOff:exports
