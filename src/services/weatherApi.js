/**
 * weatherApi.js
 * ─────────────
 * Centralised service for weather, geocoding, and air quality requests.
 * Uses Open-Meteo APIs and normalizes responses to the app's existing shape.
 */

import axios from 'axios';
import { mapWeatherCode } from '../utils/openMeteoWeatherMap';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

const forecastApi = axios.create({ baseURL: FORECAST_BASE_URL, timeout: 10000 });
const geocodingApi = axios.create({ baseURL: GEOCODING_BASE_URL, timeout: 10000 });
const airQualityApi = axios.create({ baseURL: AIR_QUALITY_BASE_URL, timeout: 10000 });

export const iconUrl = (code, size = '2x') =>
  `https://openweathermap.org/img/wn/${code}@${size}.png`;

const getServiceErrorMessage = (error, fallback) =>
  error?.response?.data?.reason ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const buildLocationDisplay = ({ name = '', state = '', country = '' } = {}) =>
  [name, state, country].filter(Boolean).join(', ') || 'Your Location';

const mapResolvedLocation = (location = {}) => ({
  name: location.name || 'Your Location',
  country: location.country || '',
  state: location.state || '',
  display: location.display || buildLocationDisplay(location),
});

const getUnits = (units) => ({
  temperature_unit: units === 'imperial' ? 'fahrenheit' : 'celsius',
  wind_speed_unit: units === 'imperial' ? 'mph' : 'ms',
});

const getCurrentWeatherParams = (units) => ({
  latitude: 0,
  longitude: 0,
  timezone: 'auto',
  forecast_days: 7,
  current: [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'pressure_msl',
    'wind_speed_10m',
    'weather_code',
    'is_day',
    'visibility',
  ].join(','),
  hourly: [
    'temperature_2m',
    'weather_code',
    'is_day',
    'relative_humidity_2m',
    'wind_speed_10m',
  ].join(','),
  daily: [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'uv_index_max',
  ].join(','),
  ...getUnits(units),
});

const buildForecastParams = (lat, lon, units) => ({
  ...getCurrentWeatherParams(units),
  latitude: lat,
  longitude: lon,
});

const normalizeCurrentWeather = (data, location = {}) => {
  const current = data.current;
  const todayIndex = 0;
  const weather = mapWeatherCode(current.weather_code, current.is_day === 1);
  const resolvedLocation = mapResolvedLocation(location);

  return {
    city: resolvedLocation.name,
    country: resolvedLocation.country,
    state: resolvedLocation.state,
    display: resolvedLocation.display,
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    tempMin: Math.round(data.daily.temperature_2m_min[todayIndex]),
    tempMax: Math.round(data.daily.temperature_2m_max[todayIndex]),
    humidity: current.relative_humidity_2m,
    pressure: Math.round(current.pressure_msl),
    wind: current.wind_speed_10m,
    description: weather.description,
    icon: weather.icon,
    main: weather.main,
    observedAt: current.time,
    sunrise: data.daily.sunrise[todayIndex],
    sunset: data.daily.sunset[todayIndex],
    timezone: data.timezone || '',
    utcOffsetSeconds: data.utc_offset_seconds ?? 0,
    coord: { lat: data.latitude, lon: data.longitude },
    visibility: current.visibility,
  };
};

const normalizeForecast = (data) => {
  const hourly = data.hourly.time.slice(0, 24).map((time, index) => {
    const weather = mapWeatherCode(
      data.hourly.weather_code[index],
      data.hourly.is_day[index] === 1,
    );

    return {
      time,
      temp: Math.round(data.hourly.temperature_2m[index]),
      icon: weather.icon,
      description: weather.description,
      humidity: data.hourly.relative_humidity_2m[index],
      wind: data.hourly.wind_speed_10m[index],
    };
  });

  const daily = data.daily.time.slice(0, 7).map((time, index) => {
    const weather = mapWeatherCode(data.daily.weather_code[index], true);

    return {
      date: time,
      tempMin: Math.round(data.daily.temperature_2m_min[index]),
      tempMax: Math.round(data.daily.temperature_2m_max[index]),
      icon: weather.icon,
      description: weather.description,
      humidity: null,
      wind: null,
      uvi: data.daily.uv_index_max[index],
    };
  });

  return {
    hourly,
    daily,
    current: {
      uvi: data.daily.uv_index_max[0],
      observedAt: data.current.time,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    },
    timezone: data.timezone || '',
    timezoneOffset: data.utc_offset_seconds ?? 0,
  };
};

