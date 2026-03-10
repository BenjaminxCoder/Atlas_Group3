/**
Service for requesting river data from the USGS API.
 */

export async function fetchRiverConditions(siteId) {
  if (!siteId) {
    throw new Error("A USGS site ID is required.");
  }

  // Prototype endpoint for latest continuous data.
  const url = `https://api.waterdata.usgs.gov/ogcapi/v0/collections/latest-continuous/items?monitoring_location_id=USGS-${siteId}&parameter_code=00060`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("USGS request failed.");
  }

  const data = await response.json();

  // API response structures can vary so this will safely inspect nested values.
  const firstFeature = data?.features?.[0];
  const props = firstFeature?.properties || {};
  const coords = firstFeature?.geometry?.coordinates || [];

  return {
    siteId,
    siteName: props?.monitoring_location_name || `USGS Site ${siteId}`,
    discharge: props?.result_measure || "Unavailable",
    dischargeUnit: props?.result_unit || "cfs",
    timestamp: props?.phenomenon_time || "Unavailable",
    longitude: coords[0] || null,
    latitude: coords[1] || null,
  };
}