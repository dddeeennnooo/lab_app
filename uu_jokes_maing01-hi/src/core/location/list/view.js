//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
import Uu5Elements, { useModal } from "uu5g05-elements";
import DataListStateResolver from "../../data-list-state-resolver.js";
import Content from "./content.js";
import DetailModal from "./detail-modal.js";
import FormModal from "./form-modal.js";
import DeleteDialog from "./delete-dialog.js";
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
    const { locationDataList } = props;
    const [createModal, openCreateModal] = useModal();
    const [updateModal, openUpdateModal] = useModal();
    const [detailModal, openDetailModal] = useModal();
    const [deleteModal, openDeleteModal] = useModal();

    return (
      <>
        <Uu5Elements.Block
          header="Locations"
          actionList={[{ icon: "mdi-plus", children: "Create", onClick: () => openCreateModal() }]}
        >
          <DataListStateResolver dataList={locationDataList}>
            <Content
              locationDataList={locationDataList}
              onDetail={(row) => openDetailModal({ location: row })}
              onUpdate={(row) => openUpdateModal({ location: row })}
              onDelete={(row) => openDeleteModal({ location: row })}
            />
          </DataListStateResolver>
        </Uu5Elements.Block>
        {createModal.open && (
          <FormModal {...createModal} locationDataList={locationDataList} onSaveDone={createModal.onClose} />
        )}
        {updateModal.open && (
          <FormModal {...updateModal} location={updateModal.location} locationDataList={locationDataList} onSaveDone={updateModal.onClose} />
        )}
        {detailModal.open && (
          <DetailModal {...detailModal} id={detailModal.location.data.id} />
        )}
        {deleteModal.open && (
          <DeleteDialog {...deleteModal} location={deleteModal.location} onDeleteDone={deleteModal.onClose} />
        )}
      </>
    );
  }
});

//@@viewOn:exports
export { View };
export default View;
//@@viewOff:exports
