//@@viewOn:imports
import { createVisualComponent, useLsi, useState, PropTypes } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5Elements from "uu_plus4u5g02-elements";

import Config from "../config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

const UU5_TAG = Config.TAG + "DeleteDialog";

const LocationDeleteDialog = createVisualComponent({
  uu5Tag: UU5_TAG,

  propTypes: {
    open: PropTypes.bool,
    location: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onSubmitted: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  },

  defaultProps: {
    open: false,
  },

  render({ open, location, onSubmit, onSubmitted, onCancel }) {
    const lsi = useLsi(importLsi, [UU5_TAG]);
    const { showError } = Plus4U5Elements.useAlertBus({ import: importLsi, path: ["Errors"] });
    const [isPending, setIsPending] = useState(false);

    const info = String(lsi.info ?? "").replaceAll("%name%", location?.name ?? "");

    function handleConfirm(event) {
      event.preventDefault();
      setIsPending(true);
      onSubmit()
        .then((submitResult) => onSubmitted({ data: { submitResult } }))
        .catch((error) => showError(error))
        .finally(() => setIsPending(false));
    }

    if (!open) {
      return null;
    }

    return (
      <Uu5Elements.Dialog
        open
        icon="uugds-delete"
        header={lsi.header}
        info={info}
        actionDirection="horizontal"
        actionList={[
          {
            children: lsi.cancel,
            disabled: isPending,
            onClick: onCancel,
          },
          {
            children: isPending ? <Uu5Elements.Pending size="xs" colorScheme={null} /> : lsi.confirm,
            colorScheme: "negative",
            significance: "highlighted",
            disabled: isPending,
            onClick: handleConfirm,
          },
        ]}
      />
    );
  },
});

export { LocationDeleteDialog };
export default LocationDeleteDialog;
