// src/components/LogsTable.js
/**
 * Renders saved trip logs from Firebase Firestore.
 * Improved date formatting and field handling.
 */

export function renderLogsTable(root, trips) {
  // Loading state
  if (trips === null || trips === undefined) {
    root.innerHTML = `<p class="text-muted">Loading trips...</p>`;
    return;
  }

  // Empty state
  if (!Array.isArray(trips) || trips.length === 0) {
    root.innerHTML = `
      <p>No trips saved yet.</p>
      <p class="text-muted" style="font-size: 0.9rem;">
        Your saved fishing trips will appear here after you log them.
      </p>
    `;
    return;
  }

  // Build table rows with safe field handling
  const rows = trips
    .map((trip) => {
      // Handle different possible field names (Firebase vs old localStorage)
      const catchCount = trip.catchCount !== undefined 
        ? trip.catchCount 
        : (trip.catch_count !== undefined ? trip.catch_count : 0);

      const tripDate = trip.date 
        ? new Date(trip.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : (trip.createdAt && trip.createdAt.toDate 
            ? trip.createdAt.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : '—');

      return `
        <tr>
          <td>${tripDate}</td>
          <td>${trip.river || '—'}</td>
          <td>${catchCount}</td>
          <td>${trip.notes ? trip.notes : '—'}</td>
        </tr>
      `;
    })
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
