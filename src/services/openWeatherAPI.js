import { CONFIG } from "../../config.js";
/*
  Service for requesting weather data from OpenWeather.
*/
const API_KEY = CONFIG.OPENWEATHER_API_KEY;

export async function fetchWeatherByCoords(lat, lon) {
  if (!lat || !lon) {
    throw new Error("Latitude and longitude are required for weather lookup.");
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("OpenWeather request failed.");
  }

  const data = await response.json();
  const current = data?.current || {};

  return {
    temperature: current?.temp ?? "Unavailable",
    humidity: current?.humidity ?? "Unavailable",
    windSpeed: current?.wind_speed ?? "Unavailable",
    description: current?.weather?.[0]?.description ?? "Unavailable",
  };
}