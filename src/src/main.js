import { createRiverSelector } from "./components/RiverSelector.js";
import { renderConditions } from "./components/ConditionsDisplay.js";
import { createTripForm } from "./components/TripForm.js";
import { renderLogsTable } from "./components/LogsTable.js";
import { fetchRiverConditions } from "./services/usgsAPI.js";
import { fetchWeatherByCoords } from "./services/openWeatherAPI.js";

/* Updated storage import - full CRUD now available */
import { getTrips, saveTrip } from "./services/storage.js";

/*
Main application controller.
This file wires together the UI pieces and shared app state.
 */
const app = document.querySelector("#app");

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

async function handleRiverLookup(siteId) {
  setState({
    loading: true,
    error: "",
    selectedSiteId: siteId,
    conditions: null,
    weather: null,
  });

  try {
    const riverData = await fetchRiverConditions(siteId);
    let weatherData = null;
    if (riverData.latitude !== null && riverData.longitude !== null) {
      const roundedLat = Number(riverData.latitude.toFixed(2));
      const roundedLon = Number(riverData.longitude.toFixed(2));
      weatherData = await fetchWeatherByCoords(roundedLat, roundedLon);
    }
    setState({
      loading: false,
      selectedRiver: riverData.siteName || siteId,
      conditions: riverData,
      weather: weatherData,
    });
  } catch (error) {
    setState({
      loading: false,
      error: error.message || "Unable to load river conditions.",
    });
  }
}

/* Updated handler - now uses the new saveTrip function */
function handleTripSaved(tripData) {
  const success = saveTrip(tripData);
  if (success) {
    renderApp(); // Refresh logs table
  } else {
    alert("Failed to save trip. Please check your input.");
  }
}

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
