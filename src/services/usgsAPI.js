
// usgsAPI.js
/*
  Service module for fetching the latest continuous river/streamflow data from the USGS Water Data OGC API.
  - Targets the /latest-continuous/items endpoint for the most recent observation.
  - Focuses on discharge (parameter code 00060, cubic feet per second).
  - Returns site metadata, latest discharge value, timestamp, and coordinates.
  - Graceful error handling and fallbacks for UI stability.
*/

// Secured Keys & Data
import { CONFIG } from "../../config.js";

const BASE_URL = CONFIG.USGS_BASE_URL;

/**
 * Fetches the latest continuous river conditions (discharge) for a given USGS site ID.
 * @param {string} siteId - USGS site identifier ("12144500" for Snoqualmie near Carnation)
 * @returns {Promise<Object>} Latest conditions or fallback object on failure
 * @throws {Error} If siteId is invalid or API request fails critically
 */
export async function fecthRiverConditions(siteId) {
  // Input validation
  if (!siteId || typeof siteId !== "string" || siteId.trim() === "") {
    throw new Error("A valid USGS site ID is required (example:12144500).");
  }

  // Construct query: filter by full monitoring location ID and discharge parameter
  const fullLocationId = `USGS-${siteId.trim()}`;
  const url = `${BASE_URL}?` +
              `monitoring_location_id=${encodeURIComponent(fullLocationId)}` +
              `&parameter_code=00060` +
              `&limit=1`;  // Only need the latest single value

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

    // Expect GeoJSON FeatureCollection; take first (and usually only) feature
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
    // Return safe fallback so UI doesn't break
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