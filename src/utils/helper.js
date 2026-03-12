
// Helper utilities for formatting and simple checks.
 

export function formatDisplayValue(value, fallback = "Unavailable") {
  return value === null || value === undefined || value === "" ? fallback : value;
}