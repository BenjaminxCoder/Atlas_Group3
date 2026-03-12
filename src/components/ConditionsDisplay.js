
 //Renders current river and weather conditions.
 //Handles loading, error, and empty states.
 

 
export function renderConditions(root, state) {

  if (state.loading) {
    root.innerHTML = `<p>Loading river and weather conditions...</p>`;
    return;
  }

  if (state.error) {
    root.innerHTML = `<p class="error">${state.error}</p>`;
    return;
  }

  if (!state.conditions) {
    root.innerHTML = `<p>No conditions loaded yet.</p>`;
    return;
  }

  root.innerHTML = `
    <div class="card">
      <h3>${state.conditions.siteName}</h3>
      <p><strong>Site ID:</strong> ${state.conditions.siteId}</p>
      <p><strong>Discharge:</strong> ${state.conditions.discharge} ${state.conditions.dischargeUnit}</p>
      <p><strong>Observed:</strong> ${state.conditions.timestamp}</p>

      ${
        state.weather
          ? `
          <hr />
          <p><strong>Temperature:</strong> ${state.weather.temperature} °F</p>
          <p><strong>Conditions:</strong> ${state.weather.description}</p>
          <p><strong>Wind:</strong> ${state.weather.windSpeed} mph</p>
          <p><strong>Humidity:</strong> ${state.weather.humidity}%</p>
        `
          : `<p>Weather data unavailable.</p>`
      }
    </div>
  `;
}