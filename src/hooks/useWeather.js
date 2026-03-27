/**
 * useWeather.js
 * ─────────────
 * Convenience hook to consume WeatherContext anywhere in the tree.
 */

import { useContext } from 'react';
import { WeatherContext } from '../context/weatherContextInstance';

const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default useWeather;
