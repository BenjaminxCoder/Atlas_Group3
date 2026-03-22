/**
 * Central place for creating user-friendly error messages.
 * This helps keep service and UI logic cleaner.
 */

export function getUserFriendlyError(error, defaultMessage = "Something went wrong.") {
  if (!error) return defaultMessage;
  if (typeof error === "string") return error;
  return error.message || defaultMessage;
}