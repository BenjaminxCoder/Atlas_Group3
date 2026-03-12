
//Service for requesting weather data from OpenWeather.


const API_KEY = "6640a95ca63a277f5f95e50a2f382ace"; // Note: IRL, API keys should be stored securely and not exposed in client-side code :)

export async function fetchWeatherByCoords(lat, lon) {
  if (!lat || !lon) {
    throw new Error("Latitude and longitude are required for weather lookup.");
  }

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("OpenWeather request failed.");
  }

  const data = await response.json();
  const current = data

  return {
    temperature: current?.main?.temp ?? "Unavailable",
    humidity: current?.main?.humidity ?? "Unavailable",
    windSpeed: current?.wind?.speed ?? "Unavailable",
    description: current?.weather?.[0]?.description ?? "Unavailable",
  };
}