/**
 * WeatherDetails.jsx
 * ──────────────────
 * Displays additional weather details like Humidity, Wind, Pressure, etc.
 */

import {
  WiHumidity, WiStrongWind, WiBarometer,
  WiSunrise, WiSunset, WiDaySunny,
} from 'react-icons/wi';
import { FiEye } from 'react-icons/fi';
import useWeather from '../hooks/useWeather';
import { formatTime } from '../utils/formatDate';

const WeatherDetails = () => {
  const { currentWeather, unit } = useWeather();
  if (!currentWeather) return null;

  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const uvi = currentWeather.uvi ?? '–';
  const visibility = currentWeather.visibility
    ? `${(currentWeather.visibility / 1000).toFixed(1)} km`
    : '–';

  return (
    <div className="animate-slide-up glass-panel rounded-3xl p-5 md:p-6 mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <Stat icon={<WiHumidity />} label="Humidity" value={`${currentWeather.humidity}%`} />
        <Stat icon={<WiStrongWind />} label="Wind" value={`${currentWeather.wind} ${windUnit}`} />
        <Stat icon={<WiBarometer />} label="Pressure" value={`${currentWeather.pressure} hPa`} />
        <Stat icon={<WiDaySunny />} label="UV Index" value={uvi} />
        <Stat icon={<FiEye />} label="Visibility" value={visibility} />
        <Stat icon={<WiSunrise />} label="Sunrise" value={formatTime(currentWeather.sunrise)} />
        <Stat icon={<WiSunset />} label="Sunset" value={formatTime(currentWeather.sunset)} />
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl glass-card hover:bg-white/50 dark:hover:bg-slate-800/60
                  px-4 py-3 transition-colors group cursor-default">
    <span className="text-2xl opacity-60 group-hover:opacity-90 transition-opacity">{icon}</span>
    <div className="leading-tight">
      <p className="text-[11px] opacity-50 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

export default WeatherDetails;
