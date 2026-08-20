/**
 * WeatherContext.jsx
 * ──────────────────
 * Global state for weather, utilizing React Query for caching.
 * Manages units, recent cities, and favorite cities.
 */

import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchCurrentWeatherByCoords,
  fetchForecast,
  fetchAirQuality,
  fetchCityCoordinates,
  fetchReverseGeocoding,
} from '../services/weatherApi';

export const WeatherContext = createContext();

const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const WeatherProvider = ({ children }) => {
  const [targetLocation, setTargetLocation] = useState(null); // { lat, lon, name }
  const [unit, setUnit] = useState(() => readLS('temperatureUnit', 'metric'));
  const [recentCities, setRecentCities] = useState(() => readLS('recentCities', []));
  const [favoriteCities, setFavoriteCities] = useState(() => readLS('favoriteCities', []));

  useEffect(() => {
    localStorage.setItem('temperatureUnit', JSON.stringify(unit));
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
  }, [recentCities]);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  const addRecentCity = useCallback((name) => {
    if (!name) return;
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== name.toLowerCase());
      return [name, ...filtered].slice(0, 5);
    });
  }, []);

  const toggleFavorite = useCallback((name) => {
    setFavoriteCities((prev) => {
      if (prev.includes(name)) {
        return prev.filter((c) => c !== name);
      }
      return [...prev, name];
    });
  }, []);

  const clearRecentCities = useCallback(() => setRecentCities([]), []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  }, []);

  // Set initial location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const locInfo = await fetchReverseGeocoding(lat, lon);
            setTargetLocation({ lat, lon, name: locInfo.name });
          } catch {
            setTargetLocation({ lat, lon, name: 'Current Location' });
          }
        },
        () => setTargetLocation({ lat: 28.6139, lon: 77.209, name: 'Delhi' })
      );
    } else {
      setTargetLocation({ lat: 28.6139, lon: 77.209, name: 'Delhi' });
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName) => {
    try {
      const coords = await fetchCityCoordinates(cityName);
      setTargetLocation(coords);
      addRecentCity(coords.name);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [addRecentCity]);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    try {
      const locInfo = await fetchReverseGeocoding(lat, lon);
      setTargetLocation({ lat, lon, name: locInfo.name });
    } catch {
      setTargetLocation({ lat, lon, name: 'Selected Location' });
    }
  }, []);

  // Queries
  const { data: currentQuery, isLoading: isCurrentLoading, error: currentError } = useQuery({
    queryKey: ['currentWeather', targetLocation?.lat, targetLocation?.lon, unit],
    queryFn: () => fetchCurrentWeatherByCoords(targetLocation.lat, targetLocation.lon, unit),
    enabled: !!targetLocation,
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const { data: forecastQuery, isLoading: isForecastLoading } = useQuery({
    queryKey: ['forecast', targetLocation?.lat, targetLocation?.lon, unit],
    queryFn: () => fetchForecast(targetLocation.lat, targetLocation.lon, unit),
    enabled: !!targetLocation,
    staleTime: 10 * 60 * 1000,
  });

  const { data: aqiQuery } = useQuery({
    queryKey: ['aqi', targetLocation?.lat, targetLocation?.lon],
    queryFn: () => fetchAirQuality(targetLocation.lat, targetLocation.lon),
    enabled: !!targetLocation,
    staleTime: 30 * 60 * 1000,
  });

  // Construct context data safely
  const currentWeather = currentQuery ? {
    ...currentQuery,
    uvi: forecastQuery?.current?.uvi
  } : null;

  const value = useMemo(() => ({
    city: targetLocation?.name || currentWeather?.city,
    currentWeather,
    hourlyForecast: forecastQuery?.hourly,
    dailyForecast: forecastQuery?.daily,
    airQuality: aqiQuery,
    loading: !targetLocation || isCurrentLoading || isForecastLoading,
    error: currentError?.message,
    unit,
    recentCities,
    favoriteCities,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    toggleUnit,
    clearRecentCities,
    toggleFavorite,
  }), [
    targetLocation?.name, currentWeather, forecastQuery?.hourly, forecastQuery?.daily,
    aqiQuery, isCurrentLoading, isForecastLoading, currentError?.message, unit,
    recentCities, favoriteCities, fetchWeatherByCity, fetchWeatherByCoords,
    toggleUnit, clearRecentCities, toggleFavorite
  ]);

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
