/**
 * AtlasFishing Trip Repository
 *
 * Manages persistence of fishing trip records using localStorage.
 * This is the data layer for v0.2 (client-side prototype).
 * Future: Easily replace localStorage with API calls.
 */

const STORAGE_KEY = "atlasFishingTrips";

/**
 * Get all saved fishing trips
 * @returns {Array} Array of trip objects
 */
export function getTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read trips from storage:", error);
    return [];
  }
}

/**
 * Save a new fishing trip
 * @param {Object} trip - Trip data { date, river, catchCount, notes? }
 * @returns {boolean} Success status
 */
export function saveTrip(trip) {
  if (!trip.date || !trip.river || typeof trip.catchCount !== "number" || trip.catchCount < 0) {
    console.error("Invalid trip data: missing fields or negative catch count");
    return false;
  }

  const trips = getTrips();
  const newTrip = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    date: trip.date,
    river: trip.river,
    catchCount: parseInt(trip.catchCount),
    notes: trip.notes || "",
    timestamp: new Date().toISOString()
  };

  trips.push(newTrip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return true;
}

/**
 * Update an existing trip by ID
 */
export function updateTrip(id, updatedData) {
  const trips = getTrips();
  const index = trips.findIndex(t => t.id === id);
  if (index === -1) return false;

  trips[index] = { ...trips[index], ...updatedData };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return true;
}

/**
 * Delete a trip by ID
 */
export function deleteTrip(id) {
  const trips = getTrips();
  const filtered = trips.filter(t => t.id !== id);

  if (filtered.length === trips.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get a single trip by ID
 */
export function getTripById(id) {
  return getTrips().find(t => t.id === id) || null;
}

/**
 * Clear all trips
 */
export function clearTrips() {
  localStorage.removeItem(STORAGE_KEY);
}
