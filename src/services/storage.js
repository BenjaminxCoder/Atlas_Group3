/**
 * Simple localStorage repository for fishing trips.
 * This acts like a lightweight persistence layer for the prototype.
 */

const STORAGE_KEY = "atlasFishingTrips";

export function getTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read trips from storage:", error);
    return [];
  }
}

export function saveTrip(trip) {
  const trips = getTrips();
  trips.push(trip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function clearTrips() {
  localStorage.removeItem(STORAGE_KEY);
}