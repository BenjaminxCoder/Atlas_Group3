import { createRiverSelector } from "./components/RiverSelector.js";
import { renderConditions } from "./components/ConditionsDisplay.js";
import { createTripForm } from "./components/TripForm.js";
import { renderLogsTable } from "./components/LogsTable.js";
import { fetchRiverConditions } from "./services/usgsAPI.js";
import { fetchWeatherByCoords } from "./services/openWeatherAPI.js";
import { getTrips } from "./services/storage.js";

/*
Main application controller.
This file wires together the UI pieces and shared app state.
 */

const app = document.querySelector("#app");

//stores current values the app needs simply. 
const state = {
  selectedRiver: "",
  selectedSiteId: "",
  conditions: null,
  weather: null,
  loading: false,
  error: "",
};

function setState(updates) {
  Object.assign(state, updates);
  renderApp();
}

//main action function for when a user selects a river site.
//When user searches new river, we wait for the data to come back from the API
//clear old errors
//the new site id is saved
//Old river/weather data is cleared
async function handleRiverLookup(siteId) {
  setState({
    loading: true,
    error: "",
    selectedSiteId: siteId,
    conditions: null,
    weather: null,
  });

  try {
    // Fetch river condition data from USGS first.
    //First API call to USGS to get river data, including coordinates if available.
    const riverData = await fetchRiverConditions(siteId);

    // If coordinates are available, use them to fetch weather data.
    // Get river info from USGS
    // Grab that rivers lat and long
    // Wait for weather data to come back from OpenWeather before updating the app state and re-rendering.
    // use those coordinates to make a second API call to OpenWeather for current weather conditions at that location.
    let weatherData = null;
    if (riverData.latitude && riverData.longitude) {
      weatherData = await fetchWeatherByCoords(riverData.latitude, riverData.longitude);
    }
// Once we have all the data we can get, we update the app state with the new river and weather info 
// which triggers a re-render to show it in the UI.
    setState({
      loading: false,
      selectedRiver: riverData.siteName || siteId,
      conditions: riverData,
      weather: weatherData,
    });

    // If any errors happen during this process, we catch them and update the error state to show a message to the user.
  } catch (error) {
    setState({
      loading: false,
      error: error.message || "Unable to load river conditions.",
    });
  }
}

//
function handleTripSaved() {
  // Re-render after saving so the logs table updates immediately.
  renderApp();
}

// The main render function for the app. 
// It sets up the overall structure of the page and calls the individual component render functions, 
// passing in the relevant pieces of state and action handlers.
function renderApp() {
  app.innerHTML = `
    <div class="container">
      <h1>AtlasFishing App</h1>
      <p>Prototype for viewing river conditions and logging fishing trips.</p>

      <section>
        <h2>Check River Conditions</h2>
        <div id="river-selector"></div>
        <div id="conditions-display"></div>
      </section>

      <section>
        <h2>Log a Fishing Trip</h2>
        <div id="trip-form"></div>
      </section>

      <section>
        <h2>Past Trips</h2>
        <div id="logs-table"></div>
      </section>
    </div>
  `;
// After setting up the static structure of the page, 
// we call the render functions for each component, passing in the relevant state and handlers.

  const riverSelectorRoot = document.querySelector("#river-selector");
  const conditionsRoot = document.querySelector("#conditions-display");
  const tripFormRoot = document.querySelector("#trip-form");
  const logsTableRoot = document.querySelector("#logs-table");

  createRiverSelector(riverSelectorRoot, handleRiverLookup, state.selectedSiteId);
  renderConditions(conditionsRoot, state);
  createTripForm(tripFormRoot, state.selectedRiver, state.selectedSiteId, handleTripSaved);
  renderLogsTable(logsTableRoot, getTrips());
}

renderApp();