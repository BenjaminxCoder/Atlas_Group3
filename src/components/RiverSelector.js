// src/components/RiverSelector.js
/**
 * RiverSelector component
 * Friendly dropdown of the most popular Washington fishing rivers
 * Users pick a name, the code is handled automatically.
 * Includes "Other / Custom" for any of the remaining ~180 rivers.
 */

const popularRivers = [
  { name: "Snoqualmie River near Carnation", id: "12144500" },
  { name: "Skagit River near Mount Vernon", id: "12200500" },
  { name: "Chehalis River near Chehalis", id: "12031000" },
  { name: "Puyallup River near Puyallup", id: "12101500" },
  { name: "Green River near Auburn", id: "12113390" },
  { name: "Snoqualmie River near Snoqualmie", id: "12149000" },
  { name: "Skykomish River near Gold Bar", id: "12141300" },
  { name: "Nooksack River near Deming", id: "12205000" },
  { name: "Cedar River near Renton", id: "12119000" },
  { name: "White River near Auburn", id: "12113347" },
  { name: "Stillaguamish River near Arlington", id: "12167000" },
  { name: "Cowlitz River near Kelso", id: "14238000" },
  { name: "Yakima River near Cle Elum", id: "12431000" },
  { name: "Wenatchee River near Peshastin", id: "12457000" },
  { name: "Methow River near Winthrop", id: "12448500" },
];

export function createRiverSelector(container, onLookup, currentSiteId = "") {
  container.innerHTML = `
    <div class="river-selector">
      <label for="river-select">Select River</label>
      <select id="river-select" class="river-select">
        <option value="">— Choose a river —</option>
        ${popularRivers
          .map(
            (river) =>
              `<option value="${river.id}" ${
                river.id === currentSiteId ? "selected" : ""
              }>${river.name}</option>`
          )
          .join("")}
        <option value="custom">Other / Custom USGS site ID</option>
      </select>

      <!-- Custom input (only shows when "Other" is selected) -->
      <div id="custom-input-group" style="display: none; margin-top: 12px;">
        <label for="custom-site-id">Enter USGS Site ID</label>
        <input
          type="text"
          id="custom-site-id"
          placeholder="e.g. 12144500"
          class="custom-site-input"
        />
        <button id="custom-lookup-btn" class="btn-primary">Get Conditions</button>
      </div>

      <button id="lookup-btn" class="btn-primary" style="margin-top: 12px;">
        Get Conditions
      </button>
    </div>
  `;

  const select = container.querySelector("#river-select");
  const customGroup = container.querySelector("#custom-input-group");
  const customInput = container.querySelector("#custom-site-id");
  const customBtn = container.querySelector("#custom-lookup-btn");
  const mainBtn = container.querySelector("#lookup-btn");

  // Show/hide custom field
  select.addEventListener("change", () => {
    if (select.value === "custom") {
      customGroup.style.display = "block";
      mainBtn.style.display = "none";
    } else {
      customGroup.style.display = "none";
      mainBtn.style.display = "block";
    }
  });

  // Main lookup (predefined popular rivers)
  mainBtn.addEventListener("click", () => {
    const siteId = select.value;
    if (siteId && siteId !== "custom") onLookup(siteId);
  });

  // Custom lookup
  customBtn.addEventListener("click", () => {
    const siteId = customInput.value.trim();
    if (siteId) onLookup(siteId);
    else alert("Please enter a valid USGS site ID.");
  });

  // Allow Enter key in custom field
  customInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") customBtn.click();
  });
}
