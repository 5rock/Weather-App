/**
 * weatherIcons.js
 * ───────────────
 * Maps OpenWeatherMap condition codes and icon IDs to descriptive labels
 * and a utility for icon URLs.  Used by multiple components to ensure
 * consistent icon handling across the dashboard.
 */

/**
 * Return the OWM icon URL for a given icon code.
 * @param {string} code   e.g. "01d", "10n"
 * @param {string} size   "1x" | "2x" | "4x"
 */
export const getIconUrl = (code, size = '2x') =>
  `https://openweathermap.org/img/wn/${code}@${size}.png`;

/**
 * Map an OWM weather "main" string to a short human label.
 */
const conditionLabels = {
  Clear: 'Clear',
  Clouds: 'Cloudy',
  Rain: 'Rainy',
  Drizzle: 'Drizzle',
  Thunderstorm: 'Storm',
  Snow: 'Snow',
  Mist: 'Mist',
  Fog: 'Fog',
  Haze: 'Haze',
  Smoke: 'Smoke',
  Dust: 'Dust',
  Sand: 'Sand',
  Ash: 'Ash',
  Squall: 'Squall',
  Tornado: 'Tornado',
};

export const getConditionLabel = (main) => conditionLabels[main] || main;

/**
 * Determine whether the icon is a "night" variant (ends with 'n').
 */
export const isNightIcon = (iconCode) => iconCode?.endsWith('n');
