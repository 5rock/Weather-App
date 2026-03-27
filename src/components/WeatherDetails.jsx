/**
 * WeatherDetails.jsx
 * ──────────────────
 * Displays additional weather details like Humidity, Wind, Pressure, etc.
 */

import { useMemo } from 'react';
import {
  WiHumidity, WiStrongWind, WiBarometer,
  WiSunrise, WiSunset, WiDaySunny,
} from 'react-icons/wi';
import { FiEye } from 'react-icons/fi';
import useWeather from '../hooks/useWeather';
import { formatTime } from '../utils/formatDate';

const WeatherDetails = () => {
  const { currentWeather, unit } = useWeather();
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';
  const uvi = currentWeather?.uvi ?? '–';
  const visibility = currentWeather?.visibility != null
    ? unit === 'metric'
      ? `${(currentWeather.visibility / 1000).toFixed(1)} km`
      : `${(currentWeather.visibility / 1609.34).toFixed(1)} mi`
    : '–';
  const stats = useMemo(
    () => [
      { icon: <WiHumidity />, label: 'Humidity', value: currentWeather?.humidity != null ? `${currentWeather.humidity}%` : '–' },
      { icon: <WiStrongWind />, label: 'Wind', value: currentWeather?.wind != null ? `${currentWeather.wind} ${windUnit}` : '–' },
      { icon: <WiBarometer />, label: 'Pressure', value: currentWeather?.pressure != null ? `${currentWeather.pressure} hPa` : '–' },
      { icon: <WiDaySunny />, label: 'UV Index', value: uvi },
      { icon: <FiEye />, label: 'Visibility', value: visibility },
      { icon: <WiSunrise />, label: 'Sunrise', value: formatTime(currentWeather?.sunrise) },
      { icon: <WiSunset />, label: 'Sunset', value: formatTime(currentWeather?.sunset) },
    ],
    [currentWeather, uvi, visibility, windUnit],
  );
  if (!currentWeather) return null;

  return (
    <div className="animate-slide-up mt-5 rounded-[28px] border border-white/10 bg-slate-950/15 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Today&apos;s Details</h3>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Live Metrics
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="group flex min-h-[88px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3.5 transition-colors hover:bg-white/[0.14]">
    <span className="text-2xl text-white/65 transition-opacity group-hover:text-white/90">{icon}</span>
    <div className="min-w-0 leading-tight">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
);

export default WeatherDetails;
