//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements, { useModal } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import DataListStateResolver from "../../data-list-state-resolver.js";
import Content from "./content.js";
import CreateModal from "./create-modal.js";
import UpdateModal from "./update-modal.js";
import DetailModal from "./detail-modal.js";
import DeleteModal from "./delete-modal.js";
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
function getFilters(locationDataList) {
  const locationItemList = (locationDataList.data || []).map((item) => ({
    value: item.data.id,
    children: item.data.name,
  }));
  return [
    { key: "name", label: "Name", inputType: "text" },
    { key: "locationId", label: "Location", inputType: "select", inputProps: { itemList: locationItemList } },
  ];
}

function getSorters() {
  return [
    { key: "name", label: "Name" },
    { key: "sys.cts", label: "Created" },
  ];
}
//@@viewOff:helpers

const View = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "View",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { equipmentDataList, locationDataList, filterList, sorterList } = props;
    const [createModal, openCreateModal] = useModal();
    const [updateModal, openUpdateModal] = useModal();
    const [detailModal, openDetailModal] = useModal();
    const [deleteModal, openDeleteModal] = useModal();

    function handleLoad(event) {
      return equipmentDataList.handlerMap.load(event?.data);
    }

    return (
      <>
        <ControllerProvider
          data={equipmentDataList.data}
          filterDefinitionList={getFilters(locationDataList)}
          sorterDefinitionList={getSorters()}
          filterList={filterList}
          sorterList={sorterList}
          onFilterChange={handleLoad}
          onSorterChange={handleLoad}
        >
          <Uu5Elements.Block
            header="Equipment"
            actionList={[
              { component: FilterButton },
              { component: SorterButton },
              { icon: "mdi-plus", children: "Create", onClick: () => openCreateModal() },
            ]}
          >
            <DataListStateResolver dataList={equipmentDataList}>
              <Content
                equipmentDataList={equipmentDataList}
                locationDataList={locationDataList}
                onDetail={(row) => openDetailModal({ equipment: row })}
                onUpdate={(row) => openUpdateModal({ equipment: row })}
                onDelete={(row) => openDeleteModal({ equipment: row })}
              />
            </DataListStateResolver>
          </Uu5Elements.Block>
        </ControllerProvider>
        {createModal.open && (
          <CreateModal {...createModal} equipmentDataList={equipmentDataList} locationDataList={locationDataList} onSaveDone={createModal.onClose} />
        )}
        {updateModal.open && (
          <UpdateModal {...updateModal} equipment={updateModal.equipment} locationDataList={locationDataList} equipmentDataList={equipmentDataList} onSaveDone={updateModal.onClose} />
        )}
        {detailModal.open && (
          <DetailModal {...detailModal} id={detailModal.equipment.data.id} locationDataList={locationDataList} equipmentDataList={equipmentDataList} />
        )}
        {deleteModal.open && <DeleteModal {...deleteModal} equipment={deleteModal.equipment} onDeleteDone={deleteModal.onClose} />}
      </>
    );
  },
});

//@@viewOn:exports
export { View };
export default View;
//@@viewOff:exports
