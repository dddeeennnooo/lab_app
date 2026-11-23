//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormSelect, SubmitButton, CancelButton } from "uu5g05-forms";
import Config from "./config/config.js";
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

const CreateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    async function handleSubmit(event) {
      try {
        await props.equipmentDataList.handlerMap.create(event.data.value);
        props.onSaveDone();
      } catch (error) {
        if (error.code?.endsWith("equipmentNameAlreadyExists")) {
          return { name: { errorList: [{ feedback: "error", message: error.message }] } };
        }
        throw error;
      }
    }
    //@@viewOff:render
    const locationItemList = (props.locationDataList.data || []).map((item) => ({
      value: item.data.id,
      children: item.data.name,
    }));
    const equipmentItemList = (props.equipmentDataList.data || []).map((item) => ({
      value: item.data.id,
      children: item.data.name,
    }));
    return (
      <Form.Provider onSubmit={handleSubmit}>
        <Modal
          header="Create equipment"
          open
          onClose={props.onClose}
          footer={
            <div>
              <CancelButton onClick={props.onClose}>Cancel</CancelButton>
              <SubmitButton>Create</SubmitButton>
            </div>
          }>
          <Form.View>
            <FormText name="name" label="Name" required />
            <FormSelect name="locationId" label="Location" required itemList={locationItemList} />
            <FormSelect name="compatibleIdList" label="Compatible" multiple itemList={equipmentItemList} />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
  },
});

//@@viewOn:exports
export { CreateModal };
export default CreateModal;
//@@viewOff:exports
