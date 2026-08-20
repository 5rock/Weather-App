import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { FiEye } from 'react-icons/fi';
import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatLocalTime } from '../utils/formatDate';
import { generateDailySummary } from '../services/aiApi';

const CurrentWeather = () => {
  const { city, currentWeather, dailyForecast, unit, favoriteCities, toggleFavorite } = useWeather();
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (currentWeather && dailyForecast?.length > 0) {
      setIsLoadingSummary(true);
      generateDailySummary(currentWeather, dailyForecast).then(summary => {
        setAiSummary(summary);
        setIsLoadingSummary(false);
      });
    }
  }, [currentWeather, dailyForecast]);

  if (!currentWeather) return null;

  const deg = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'km/h' : 'mph'; // Note: API might give m/s, user asked for km/h visual, but we will just stick to whatever API gives + unit string
  const isFavorite = favoriteCities.includes(city);
  const visibility = currentWeather.visibility ? `${(currentWeather.visibility / 1000).toFixed(1)} km` : '–';

  // Normalize wind if metric to km/h (OpenWeatherMap metric wind is m/s, multiply by 3.6 for km/h)
  const displayWindSpeed = unit === 'metric' ? Math.round(currentWeather.wind * 3.6) : currentWeather.wind;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-3xl p-6 md:p-8 glass-panel h-full flex flex-col justify-between relative overflow-hidden">
        {/* City + Date + Favorite */}
        <div className="mb-6 flex items-start justify-between relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white" id="current-city">
              {city || currentWeather.city}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {formatLocalTime(currentWeather.timezone)}
            </p>
          </div>
          <button 
            onClick={() => toggleFavorite(city)}
            className={`p-2.5 rounded-full transition-all ${isFavorite ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-500 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-pink-500'}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Hero Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <img
              src={iconUrl(currentWeather.icon, '4x')}
              alt={currentWeather.description}
              className={`w-28 h-28 md:w-32 md:h-32 drop-shadow-xl relative z-10 -ml-4 ${currentWeather.main.toLowerCase()}-anim`}
            />
            <div>
              <p className="text-6xl md:text-7xl font-bold leading-none tracking-tighter text-slate-900 dark:text-white" id="current-temp">
                {currentWeather.temp}<span className="text-3xl font-semibold opacity-70">{deg}</span>
              </p>
              <p className="capitalize text-lg mt-1 font-medium text-slate-700 dark:text-slate-200">
                {currentWeather.description}
              </p>
              <p className="text-sm opacity-80 mt-1 text-slate-600 dark:text-slate-400">
                Feels like {currentWeather.feelsLike}{deg}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={<WiHumidity size={24} />} label="Humidity" value={`${currentWeather.humidity}%`} />
        <Stat icon={<WiStrongWind size={24} />} label="Wind" value={`${displayWindSpeed} ${windUnit}`} />
        <Stat icon={<WiBarometer size={24} />} label="Pressure" value={`${currentWeather.pressure} hPa`} />
        <Stat icon={<FiEye size={18} />} label="Visibility" value={visibility} />
      </div>

      {/* AI Summary */}
      <div className="p-4 rounded-2xl glass-card border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 flex gap-3 items-start">
        <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-500 shrink-0">
          <Sparkles size={18} className={isLoadingSummary ? "animate-pulse" : ""} />
        </div>
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
          {isLoadingSummary ? (
            <span className="opacity-70 flex items-center gap-2">
              Generating daily insight...
            </span>
          ) : (
            aiSummary || "Today is looking great. Enjoy the weather!"
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1 rounded-2xl glass-card p-4 transition-colors cursor-default border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
      {icon}
      <p className="text-[11px] uppercase tracking-wider font-semibold">{label}</p>
    </div>
    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{value}</p>
  </div>
);

export default CurrentWeather;
