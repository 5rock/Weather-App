/**
 * HourlyForecast.jsx
 * ──────────────────
 * Scrollable 24-hour carousel. Times come from API data.
 */

import { useMemo } from 'react';
import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatHour } from '../utils/formatDate';

const HourlyForecast = () => {
  const { hourlyForecast, unit } = useWeather();
  const deg = unit === 'metric' ? '°' : '°';
  const hourlyItems = useMemo(() => hourlyForecast?.slice(0, 24) || [], [hourlyForecast]);
  if (!hourlyItems.length) return null;

  return (
    <div className="animate-slide-up rounded-[28px] border border-white/10 bg-slate-950/15 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Hourly Forecast</h3>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Next 24 Hours
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" id="hourly-scroll">
        {hourlyItems.map((h, i) => (
          <div
            key={h.time}
            className="flex min-w-[92px] shrink-0 snap-start flex-col items-center rounded-2xl border border-white/10 bg-white/[0.08]
                       px-3.5 py-3 text-center transition-all hover:-translate-y-0.5 hover:bg-white/[0.14]"
          >
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              {i === 0 ? 'Now' : formatHour(h.time)}
            </span>
            <img
              src={iconUrl(h.icon)}
              alt={h.description}
              className="my-2 h-10 w-10 drop-shadow"
            />
            <span className="text-sm font-bold text-white">
              {h.temp}{deg}
            </span>
            <span className="mt-1 text-[11px] capitalize leading-4 text-white/55">
              {h.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
