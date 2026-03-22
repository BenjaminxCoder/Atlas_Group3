import { saveTrip } from "../services/storage.js";

/**
 * Renders the fishing trip form and validates user input before saving.
 * @param {HTMLElement} root - The container element
 * @param {string} riverName - Pre-filled river name
 * @param {string} siteId - USGS site ID
 * @param {Function} onTripSaved - Callback when a trip is successfully saved
 */
export function createTripForm(root, riverName, siteId, onTripSaved) {
  root.innerHTML = `
    <form id="trip-form-element">
      <div class="mb-3">
        <label for="trip-date" class="form-label">Date:</label>
        <input id="trip-date" name="date" type="date" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="trip-river" class="form-label">River:</label>
        <input
          id="trip-river"
          name="river"
          type="text"
          class="form-control"
          value="${riverName || siteId || ""}"
          placeholder="River or site ID"
          required
        />
      </div>
      <div class="mb-3">
        <label for="trip-catch-count" class="form-label">Catch Count:</label>
        <input
          id="trip-catch-count"
          name="catchCount"
          type="number"
          min="0"
          class="form-control"
          placeholder="0"
          required
        />
      </div>
      <div class="mb-3">
        <label for="trip-notes" class="form-label">Notes:</label>
        <textarea id="trip-notes" name="notes" class="form-control" rows="3" placeholder="Optional notes"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Save Trip</button>
      <p id="trip-form-message" class="mt-2 text-danger"></p>
    </form>
  `;

  const form = root.querySelector("#trip-form-element");
  const message = root.querySelector("#trip-form-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";
    message.className = "mt-2 text-danger";

    const formData = new FormData(form);
    const date = formData.get("date");
    const river = formData.get("river")?.trim();
    const catchCount = Number(formData.get("catchCount"));
    const notes = formData.get("notes")?.trim() || "";

    // Validation
    if (!date || !river) {
      message.textContent = "Date and river are required.";
      return;
    }

    if (Number.isNaN(catchCount) || catchCount < 0) {
      message.textContent = "Catch count must be 0 or greater.";
      return;
    }

    // Build trip object
    const trip = {
      date: date,
      river: river,
      catchCount: catchCount,
      notes: notes,
    };

    const success = saveTrip(trip);
    if (success) {
      message.textContent = "Trip saved successfully!";
      message.className = "mt-2 text-success";
      form.reset();
      if (onTripSaved) {
        onTripSaved();
      }
    } else {
      message.textContent = "Failed to save trip. Please check your input.";
    }
  });
}
