/**
 * SevenDayForecast.jsx
 * ────────────────────
 * 7-day forecast list showing real API data.
 * Layout: [Day] [Icon] [Description] [Min° / Max°] [Temperature Range Bar]
 */

import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';

const SevenDayForecast = () => {
  const { dailyForecast, unit } = useWeather();
  if (!dailyForecast?.length) return null;

  const deg = unit === 'metric' ? '°' : '°';

  /* Compute global weekly range to size the bars correctly */
  const weeklyMin = Math.min(...dailyForecast.map(d => d.tempMin));
  const weeklyMax = Math.max(...dailyForecast.map(d => d.tempMax));
  const globalRange = weeklyMax - weeklyMin || 1;

  const formatDay = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="animate-slide-up glass-panel rounded-3xl p-5 h-full">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">7-Day Forecast</h3>

      <div className="grid gap-2">
        {dailyForecast.slice(0, 7).map((day, i) => {
          /* Calculate percentage position for this day's range bar */
          const leftPercent = ((day.tempMin - weeklyMin) / globalRange) * 100;
          const widthPercent = ((day.tempMax - day.tempMin) / globalRange) * 100;

          return (
            <div
              key={day.date}
              className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800/80 px-4 py-3 transition-colors"
            >
              {/* Day */}
              <span className="w-12 text-sm font-medium shrink-0">
                {i === 0 ? 'Today' : formatDay(day.date)}
              </span>

              {/* Icon */}
              <img src={iconUrl(day.icon)} alt={day.description} className="w-8 h-8 shrink-0" />

              {/* Description (hidden on extra small screens) */}
              <span className="text-xs capitalize opacity-60 hidden sm:block w-28 truncate shrink-0 text-left">
                {day.description}
              </span>

              {/* Min temp */}
              <span className="text-xs opacity-50 w-8 text-right shrink-0">
                {day.tempMin}{deg}
              </span>

              {/* Gradient bar */}
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 relative mx-1 min-w-[50px] overflow-hidden">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, 8)}%` // minimum 8% width so it's visible
                  }}
                />
              </div>

              {/* Max temp */}
              <span className="text-sm font-semibold w-8 text-right shrink-0">
                {day.tempMax}{deg}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SevenDayForecast;
