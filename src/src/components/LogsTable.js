/**
 * Renders saved trip logs from localStorage.
 * This gives the user a simple history view for the prototype.
 */

export function renderLogsTable(root, trips) {
  if (!trips.length) {
    root.innerHTML = `<p>No trips saved yet.</p>`;
    return;
  }

  const rows = trips
    .map(
      (trip) => `
        <tr>
          <td>${trip.date}</td>
          <td>${trip.river}</td>
          <td>${trip.catchCount}</td>
          <td>${trip.notes || "-"}</td>
        </tr>
      `
    )
    .join("");

  root.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>River</th>
          <th>Catch Count</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}