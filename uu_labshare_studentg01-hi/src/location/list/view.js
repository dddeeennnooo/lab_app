//@@viewOn:imports
import { createVisualComponent, useCallback, useLsi, useMemo, useState, Lsi } from "uu5g05";
import Uu5Elements, { useModal } from "uu5g05-elements";
import Plus4U5Elements from "uu_plus4u5g02-elements";
import Uu5Tiles from "uu5tilesg02";
import { Table } from "uu5tilesg02-elements";

import Config from "../config.js";
import importLsi from "../../lsi/import-lsi.js";
import useLocationList from "../use-location-list.js";
import LocationDetailModal from "./detail-modal.js";
import LocationCreateUpdateModal from "./form-modal.js";
import LocationDeleteDialog from "./delete-dialog.js";
//@@viewOff:imports

const UU5_TAG = Config.TAG + "List.View";

const LocationListView = createVisualComponent({
  uu5Tag: UU5_TAG,

  render(props) {
    const lsi = useLsi(importLsi, [UU5_TAG]);
    const locationDataList = useLocationList();
    const { addAlert } = Plus4U5Elements.useAlertBus();

    const [createModal, openCreateModal, closeCreateModal] = useModal();
    const [updateModal, openUpdateModal, closeUpdateModal] = useModal();
    const [deleteDialog, openDeleteDialog, closeDeleteDialog] = useModal();
    const [detailLocationId, setDetailLocationId] = useState(null);

    const { containerProps } = Plus4U5Elements.ContentContainer.splitProps(props, {
      title: lsi.title,
      subtitle: lsi.subtitle,
    });

    const loadedData = useMemo(
      () => locationDataList.data?.filter((item) => item != null) ?? [],
      [locationDataList.data],
    );

    const firstNotLoadedIndex = locationDataList.data?.findIndex((item) => item == null) ?? -1;
    const hasMore = firstNotLoadedIndex >= 0;
    const isLoading =
      locationDataList.state === "pending" || locationDataList.state === "pendingNoData";

    function reloadList() {
      return locationDataList.handlerMap.load({ pageInfo: { pageIndex: 0 } });
    }

    function openCreate() {
      openCreateModal({
        mode: "create",
        onSubmit: (event) => locationDataList.handlerMap.createItem(event.data.value),
        onSubmitted: async () => {
          closeCreateModal();
          await reloadList();
          addAlert?.({ message: lsi.createSuccess, priority: "success", durationMs: 5000 });
        },
        onCancel: closeCreateModal,
      });
    }

    function openDetail(entity) {
      setDetailLocationId(entity?.id);
    }

    function openEdit(entity) {
      openUpdateModal({
        mode: "update",
        location: entity,
        onSubmit: (event) =>
          locationDataList.handlerMap.updateItem({
            id: entity.id,
            name: event.data.value.name,
            mapX: event.data.value.mapX,
            mapY: event.data.value.mapY,
          }),
        onSubmitted: async () => {
          closeUpdateModal();
          await reloadList();
          addAlert?.({ message: lsi.updateSuccess, priority: "success", durationMs: 5000 });
        },
        onCancel: closeUpdateModal,
      });
    }

    function openDelete(entity) {
      openDeleteDialog({
        location: entity,
        onSubmit: () => locationDataList.handlerMap.deleteItem({ id: entity.id }),
        onSubmitted: async () => {
          closeDeleteDialog();
          await reloadList();
          addAlert?.({ message: lsi.deleteSuccess, priority: "success", durationMs: 5000 });
        },
        onCancel: closeDeleteDialog,
      });
    }

    const getContainerActionList = useCallback(
      () => [
        {
          icon: "uugds-plus",
          children: lsi.createAction,
          significance: "highlighted",
          colorScheme: "primary",
          onClick: openCreate,
        },
      ],
      [lsi.createAction],
    );

    const getActionList = useCallback(
      ({ data: row }) => {
        const entity = row?.data;
        return [
          {
            icon: "uugds-eye",
            children: lsi.detailAction,
            onClick: () => openDetail(entity),
          },
          {
            icon: "uugds-pencil",
            children: lsi.editAction,
            onClick: () => openEdit(entity),
          },
          {
            icon: "uugds-delete",
            colorScheme: "negative",
            children: lsi.deleteAction,
            onClick: () => openDelete(entity),
          },
        ];
      },
      [lsi.detailAction, lsi.editAction, lsi.deleteAction],
    );

    const columnList = useMemo(
      () => [
        {
          value: "name",
          header: <Lsi import={importLsi} path={[UU5_TAG, "nameColumn"]} />,
          cell: ({ data: row }) => row?.data?.name,
          minWidth: "m",
        },
        {
          value: "mapX",
          header: <Lsi import={importLsi} path={[UU5_TAG, "mapXColumn"]} />,
          cell: ({ data: row }) => row?.data?.mapX,
          maxWidth: "xs",
        },
        {
          value: "mapY",
          header: <Lsi import={importLsi} path={[UU5_TAG, "mapYColumn"]} />,
          cell: ({ data: row }) => row?.data?.mapY,
          maxWidth: "xs",
        },
      ],
      [],
    );

    function handleLoadMore() {
      locationDataList.handlerMap.loadNext();
    }

    const listFooter =
      hasMore || loadedData.length > 0 ? (
        <Uu5Elements.Box display="flex" flexDirection="column" gap={8}>
          {hasMore ? (
            <Uu5Elements.Button disabled={isLoading} onClick={handleLoadMore}>
              {lsi.loadMore}
            </Uu5Elements.Button>
          ) : null}
          <Uu5Elements.Text category="interface" segment="content" type="medium">
            {String(lsi.showingCount ?? "")
              .replaceAll("%count%", String(loadedData.length))
              .replaceAll("%total%", String(locationDataList.pageInfo?.total ?? 0))}
          </Uu5Elements.Text>
        </Uu5Elements.Box>
      ) : null;

    return (
      <>
        {detailLocationId ? (
          <LocationDetailModal locationId={detailLocationId} onClose={() => setDetailLocationId(null)} />
        ) : null}
        {createModal.open ? <LocationCreateUpdateModal {...createModal} /> : null}
        {updateModal.open ? <LocationCreateUpdateModal {...updateModal} /> : null}
        {deleteDialog.open ? <LocationDeleteDialog {...deleteDialog} /> : null}

        <Uu5Tiles.ControllerProvider data={loadedData} pending={locationDataList.pendingData}>
          <Plus4U5Elements.ContentContainer
            {...containerProps}
            nestingLevel="route"
            getActionList={getContainerActionList}
            lsiError={{ import: importLsi, path: ["Errors"] }}
            dataMap={{ locationList: { dataObject: locationDataList } }}
            footer={listFooter}
            footerSeparator
          >
            <Table columnList={columnList} getActionList={getActionList} height="auto" alternateRowBackground />
          </Plus4U5Elements.ContentContainer>
        </Uu5Tiles.ControllerProvider>
      </>
    );
  },
});

export { LocationListView };
export default LocationListView;
