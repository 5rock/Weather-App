/**
 * SevenDayForecast.jsx
 * ────────────────────
 * 7-day forecast list showing real API data.
 * Layout: [Day] [Icon] [Description] [Min° / Max°] [Temperature Range Bar]
 */

import { useMemo } from 'react';
import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatDay } from '../utils/formatDate';

const SevenDayForecast = () => {
  const { dailyForecast, unit } = useWeather();
  const deg = unit === 'metric' ? '°' : '°';
  const forecastRows = useMemo(() => {
    const nextSevenDays = dailyForecast?.slice(0, 7) || [];
    if (!nextSevenDays.length) return [];
    const weeklyMin = Math.min(...nextSevenDays.map((day) => day.tempMin));
    const weeklyMax = Math.max(...nextSevenDays.map((day) => day.tempMax));
    const globalRange = weeklyMax - weeklyMin || 1;

    return nextSevenDays.map((day, index) => ({
      ...day,
      dayLabel: index === 0 ? 'Today' : formatDay(day.date),
      leftPercent: ((day.tempMin - weeklyMin) / globalRange) * 100,
      widthPercent: Math.max(((day.tempMax - day.tempMin) / globalRange) * 100, 10),
    }));
  }, [dailyForecast]);
  if (!forecastRows.length) return null;

  return (
    <div className="animate-slide-up rounded-[28px] border border-white/10 bg-slate-950/15 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">7-Day Forecast</h3>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Weekly Outlook
        </span>
      </div>

      <div className="space-y-3">
        {forecastRows.map((day) => (
          <article
            key={day.date}
            className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-inner shadow-black/5 transition-colors hover:bg-white/[0.12]"
          >
            <div className="flex flex-col gap-3 md:grid md:grid-cols-[76px_minmax(0,1.35fr)_minmax(180px,1fr)] md:items-center md:gap-4">
              <div className="text-sm font-semibold tracking-wide text-white/90">
                {day.dayLabel}
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <img src={iconUrl(day.icon)} alt={day.description} className="h-10 w-10" />
                </div>
                <p className="text-sm font-medium capitalize leading-snug text-white/80 md:text-[15px]">
                  {day.description}
                </p>
              </div>

              <div className="grid grid-cols-[42px_minmax(110px,1fr)_46px] items-center gap-3 md:justify-self-end md:w-full md:max-w-[280px]">
                <span className="text-sm font-medium text-white/55">
                  {day.tempMin}{deg}
                </span>

                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/12">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-orange-400"
                    style={{
                      left: `${day.leftPercent}%`,
                      width: `${day.widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-right text-sm font-semibold text-white">
                  {day.tempMax}{deg}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SevenDayForecast;
