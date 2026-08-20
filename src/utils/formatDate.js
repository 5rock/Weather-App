/**
 * formatDate.js
 * ─────────────
 * Date & time formatting helpers used across the dashboard.
 */

/**
 * Format a Unix timestamp into a human-readable time string (e.g. "3:00 PM").
 * @param {number} unix  Unix timestamp in seconds
 * @returns {string}
 */
export const formatTime = (unix) => {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Return the short weekday name for a Unix timestamp (e.g. "Mon").
 */
export const formatDay = (unix) => {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Return a long-form date string (e.g. "Monday, March 10, 2025").
 */
export const formatFullDate = (unix) => {
  const date = new Date(unix * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format hour only (e.g. "3 PM").
 */
export const formatHour = (unix) => {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
};

/**
 * Return formatted local time of the city based on its timezone offset
 */
export const formatLocalTime = (timezoneOffsetSeconds) => {
  if (timezoneOffsetSeconds == null) return '';
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const cityTime = new Date(utc + (1000 * timezoneOffsetSeconds));
  
  const dateStr = cityTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const timeStr = cityTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${dateStr} • ${timeStr}`;
};
