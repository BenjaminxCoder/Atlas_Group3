// src/components/TripForm.js
import { saveTrip } from "../services/storage.js";

/**
 * Renders the fishing trip form with validation and Firebase integration.
 * Removed duplicate save call - only calls onTripSaved callback.
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
      <button type="submit" id="save-trip-btn" class="btn btn-primary">Save Trip</button>
      <p id="trip-form-message" class="mt-2"></p>
    </form>
  `;

  const form = root.querySelector("#trip-form-element");
  const messageEl = root.querySelector("#trip-form-message");
  const saveBtn = root.querySelector("#save-trip-btn");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    messageEl.textContent = "";
    messageEl.className = "mt-2";
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    const formData = new FormData(form);
    const date = formData.get("date");
    const river = formData.get("river")?.trim();
    const catchCount = Number(formData.get("catchCount"));
    const notes = formData.get("notes")?.trim() || "";

    if (!date || !river) {
      messageEl.textContent = "Date and river are required.";
      messageEl.className = "mt-2 text-danger";
      resetButton();
      return;
    }

    if (Number.isNaN(catchCount) || catchCount < 0) {
      messageEl.textContent = "Catch count must be 0 or greater.";
      messageEl.className = "mt-2 text-danger";
      resetButton();
      return;
    }

    const trip = {
      date: date,
      river: river,
      catchCount: catchCount,
      notes: notes,
    };

    try {
      // Only save once here
      await saveTrip(trip);

      messageEl.textContent = "Trip saved successfully!";
      messageEl.className = "mt-2 text-success";

      form.reset();

      // Notify main.js to refresh the logs table
      if (onTripSaved) {
        onTripSaved(trip);
      }

    } catch (error) {
      messageEl.textContent = error.message || "Failed to save trip.";
      messageEl.className = "mt-2 text-danger";
    } finally {
      resetButton();
    }
  });

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Trip";
  }
}
