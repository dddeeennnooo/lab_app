//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormNumber, SubmitButton, CancelButton } from "uu5g05-forms";
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

const FormModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "FormModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const location = props.location?.data;

    async function handleSubmit(event) {
      const dtoIn = {
        name: event.data.value.name,
        mapX: event.data.value.mapX,
        mapY: event.data.value.mapY,
      };
      try {
        if (location) {
          await props.location.handlerMap.update({ id: location.id, ...dtoIn });
        } else {
          await props.locationDataList.handlerMap.create(dtoIn);
        }
        props.onSaveDone();
      } catch (error) {
        if (error.code?.endsWith("locationAlreadyExists")) {
          return { name: { errorList: [{ feedback: "error", message: error.message }] } };
        }
        throw error;
      }
    }

    return (
      <Form.Provider onSubmit={handleSubmit}>
        <Modal
          header={location ? "Edit location" : "Create location"}
          open
          onClose={props.onClose}
          footer={
            <div>
              <CancelButton onClick={props.onClose}>Cancel</CancelButton>
              <SubmitButton>{location ? "Save" : "Create"}</SubmitButton>
            </div>
          }
        >
          <Form.View>
            <FormText name="name" label="Name" required initialValue={location?.name} />
            <FormNumber name="Usage" label="Usage" initialValue={location?.mapX} />
            <FormNumber name="Availability" label="Availability" initialValue={location?.mapY} />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
  }
});

//@@viewOn:exports
export { FormModal };
export default FormModal;
//@@viewOff:exports
