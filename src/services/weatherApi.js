/**
 * weatherApi.js
 * ─────────────
 * Centralised service for all OpenWeatherMap API requests.
 * Includes Air Quality API and Geocoding.
 * Falls back to realistic mock data when the API key is invalid.
 */

import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const isConfigured = () => {
  if (!API_KEY || API_KEY === 'your_api_key_here' || API_KEY === 'your_openweathermap_api_key') {
    throw new Error('CONFIG_MISSING');
  }
  return true;
};

/** Shared axios instance */
const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

/* ─────────────────────────── helpers ────────────────────────────── */

export const iconUrl = (code, size = '2x') =>
  `https://openweathermap.org/img/wn/${code}@${size}.png`;

/* ─────────────────────────── mock data ─────────────────────────── */

const now = () => Math.floor(Date.now() / 1000);

const mockCities = {
  london: { lat: 51.5074, lon: -0.1278, country: 'GB' },
  delhi: { lat: 28.6139, lon: 77.209, country: 'IN' },
  'new delhi': { lat: 28.6139, lon: 77.209, country: 'IN' },
  'new york': { lat: 40.7128, lon: -74.006, country: 'US' },
  tokyo: { lat: 35.6762, lon: 139.6503, country: 'JP' },
  paris: { lat: 48.8566, lon: 2.3522, country: 'FR' },
  sydney: { lat: -33.8688, lon: 151.2093, country: 'AU' },
  dubai: { lat: 25.2048, lon: 55.2708, country: 'AE' },
  mumbai: { lat: 19.076, lon: 72.8777, country: 'IN' },
  berlin: { lat: 52.52, lon: 13.405, country: 'DE' },
  los: { lat: 34.0522, lon: -118.2437, country: 'US' },
  'los angeles': { lat: 34.0522, lon: -118.2437, country: 'US' },
};

const getMockCityInfo = (city) => {
  const key = city.toLowerCase().trim();
  return mockCities[key] || { lat: 51.5074, lon: -0.1278, country: 'GB' };
};

const conditions = [
  { main: 'Clear', desc: 'clear sky', icon: '01d' },
  { main: 'Clouds', desc: 'few clouds', icon: '02d' },
  { main: 'Clouds', desc: 'scattered clouds', icon: '03d' },
  { main: 'Clouds', desc: 'overcast clouds', icon: '04d' },
  { main: 'Rain', desc: 'light rain', icon: '10d' },
  { main: 'Rain', desc: 'moderate rain', icon: '10d' },
  { main: 'Clouds', desc: 'broken clouds', icon: '04d' },
];

const pickCondition = (seed = 0) => conditions[seed % conditions.length];

const getMockCurrentWeather = (city, units) => {
  const info = getMockCityInfo(city);
  const isMetric = units === 'metric';
  const baseTemp = isMetric ? 24 : 75;
  const t = now();
  const cond = pickCondition(city.length);

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
    country: info.country,
    temp: baseTemp + Math.round(Math.sin(t / 10000) * 3),
    feelsLike: baseTemp - 1,
    tempMin: baseTemp - 4,
    tempMax: baseTemp + 4,
    humidity: 58 + (city.length % 15),
    pressure: 1010 + (city.length % 8),
    wind: isMetric ? +(3 + Math.random() * 4).toFixed(1) : +(7 + Math.random() * 8).toFixed(1),
    description: cond.desc,
    icon: cond.icon,
    main: cond.main,
    sunrise: t - 21600,
    sunset: t + 21600,
    timezone: 0,
    coord: { lat: info.lat, lon: info.lon },
    visibility: 10000,
  };
};

const hrIcons = ['01d','01d','02d','02d','03d','04d','04d','03d','02d','01d','01d','10d',
                 '10d','04d','03d','02d','01d','01n','01n','02n','03n','04n','02n','01n'];

const getMockForecast = (units) => {
  const isMetric = units === 'metric';
  const baseTemp = isMetric ? 24 : 75;
  const t = now();

  const hourly = Array.from({ length: 24 }, (_, i) => ({
    time: t + i * 3600,
    temp: Math.round(baseTemp + Math.sin((i - 6) / 3.8) * 6),
    icon: hrIcons[i],
    description: conditions[i % conditions.length].desc,
    humidity: 50 + Math.round(Math.random() * 25),
    wind: isMetric ? +(2 + Math.random() * 5).toFixed(1) : +(5 + Math.random() * 10).toFixed(1),
  }));

  const dayIcons = ['01d', '02d', '03d', '04d', '10d', '02d', '01d'];
  const dayDescs = [
    'clear sky', 'few clouds', 'scattered clouds',
    'overcast clouds', 'light rain', 'few clouds', 'clear sky',
  ];

  const daily = Array.from({ length: 7 }, (_, i) => ({
    date: t + i * 86400,
    tempMin: Math.round(baseTemp - 3 + (Math.sin(i) * 2)),
    tempMax: Math.round(baseTemp + 4 + (Math.cos(i) * 3)),
    icon: dayIcons[i],
    description: dayDescs[i],
    humidity: 50 + Math.round(Math.random() * 25),
    wind: isMetric ? +(2 + Math.random() * 5).toFixed(1) : +(5 + Math.random() * 10).toFixed(1),
    uvi: +(1 + Math.random() * 9).toFixed(1),
  }));

  return {
    hourly,
    daily,
    current: { uvi: 5.4, sunrise: t - 21600, sunset: t + 21600 },
    timezoneOffset: 0,
  };
};

const getMockAirQuality = () => ({
  aqi: 2,
  label: 'Fair',
  components: { pm2_5: 12.3, pm10: 28.7, co: 320.5, no2: 18.4, o3: 42.1, so2: 5.6 },
});

