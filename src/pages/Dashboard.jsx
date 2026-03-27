/**
 * Dashboard.jsx
 * ─────────────
 * Main page layout with AirQualityCard integrated.
 * Uses SevenDayForecast component for the weekly view.
 */

import useWeather from '../hooks/useWeather';
import { getWeatherTheme } from '../utils/weatherTheme';
import Navbar from '../components/Navbar';
import CurrentWeather from '../components/CurrentWeather';
import WeatherDetails from '../components/WeatherDetails';
import HourlyForecast from '../components/HourlyForecast';
import SevenDayForecast from '../components/SevenDayForecast';
import TemperatureChart from '../components/TemperatureChart';
import AirQuality from '../components/AirQuality';
import { WiCloudRefresh } from 'react-icons/wi';

const Dashboard = () => {
  const { currentWeather, loading, error, fetchWeatherByCity } = useWeather();

  const theme = getWeatherTheme(currentWeather?.main);

  /* Loading */
  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white">
        <div className="flex flex-col items-center gap-4">
          <WiCloudRefresh className="text-7xl animate-spin" style={{ animationDuration: '2s' }} />
          <p className="text-lg font-medium opacity-80">Loading weather data…</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error && !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-slate-900 text-white px-4">
        <div className="text-center max-w-md backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/10">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="opacity-60 mb-6 text-sm">{error}</p>
          <button
            onClick={() => fetchWeatherByCity('Delhi')}
            className="px-6 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition font-medium text-sm"
            id="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgClass} ${theme.gradient} ${theme.textClass} transition-all duration-1000 relative`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-10%] h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      {/* Optional loading overlay when refetching, so user knows it's thinking */}
      {loading && currentWeather && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
           <WiCloudRefresh className="text-6xl animate-spin text-white opacity-80" style={{ animationDuration: '1.5s' }} />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-5 space-y-5 md:px-6 md:py-7">
        <Navbar />

        {error && currentWeather && (
          <div className="rounded-2xl border border-red-200/20 bg-red-500/15 px-4 py-3 text-sm text-white/90 shadow-lg backdrop-blur-xl">
            {error}
          </div>
        )}

        <CurrentWeather />
        <WeatherDetails />
        <HourlyForecast />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
          <SevenDayForecast />
          <div className="grid gap-5">
            <TemperatureChart />
            <AirQuality />
          </div>
        </div>

        <footer className="text-center text-xs opacity-30 pb-4 pt-2">
          Powered by OpenWeatherMap · Built with React &amp; Tailwind CSS
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
