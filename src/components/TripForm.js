import { saveTrip } from "../services/storage.js";

/**
 * Renders the fishing trip form and validates user input before saving.
 */

export function createTripForm(root, riverName, siteId, onTripSaved) {
  root.innerHTML = `
    <form id="trip-form-element">
      <div>
        <label for="trip-date">Date:</label>
        <input id="trip-date" name="date" type="date" required />
      </div>

      <div>
        <label for="trip-river">River:</label>
        <input
          id="trip-river"
          name="river"
          type="text"
          value="${riverName || siteId || ""}"
          placeholder="River or site ID"
          required
        />
      </div>

      <div>
        <label for="trip-catch-count">Catch Count:</label>
        <input
          id="trip-catch-count"
          name="catchCount"
          type="number"
          min="0"
          placeholder="0"
          required
        />
      </div>

      <div>
        <label for="trip-notes">Notes:</label>
        <textarea id="trip-notes" name="notes" rows="4" placeholder="Optional notes"></textarea>
      </div>

      <button type="submit">Save Trip</button>
      <p id="trip-form-message"></p>
    </form>
  `;

  const form = root.querySelector("#trip-form-element");
  const message = root.querySelector("#trip-form-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";

    const formData = new FormData(form);
    const date = formData.get("date");
    const river = formData.get("river").trim();
    const catchCount = Number(formData.get("catchCount"));
    const notes = formData.get("notes").trim();

    // Basic validation for the prototype.
    if (!date || !river) {
      message.textContent = "Date and river are required.";
      return;
    }

    if (Number.isNaN(catchCount) || catchCount < 0) {
      message.textContent = "Catch count must be 0 or greater.";
      return;
    }

    const trip = {
      id: crypto.randomUUID(),
      date,
      river,
      catchCount,
      notes,
    };

    saveTrip(trip);
    message.textContent = "Trip saved successfully.";
    form.reset();

    if (onTripSaved) {
      onTripSaved();
    }
  });
}