const normalizeAqiLabel = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Fair';
  if (aqi <= 150) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  return 'Very Poor';
};

const normalizeAqiValue = (aqi) => {
  if (aqi <= 50) return 1;
  if (aqi <= 100) return 2;
  if (aqi <= 150) return 3;
  if (aqi <= 200) return 4;
  return 5;
};

const normalizeAirQuality = (data) => {
  const current = data.current;
  const usAqi = current.us_aqi ?? 0;

  return {
    aqi: normalizeAqiValue(usAqi),
    label: normalizeAqiLabel(usAqi),
    components: {
      pm2_5: current.pm2_5,
      pm10: current.pm10,
      co: current.carbon_monoxide,
      no2: current.nitrogen_dioxide,
      o3: current.ozone,
      so2: current.sulphur_dioxide,
    },
  };
};

const fetchForecastPayload = async (lat, lon, units = 'metric') => {
  try {
    const { data } = await forecastApi.get('/forecast', {
      params: buildForecastParams(lat, lon, units),
    });

    return data;
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Could not load weather data'));
  }
};

export const fetchCurrentWeather = async (city, units = 'metric') => {
  const { lat, lon, name, country, state, display } = await fetchCityCoordinates(city);
  const current = await fetchCurrentWeatherByCoords(lat, lon, units, {
    name,
    country,
    state,
    display,
  });
  return {
    ...current,
    country,
  };
};

export const fetchCurrentWeatherByCoords = async (
  lat,
  lon,
  units = 'metric',
  location = {},
) => {
  const data = await fetchForecastPayload(lat, lon, units);
  return normalizeCurrentWeather(data, location);
};

export const fetchForecast = async (lat, lon, units = 'metric') => {
  const data = await fetchForecastPayload(lat, lon, units);
  return normalizeForecast(data);
};

export const fetchWeatherBundle = async (lat, lon, units = 'metric', location = {}) => {
  const data = await fetchForecastPayload(lat, lon, units);
  const forecast = normalizeForecast(data);
  const currentWeather = {
    ...normalizeCurrentWeather(data, location),
    uvi: forecast.current.uvi,
  };

  return {
    currentWeather,
    hourlyForecast: forecast.hourly,
    dailyForecast: forecast.daily,
    timezone: forecast.timezone,
    timezoneOffset: forecast.timezoneOffset,
  };
};

export const fetchAirQuality = async (lat, lon) => {
  try {
    const { data } = await airQualityApi.get('/air-quality', {
      params: {
        latitude: lat,
        longitude: lon,
        timezone: 'auto',
        current: 'us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide',
      },
    });

    return normalizeAirQuality(data);
  } catch (error) {
    throw new Error(getServiceErrorMessage(error, 'Could not load air quality data'));
  }
};

export const fetchCityCoordinates = async (cityName) => {
  try {
    const { data } = await geocodingApi.get('/search', {
      params: {
        name: cityName,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    if (!data.results?.length) {
      throw new Error('City not found');
    }

    const city = data.results[0];
    const country = city.country_code || city.country || '';
    const state = city.admin1 || '';
    return {
      lat: city.latitude,
      lon: city.longitude,
      name: city.name,
      country,
      state,
      display: buildLocationDisplay({
        name: city.name,
        state,
        country,
      }),
    };
  } catch (error) {
    if (error.message === 'City not found') {
      throw error;
    }

    throw new Error(getServiceErrorMessage(error, 'Could not resolve city location'));
  }
};

export const fetchCitySuggestions = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const { data } = await geocodingApi.get('/search', {
      params: {
        name: query,
        count: 5,
        language: 'en',
        format: 'json',
      },
    });

    return (data.results || []).map((city) => ({
      name: city.name,
      country: city.country_code || city.country || '',
      state: city.admin1 || '',
      lat: city.latitude,
      lon: city.longitude,
      display: city.admin1
        ? `${city.name}, ${city.admin1}, ${city.country_code || city.country || ''}`
        : `${city.name}, ${city.country_code || city.country || ''}`,
    }));
  } catch {
    return [];
  }
};
