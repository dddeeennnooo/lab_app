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

const DeleteDialog = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DeleteDialog",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const [error, setError] = useState();

    async function handleDelete() {
      try {
        await props.location.handlerMap.delete(props.location.data);
        props.onDeleteDone();
      } catch (e) {
        if (e.code?.endsWith("locationIsUsed")) {
          setError(e.message);
          return;
        }
        throw e;
      }
    }

    return (
      <Dialog
        open
        onClose={props.onClose}
        header="Delete location"
        info={error || "Delete " + props.location.data.name + "?"}
        actionList={[
          { children: "Cancel", onClick: props.onClose },
          { children: "Delete", onClick: handleDelete },
        ]}
      />
    );
  }
});

//@@viewOn:exports
export { DeleteDialog };
export default DeleteDialog;
//@@viewOff:exports
