"use strict";

const { UVE_ROUTES } = require("./workspace-constants.js");

function buildAppBaseHref(baseUri) {
  const uriString = baseUri?.toString ? baseUri.toString() : String(baseUri);
  return uriString.endsWith("/") ? uriString : `${uriString}/`;
}

function buildPlus4u5LocalNavigation(baseUri) {
  const href = (route) => buildAppBaseHref(baseUri) + route;

  return {
    itemList: [
      {
        icon: "uugds-home",
        children: { en: "Welcome", cs: "Vítejte" },
        href: href(UVE_ROUTES.HOME),
        mobileOrder: 0,
      },
      {
        icon: "uugds-map-pin",
        children: { en: "Locations", cs: "Lokality" },
        href: href(UVE_ROUTES.LOCATION_LIST),
      },
      {
        icon: "uugds-toolbox",
        children: { en: "Equipment", cs: "Vybavení" },
        href: href(UVE_ROUTES.EQUIPMENT_LIST),
      },
      {
        icon: "uugds-calendar",
        children: { en: "Reservations", cs: "Rezervace" },
        href: href(UVE_ROUTES.RESERVATION_LIST),
      },
    ],
  };
}

function attachPlus4u5LocalNavigation(dtoOut, baseUri) {
  dtoOut.data = dtoOut.data || {};
  dtoOut.data.plus4u5LocalNavigation = buildPlus4u5LocalNavigation(baseUri);
  return dtoOut;
}

module.exports = {
  attachPlus4u5LocalNavigation,
  buildPlus4u5LocalNavigation,
};
