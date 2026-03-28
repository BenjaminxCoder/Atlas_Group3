// openWeatherAPI.js
/*
  Service module for fetching current weather data from OpenWeatherMap.
  Now uses secure PHP proxy.
*/

// No more config.js import!

/**
 * Fetches current weather conditions for the given coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Current weather data or fallback object
 */
export async function fetchWeatherByCoords(lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number") {
        throw new Error("Invalid latitude or longitude.");
  }

  // Call our secure proxy instead of OpenWeather directly
  const url = `/atlasfishing/proxy.php?type=weather&lat=${lat}&lon=${lon}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      temperature: data.main?.temp ?? "Unavailable",
      humidity:    data.main?.humidity ?? "Unavailable",
      windSpeed:   data.wind?.speed ?? "Unavailable",
      description: data.weather?.[0]?.description ?? "Unavailable",
    };

  } catch (error) {
    console.error("Weather fetch error:", error.message);
    return {
      temperature: "Unavailable",
      humidity:    "Unavailable",
      windSpeed:   "Unavailable",
      description: "Service unavailable",
      error:       error.message,
    };
  }
}
