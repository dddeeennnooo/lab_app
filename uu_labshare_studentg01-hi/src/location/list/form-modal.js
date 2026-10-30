//@@viewOn:imports
import { createVisualComponent, useLsi, PropTypes } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5Elements from "uu_plus4u5g02-elements";
import Uu5Forms from "uu5g05-forms";

import Config from "../config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

const UU5_TAG = Config.TAG + "CreateUpdateModal";

const LocationCreateUpdateModal = createVisualComponent({
  uu5Tag: UU5_TAG,

  propTypes: {
    open: PropTypes.bool,
    mode: PropTypes.oneOf(["create", "update"]),
    location: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onSubmitted: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  },

  defaultProps: {
    open: false,
    mode: "create",
  },

  render(props) {
    const { open, mode, location, onSubmit, onSubmitted, onCancel } = props;
    const lsi = useLsi(importLsi, [UU5_TAG]);
    const { showError } = Plus4U5Elements.useAlertBus({ import: importLsi, path: ["Errors"] });

    const isUpdate = mode === "update";
    const header = isUpdate ? lsi.updateHeader : lsi.createHeader;
    const submitLabel = isUpdate ? lsi.updateSubmit : lsi.createSubmit;

    const initialValue = isUpdate
      ? {
          name: location?.name ?? "",
          mapX: location?.mapX ?? 0,
          mapY: location?.mapY ?? 0,
        }
      : undefined;

    async function handleSubmit(event) {
      try {
        const submitResult = await onSubmit(event);
        onSubmitted({ data: { submitResult } });
      } catch (error) {
        showError(error);
        throw new Uu5Forms.Form.UnhandledError(error);
      }
    }

    if (!open) {
      return null;
    }

    return (
      <Uu5Forms.Form.Provider onSubmit={handleSubmit} initialValue={initialValue}>
        {({ cancel }) => (
          <Uu5Elements.Modal
            open
            header={header}
            info={isUpdate ? location?.name : lsi.createInfo}
            onClose={async () => {
              if (await cancel()) {
                onCancel();
              }
            }}
            footer={
              <>
                <Uu5Forms.CancelButton
                  onClick={async () => {
                    if (await cancel()) {
                      onCancel();
                    }
                  }}
                >
                  {lsi.cancel}
                </Uu5Forms.CancelButton>
                <Uu5Forms.SubmitButton colorScheme="primary" significance="highlighted">
                  {submitLabel}
                </Uu5Forms.SubmitButton>
              </>
            }
          >
            <Uu5Forms.Form.View gridLayout="name, mapX, mapY">
              <Uu5Forms.FormText name="name" label={lsi.nameLabel} required autoFocus />
              <Uu5Forms.FormNumber name="mapX" label={lsi.mapXLabel} />
              <Uu5Forms.FormNumber name="mapY" label={lsi.mapYLabel} />
            </Uu5Forms.Form.View>
          </Uu5Elements.Modal>
        )}
      </Uu5Forms.Form.Provider>
    );
  },
});

export { LocationCreateUpdateModal };
export default LocationCreateUpdateModal;
