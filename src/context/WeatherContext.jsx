/**
 * WeatherContext.jsx
 * ──────────────────
 * Global state for weather data, forecast, air quality, user preferences,
 * loading, and error states. Consumed via the useWeather hook.
 * Added 10-minute caching to localStorage.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  fetchWeatherBundle,
  fetchAirQuality,
  fetchCityCoordinates,
} from '../services/weatherApi';
import { WeatherContext } from './weatherContextInstance';

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/** Read from localStorage safely */
const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const toFiniteNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const normalizeRecentCity = (entry) => {
  if (!entry) return null;

  if (typeof entry === 'string') {
    const name = entry.trim();
    return name
      ? {
          name,
          country: '',
          state: '',
          display: name,
          lat: null,
          lon: null,
        }
      : null;
  }

  const name = (entry.name || entry.city || '').trim();
  if (!name) return null;

  const country = entry.country || '';
  const state = entry.state || '';
  const lat = toFiniteNumber(entry.lat ?? entry.coord?.lat);
  const lon = toFiniteNumber(entry.lon ?? entry.coord?.lon);

  return {
    name,
    country,
    state,
    display: entry.display || [name, state, country].filter(Boolean).join(', ') || name,
    lat,
    lon,
  };
};

const getRecentCityKey = (entry) => {
  if (entry.lat !== null && entry.lon !== null) {
    return `${entry.lat.toFixed(4)}:${entry.lon.toFixed(4)}`;
  }

  return [entry.name, entry.state, entry.country].join('|').toLowerCase();
};

export const WeatherProvider = ({ children }) => {
  /* ─── state ─── */
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [unit, setUnit] = useState(() => readLS('temperatureUnit', 'metric'));
  const [recentCities, setRecentCities] = useState(() => {
    const stored = readLS('recentCities', []);
    return Array.isArray(stored)
      ? stored.map(normalizeRecentCity).filter(Boolean)
      : [];
  });
  const requestIdRef = useRef(0);

  /* ─── persist units/recent ─── */
  useEffect(() => {
    localStorage.setItem('temperatureUnit', JSON.stringify(unit));
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
  }, [recentCities]);

  /* ─── recent cities (max 5) ─── */
  const addRecentCity = useCallback((location) => {
    const nextCity = normalizeRecentCity(location);
    if (!nextCity) return;

    setRecentCities((prev) => {
      const filtered = prev.filter((cityEntry) => getRecentCityKey(cityEntry) !== getRecentCityKey(nextCity));
      return [nextCity, ...filtered].slice(0, 5);
    });
  }, []);

  const clearRecentCities = useCallback(() => setRecentCities([]), []);

  /* ─── caching mechanism ─── */
  const getCache = (lat, lon, u) => {
    const key = `weather_cache_${lat.toFixed(2)}_${lon.toFixed(2)}_${u}`;
    const cached = readLS(key, null);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return cached.data;
    }
    return null;
  };

  const setCache = (lat, lon, u, data) => {
    const key = `weather_cache_${lat.toFixed(2)}_${lon.toFixed(2)}_${u}`;
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  };

  /* ─── fetch by coords ─── */
  const loadWeatherByCoords = useCallback(
    async (lat, lon, resolvedLocation = {}, requestId) => {
      setLoading(true);
      setError(null);

      const locationDetails =
        normalizeRecentCity({
          ...resolvedLocation,
          lat,
          lon,
          name: resolvedLocation.name || resolvedLocation.city || 'Your Location',
        }) || {
          name: 'Your Location',
          country: '',
          state: '',
          display: 'Your Location',
          lat,
          lon,
        };

      try {
        const cached = getCache(lat, lon, unit);
        if (cached) {
          if (requestIdRef.current !== requestId) return;
          setCurrentWeather(cached.currentWeather);
          setHourlyForecast(cached.hourlyForecast);
          setDailyForecast(cached.dailyForecast);
          setAirQuality(cached.airQuality);
          setCity(cached.currentWeather.city);
          addRecentCity(cached.currentWeather);
          return;
        }

        // Fetch all in parallel using lat/lon
        const [weatherBundle, aqi] = await Promise.all([
          fetchWeatherBundle(lat, lon, unit, locationDetails),
          fetchAirQuality(lat, lon).catch(() => null),
        ]);

        if (requestIdRef.current !== requestId) return;

        setCurrentWeather(weatherBundle.currentWeather);
        setHourlyForecast(weatherBundle.hourlyForecast);
        setDailyForecast(weatherBundle.dailyForecast);
        setAirQuality(aqi);
        setCity(weatherBundle.currentWeather.city);
        addRecentCity(weatherBundle.currentWeather);

        // Save to cache
        setCache(lat, lon, unit, {
          currentWeather: weatherBundle.currentWeather,
          hourlyForecast: weatherBundle.hourlyForecast,
          dailyForecast: weatherBundle.dailyForecast,
          airQuality: aqi,
        });
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        setError(err.message);
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [unit, addRecentCity],
  );

  const fetchWeatherByCoords = useCallback(
    async (lat, lon, resolvedLocation = {}) => {
      const requestId = ++requestIdRef.current;
      await loadWeatherByCoords(lat, lon, resolvedLocation, requestId);
    },
    [loadWeatherByCoords],
  );

  /* ─── fetch by city (Geocode then Coords) ─── */
  const fetchWeatherByCity = useCallback(
    async (cityName) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const resolvedLocation = await fetchCityCoordinates(cityName);
        if (requestIdRef.current !== requestId) return;
        await loadWeatherByCoords(resolvedLocation.lat, resolvedLocation.lon, resolvedLocation, requestId);
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        setError(err.message);
        setLoading(false);
      }
    },
    [loadWeatherByCoords],
  );

  /* ─── toggle unit ─── */
  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  }, []);

  // Re-fetch when unit changes
  useEffect(() => {
    if (currentWeather?.coord) {
      fetchWeatherByCoords(currentWeather.coord.lat, currentWeather.coord.lon, {
        name: currentWeather.city,
        country: currentWeather.country,
        state: currentWeather.state,
        display: currentWeather.display,
      });
      return;
    }

    if (city) fetchWeatherByCity(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  /* ─── initial load (Fallback to Delhi if geolocation fails) ─── */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherByCity('Delhi'), // Fallback to Delhi
      );
    } else {
      fetchWeatherByCity('Delhi'); // Fallback to Delhi
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      city,
      currentWeather,
      hourlyForecast,
      dailyForecast,
      airQuality,
      loading,
      error,
      unit,
      recentCities,
      fetchWeatherByCity,
      fetchWeatherByCoords,
      toggleUnit,
      clearRecentCities,
    }),
    [
      city,
      currentWeather,
      hourlyForecast,
      dailyForecast,
      airQuality,
      loading,
      error,
      unit,
      recentCities,
      fetchWeatherByCity,
      fetchWeatherByCoords,
      toggleUnit,
      clearRecentCities,
    ],
  );

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
