//@@viewOn:imports
import LocationListProvider from "./provider.js";
import LocationListView from "./list/view.js";
//@@viewOff:imports

function LocationList(props) {
  return (
    <LocationListProvider>
      <LocationListView {...props} />
    </LocationListProvider>
  );
}

export { LocationList };
export default LocationList;
