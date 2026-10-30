//@@viewOn:imports
import { createVisualComponent, useDataObject, useLsi, useMemo, PropTypes, Lsi } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5App from "uu_plus4u5g02-app";
import Calls from "calls";

import Config from "../config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

const UU5_TAG = Config.TAG + "DetailModal";

const LocationDetailModal = createVisualComponent({
  uu5Tag: UU5_TAG,

  propTypes: {
    locationId: PropTypes.string,
    onClose: PropTypes.func,
  },

  render({ locationId, onClose }) {
    const lsi = useLsi(importLsi, [UU5_TAG]);

    const handlerMap = useMemo(
      () => ({
        load: locationId ? () => Calls.getLocation({ id: locationId }) : undefined,
      }),
      [locationId],
    );

    const locationDto = useDataObject(
      {
        handlerMap,
        skipInitialLoad: !locationId,
      },
      [locationId],
    );

    let body;
    if (locationDto.state === "error" || locationDto.state === "errorNoData") {
      body = (
        <Plus4U5App.Error error={locationDto.errorData?.error}>
          <Lsi import={importLsi} path={[UU5_TAG, "loadError"]} />
        </Plus4U5App.Error>
      );
    } else if (locationDto.state === "pending" || locationDto.state === "pendingNoData") {
      body = <Plus4U5App.SpaPending />;
    } else {
      const location = locationDto.data;
      body = (
        <Uu5Elements.InfoGroup
          itemList={[
            { subtitle: lsi.nameLabel, title: location?.name },
            { subtitle: lsi.mapXLabel, title: location?.mapX },
            { subtitle: lsi.mapYLabel, title: location?.mapY },
          ]}
        />
      );
    }

    const header =
      locationDto.state === "ready" || locationDto.state === "readyNoData"
        ? locationDto.data?.name
        : lsi.header;

    return (
      <Uu5Elements.Modal open onClose={onClose} header={header}>
        {body}
      </Uu5Elements.Modal>
    );
  },
});

export { LocationDetailModal };
export default LocationDetailModal;
