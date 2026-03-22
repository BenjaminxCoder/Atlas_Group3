/**
 * Renders the river/site selector.
 * For now, the user enters a USGS site ID directly.
 */

export function createRiverSelector(root, onLookup, currentValue = "") {
  root.innerHTML = `
    <form id="river-lookup-form">
      <label for="siteId">USGS Site ID:</label>
      <input
        id="siteId"
        name="siteId"
        type="text"
        value="${currentValue}"
        placeholder="Enter site ID"
        required
      />
      <button type="submit">Get Conditions</button>
    </form>
  `;

  const form = root.querySelector("#river-lookup-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const siteId = formData.get("siteId").trim();

    if (!siteId) return;
    onLookup(siteId);
  });
}