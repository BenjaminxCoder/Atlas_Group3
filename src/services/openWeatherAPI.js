// openWeatherAPI.js
/*
  Service module for fetching current weather data from OpenWeatherMap One Call API 3.0.
  - Requires latitude and longitude coordinates.
  - Uses imperial units.
  - Excludes unused forecast data to optimize response size and API quota usage.
  - Returns only current weather fields relevant to the AtlasFishing App.
*/

// Secured Keys & Data
import { CONFIG } from "../../config.js";

const API_KEY = CONFIG.OPENWEATHER_API_KEY;
const BASE_URL = CONFIG.OPENWEATHER_BASE_URL;

if (!API_KEY || API_KEY.trim() === "") {
  console.error("OpenWeatherMap API key is missing or empty. Check config.js.");
}

/**
 * Fetches current weather conditions for the given coordinates.
 * @param {number} lat - Latitude (-90 to 90)
 * @param {number} lon - Longitude (-180 to 180)
 * @returns {Promise<Object>} Current weather data or fallback object on failure
 * @throws {Error} If coordinates are invalid or API request fails
 */
export async function fetchWeatherByCoords(lat, lon) {
  // Input validation
  if (typeof lat !== "number" || typeof lon !== "number" ||
      lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error("Invalid latitude or longitude values.");
  }

  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not configured.");
  }

  // Build URL with exclusions to minimize payload
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}` +
              `&exclude=minutely,hourly,daily,alerts` +
              `&units=imperial` +
              `&appid=${API_KEY}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Invalid or missing OpenWeatherMap API key.");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded for OpenWeatherMap API.");
      }
      throw new Error(`OpenWeatherMap request failed with status ${response.status}.`);
    }
    const data = await response.json();

    // Safely extract current weather
    const current = data?.current ?? {};
    const weatherItem = current?.weather?.[0] ?? {};

    return {
      temperature: current.temp    ?? "Unavailable",
      humidity:    current.humidity ?? "Unavailable",
      windSpeed:   current.wind_speed ?? "Unavailable",
      description: weatherItem.description ?? "Unavailable",
    };

  } catch (error) {
    console.error("Weather fetch error:", error.message);
    // Return fallback object instead of throwing so UI can display gracefully
    return {
      temperature: "Unavailable",
      humidity:    "Unavailable",
      windSpeed:   "Unavailable",
      description: "Service unavailable",
      error:       error.message,
    };
  }
}