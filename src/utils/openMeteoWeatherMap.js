/**
 * openMeteoWeatherMap.js
 * ──────────────────────
 * Maps Open-Meteo WMO weather codes to the normalized weather shape used
 * throughout the dashboard UI.
 */

const weatherCodeMap = {
  0: { main: 'Clear', description: 'clear sky', dayIcon: '01d', nightIcon: '01n' },
  1: { main: 'Clear', description: 'mainly clear', dayIcon: '01d', nightIcon: '01n' },
  2: { main: 'Clouds', description: 'partly cloudy', dayIcon: '02d', nightIcon: '02n' },
  3: { main: 'Clouds', description: 'overcast', dayIcon: '04d', nightIcon: '04n' },
  45: { main: 'Fog', description: 'fog', dayIcon: '50d', nightIcon: '50n' },
  48: { main: 'Fog', description: 'depositing rime fog', dayIcon: '50d', nightIcon: '50n' },
  51: { main: 'Drizzle', description: 'light drizzle', dayIcon: '09d', nightIcon: '09n' },
  53: { main: 'Drizzle', description: 'moderate drizzle', dayIcon: '09d', nightIcon: '09n' },
  55: { main: 'Drizzle', description: 'dense drizzle', dayIcon: '09d', nightIcon: '09n' },
  56: { main: 'Drizzle', description: 'light freezing drizzle', dayIcon: '09d', nightIcon: '09n' },
  57: { main: 'Drizzle', description: 'dense freezing drizzle', dayIcon: '09d', nightIcon: '09n' },
  61: { main: 'Rain', description: 'slight rain', dayIcon: '10d', nightIcon: '10n' },
  63: { main: 'Rain', description: 'moderate rain', dayIcon: '10d', nightIcon: '10n' },
  65: { main: 'Rain', description: 'heavy rain', dayIcon: '10d', nightIcon: '10n' },
  66: { main: 'Rain', description: 'light freezing rain', dayIcon: '13d', nightIcon: '13n' },
  67: { main: 'Rain', description: 'heavy freezing rain', dayIcon: '13d', nightIcon: '13n' },
  71: { main: 'Snow', description: 'slight snow fall', dayIcon: '13d', nightIcon: '13n' },
  73: { main: 'Snow', description: 'moderate snow fall', dayIcon: '13d', nightIcon: '13n' },
  75: { main: 'Snow', description: 'heavy snow fall', dayIcon: '13d', nightIcon: '13n' },
  77: { main: 'Snow', description: 'snow grains', dayIcon: '13d', nightIcon: '13n' },
  80: { main: 'Rain', description: 'slight rain showers', dayIcon: '09d', nightIcon: '09n' },
  81: { main: 'Rain', description: 'moderate rain showers', dayIcon: '09d', nightIcon: '09n' },
  82: { main: 'Rain', description: 'violent rain showers', dayIcon: '09d', nightIcon: '09n' },
  85: { main: 'Snow', description: 'slight snow showers', dayIcon: '13d', nightIcon: '13n' },
  86: { main: 'Snow', description: 'heavy snow showers', dayIcon: '13d', nightIcon: '13n' },
  95: { main: 'Thunderstorm', description: 'thunderstorm', dayIcon: '11d', nightIcon: '11n' },
  96: { main: 'Thunderstorm', description: 'thunderstorm with hail', dayIcon: '11d', nightIcon: '11n' },
  99: { main: 'Thunderstorm', description: 'strong thunderstorm with hail', dayIcon: '11d', nightIcon: '11n' },
};

const defaultWeather = {
  main: 'Clouds',
  description: 'partly cloudy',
  dayIcon: '02d',
  nightIcon: '02n',
};

export const mapWeatherCode = (code, isDay = true) => {
  const mapped = weatherCodeMap[code] || defaultWeather;
  return {
    main: mapped.main,
    description: mapped.description,
    icon: isDay ? mapped.dayIcon : mapped.nightIcon,
  };
};
