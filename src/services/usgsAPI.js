// usgsAPI.js
/*
  Service module for fetching the latest continuous river/streamflow data from USGS.
  Now uses secure PHP proxy.
*/

// No more config.js import!

/**
 * Fetches the latest continuous river conditions (discharge) for a given USGS site ID.
 * @param {string} siteId - USGS site identifier (e.g. "12144500")
 * @returns {Promise<Object>} Latest conditions or fallback object
 */
export async function fetchRiverConditions(siteId) {
  if (!siteId || typeof siteId !== "string" || siteId.trim() === "") {
    throw new Error("A valid USGS site ID is required (example:12144500).");
  }

  // Call our secure proxy
  const url = `/atlasfishing/proxy.php?type=usgs&siteId=${encodeURIComponent(siteId.trim())}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid request: check site ID format or parameters.");
      }
      if (response.status === 404) {
        throw new Error(`No data found for USGS site ${siteId}.`);
      }
      if (response.status === 429) {
        throw new Error("USGS API rate limit exceeded.");
      }
      throw new Error(`USGS API request failed with status ${response.status}.`);
    }

    const data = await response.json();

    const feature = data?.features?.[0];
    if (!feature) {
      return {
        siteId,
        siteName: `USGS Site ${siteId}`,
        discharge: "Unavailable",
        dischargeUnit: "cfs",
        timestamp: "Unavailable",
        longitude: null,
        latitude: null,
        error: "No recent discharge data available for this site.",
      };
    }

    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [null, null];

    return {
      siteId,
      siteName: props.monitoring_location_name || `USGS Site ${siteId}`,
      discharge: props.value ?? "Unavailable",
      dischargeUnit: props.unit_of_measure ?? "cfs",
      timestamp: props.time ?? "Unavailable",
      longitude: coords[0] ?? null,
      latitude: coords[1] ?? null,
    };

  } catch (error) {
    console.error("USGS fetch error:", error.message);
    return {
      siteId,
      siteName: `USGS Site ${siteId}`,
      discharge: "Unavailable",
      dischargeUnit: "cfs",
      timestamp: "Unavailable",
      longitude: null,
      latitude: null,
      error: error.message,
    };
  }
}