/* ────────────────────── current weather ─────────────────────────── */

export const fetchCurrentWeather = async (city, units = 'metric') => {
  isConfigured();
  try {
    const { data } = await api.get('/data/2.5/weather', {
      params: { q: city, units, appid: API_KEY },
    });
    return {
      city: data.name, country: data.sys.country,
      temp: Math.round(data.main.temp), feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min), tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity, pressure: data.main.pressure,
      wind: data.wind.speed, description: data.weather[0].description,
      icon: data.weather[0].icon, main: data.weather[0].main,
      sunrise: data.sys.sunrise, sunset: data.sys.sunset,
      timezone: data.timezone, coord: data.coord,
      visibility: data.visibility,
    };
  } catch (err) {
    if (err.message === 'CONFIG_MISSING') throw err;
    if (err.response) {
      if (err.response.status === 401) throw new Error('API_KEY_INVALID');
      if (err.response.status === 404) throw new Error('CITY_NOT_FOUND');
    }
    console.warn('[API Error] Falling back to mock:', err.message);
    return getMockCurrentWeather(city, units);
  }
};

/* ────────────────── current weather by coords ───────────────────── */

export const fetchCurrentWeatherByCoords = async (lat, lon, units = 'metric') => {
  isConfigured();
  try {
    const { data } = await api.get('/data/2.5/weather', {
      params: { lat, lon, units, appid: API_KEY },
    });
    return {
      city: data.name, country: data.sys.country,
      temp: Math.round(data.main.temp), feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min), tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity, pressure: data.main.pressure,
      wind: data.wind.speed, description: data.weather[0].description,
      icon: data.weather[0].icon, main: data.weather[0].main,
      sunrise: data.sys.sunrise, sunset: data.sys.sunset,
      timezone: data.timezone, coord: data.coord,
      visibility: data.visibility,
    };
  } catch (err) {
    if (err.message === 'CONFIG_MISSING') throw err;
    if (err.response?.status === 401) throw new Error('API_KEY_INVALID');
    console.warn('[API Error] Falling back to mock:', err.message);
    return getMockCurrentWeather('Your Location', units);
  }
};

/* ─────────────────────── one-call forecast ──────────────────────── */

export const fetchForecast = async (lat, lon, units = 'metric') => {
  isConfigured();
  try {
    const { data } = await api.get('/data/3.0/onecall', {
      params: { lat, lon, units, exclude: 'minutely,alerts', appid: API_KEY },
    });
    return {
      hourly: data.hourly.slice(0, 24).map((h) => ({
        time: h.dt, temp: Math.round(h.temp), icon: h.weather[0].icon,
        description: h.weather[0].description, humidity: h.humidity,
        wind: h.wind_speed,
      })),
      daily: data.daily.slice(0, 7).map((d) => ({
        date: d.dt, tempMin: Math.round(d.temp.min), tempMax: Math.round(d.temp.max),
        icon: d.weather[0].icon, description: d.weather[0].description,
        humidity: d.humidity, wind: d.wind_speed, uvi: d.uvi,
      })),
      current: { uvi: data.current.uvi, sunrise: data.current.sunrise, sunset: data.current.sunset },
      timezoneOffset: data.timezone_offset,
    };
  } catch (err) {
    if (err.message === 'CONFIG_MISSING') throw err;
    console.warn('[API Error] Falling back to mock forecast:', err.message);
    return getMockForecast(units);
  }
};

/* ──────────────────── air quality ───────────────────────────────── */

export const fetchAirQuality = async (lat, lon) => {
  isConfigured();
  try {
    const { data } = await api.get('/data/2.5/air_pollution', {
      params: { lat, lon, appid: API_KEY },
    });
    const item = data.list[0];
    const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return {
      aqi: item.main.aqi,
      label: aqiLabels[item.main.aqi] || 'Unknown',
      components: {
        pm2_5: item.components.pm2_5,
        pm10: item.components.pm10,
        co: item.components.co,
        no2: item.components.no2,
        o3: item.components.o3,
        so2: item.components.so2,
      },
    };
  } catch (err) {
    if (err.message === 'CONFIG_MISSING') throw err;
    console.warn('[API Error] Falling back to mock AQI:', err.message);
    return getMockAirQuality();
  }
};

/* ─────────────────── geocoding (city coordinates) ───────────────── */

export const fetchCityCoordinates = async (cityName) => {
  isConfigured();
  try {
    const { data } = await api.get('/geo/1.0/direct', {
      params: { q: cityName, limit: 1, appid: API_KEY },
    });
    if (!data.length) throw new Error('City not found');
    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].name,
    };
  } catch (err) {
    if (err.message === 'CONFIG_MISSING') throw err;
    throw new Error('Could not resolve city location');
  }
};

export const fetchReverseGeocoding = async (lat, lon) => {
  try {
    isConfigured();
    const { data } = await api.get('/geo/1.0/reverse', {
      params: { lat, lon, limit: 1, appid: API_KEY },
    });
    if (!data.length) return { name: 'Current Location' };
    return { name: data[0].name };
  } catch (err) {
    if (err.message === 'CONFIG_MISSING') throw err;
    return { name: 'Current Location' };
  }
};

/* ─────────────────── city autocomplete ──────────────────────────── */

export const fetchCitySuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    isConfigured();
    const { data } = await api.get('/geo/1.0/direct', {
      params: { q: query, limit: 5, appid: API_KEY },
    });
    return data.map((c) => ({
      name: c.name, country: c.country, state: c.state || '',
      lat: c.lat, lon: c.lon,
      display: c.state ? `${c.name}, ${c.state}, ${c.country}` : `${c.name}, ${c.country}`,
    }));
  } catch {
    return [];
  }
};
