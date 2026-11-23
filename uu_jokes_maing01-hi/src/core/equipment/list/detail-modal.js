//@@viewOn:imports
import { createVisualComponent, Utils, useDataObject } from "uu5g05";
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
function locationNameById(locationDataList, locationId) {
  return locationDataList.data?.find((item) => item.data.id === locationId)?.data.name;
}

function compatibleNames(equipmentDataList, idList) {
  return (idList || [])
    .map((id) => equipmentDataList.data?.find((item) => item.data.id === id)?.data.name)
    .filter(Boolean)
    .join(", ");
}
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
    const { id, locationDataList, equipmentDataList } = props;
    const equipmentDto = useDataObject({
      handlerMap: { load: () => Calls.Equipment.get({ id }) },
    });
    const equipment = equipmentDto.data;

    return (
      <Modal header="Equipment" open onClose={props.onClose}>
        <DataObjectStateResolver dataObject={equipmentDto}>
          <InfoGroup
            itemList={[
              { subtitle: "Name", title: equipment?.name },
              { subtitle: "Location", title: locationNameById(locationDataList, equipment?.locationId) },
              { subtitle: "Compatible", title: compatibleNames(equipmentDataList, equipment?.compatibleIdList) },
            ]}
          />
        </DataObjectStateResolver>
      </Modal>
    );
  },
});
//@@viewOn:exports
export { DetailModal };
export default DetailModal;
//@@viewOff:exports
