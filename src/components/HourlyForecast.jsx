/**
 * HourlyForecast.jsx
 * ──────────────────
 * Scrollable 24-hour carousel. Times come from API data.
 */

import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatHour } from '../utils/formatDate';

const HourlyForecast = () => {
  const { hourlyForecast } = useWeather();
  if (!hourlyForecast?.length) return null;

  const deg = '°';

  return (
    <div className="animate-slide-up glass-panel rounded-3xl p-5">
      <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Hourly Forecast</h3>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide" id="hourly-scroll">
        {hourlyForecast.map((h, i) => (
          <div
            key={h.time}
            className={`flex flex-col items-center shrink-0 rounded-2xl
                       px-3.5 py-4 min-w-[76px] transition-all cursor-default border 
                       ${i === 0 
                         ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20' 
                         : 'bg-white/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <span className={`text-[12px] font-medium whitespace-nowrap ${i === 0 ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {i === 0 ? 'Now' : formatHour(h.time)}
            </span>
            <img
              src={iconUrl(h.icon)}
              alt={h.description}
              className="w-10 h-10 my-2 drop-shadow-sm"
            />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {h.temp}{deg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
