//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Table } from "uu5tilesg02-elements";
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
//@@viewOff:helpers

const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { equipmentDataList, locationDataList, onDetail, onUpdate, onDelete } = props;

    function handleLoadNext({ indexFrom }) {
      const pageSize = equipmentDataList.pageSize;
      equipmentDataList.handlerMap.loadNext({
        pageSize,
        pageIndex: Math.floor(indexFrom / pageSize),
      });
    }

    const columnList = [
      { value: "name", header: "Name", cell: ({ data }) => data.data.name },
      {
        value: "location",
        header: "Location",
        cell: ({ data }) => locationNameById(locationDataList, data.data.locationId) || data.data.locationId,
      },
    ];

    return (
      <Table
        data={equipmentDataList.data}
        columnList={columnList}
        onLoad={handleLoadNext}
        getActionList={({ data }) => [
          { children: "Detail", onClick: () => onDetail(data) },
          { children: "Edit", onClick: () => onUpdate(data) },
          { children: "Delete", onClick: () => onDelete(data) },
        ]}
      />
    );
  },
});

//@@viewOn:exports
export { Content };
export default Content;
//@@viewOff:exports
