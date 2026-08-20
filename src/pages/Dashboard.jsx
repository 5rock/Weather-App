/**
 * Dashboard.jsx
 * ─────────────
 * Main page layout combining all weather features, AI Assistant, and maps.
 */

import useWeather from '../hooks/useWeather';
import { getWeatherTheme } from '../utils/weatherTheme';
import Navbar from '../components/Navbar';
import CurrentWeather from '../components/CurrentWeather';

import HourlyForecast from '../components/HourlyForecast';
import SevenDayForecast from '../components/SevenDayForecast';
import TemperatureChart from '../components/TemperatureChart';
import AirQuality from '../components/AirQuality';
import WeatherAssistant from '../components/WeatherAssistant';
import WeatherMap from '../components/WeatherMap';
import { WiCloudRefresh } from 'react-icons/wi';

const Dashboard = () => {
  const { currentWeather, loading, error, fetchWeatherByCity } = useWeather();

  const theme = getWeatherTheme(currentWeather?.main);

  /* Loading */
  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <WiCloudRefresh className="text-7xl animate-spin text-sky-500" style={{ animationDuration: '2s' }} />
          <p className="text-lg font-medium opacity-80">Analyzing atmospheric data…</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error && !currentWeather) {
    const isConfigMissing = error === 'CONFIG_MISSING';
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center max-w-md glass-panel rounded-3xl p-8">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
            {isConfigMissing ? 'Weather service is not configured' : 'Something went wrong'}
          </h2>
          <p className="opacity-60 mb-6 text-sm text-slate-600 dark:text-slate-300">
            {isConfigMissing 
              ? 'Please add your OpenWeatherMap API key to the environment configuration.'
              : error === 'API_KEY_INVALID' 
                ? 'Your API key is invalid or not yet active. (Note: New OpenWeatherMap keys typically take 30-120 minutes to activate).'
                : error}
          </p>
          {!isConfigMissing && (
            <button
              onClick={() => fetchWeatherByCity('Delhi')}
              className="px-6 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition font-medium text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 relative pb-10`}>
      {/* Dynamic Background based on weather, applied subtly over the dark mode base */}
      <div className={`fixed inset-0 z-[-1] opacity-10 dark:opacity-10 ${theme.bgClass} ${theme.gradient}`} />

      {/* Optional loading overlay when refetching */}
      {loading && currentWeather && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-black/40 backdrop-blur-[2px]">
           <WiCloudRefresh className="text-6xl animate-spin text-sky-500 opacity-80" style={{ animationDuration: '1.5s' }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Navbar />
        
        {/* Main Stack */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {/* Top Row: Current Weather & AI Assistant */}
          <CurrentWeather />
          <WeatherAssistant />

          <HourlyForecast />
          <TemperatureChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SevenDayForecast />
            <div className="space-y-6">
              <AirQuality />
              <WeatherMap />
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-slate-500 dark:text-slate-400 pb-4 pt-8">
          AI Weather Intelligence Platform · Powered by OpenWeatherMap & Gemini AI
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
