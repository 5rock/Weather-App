/**
 * CurrentWeather.jsx
 * ──────────────────
 * Hero card: current conditions with enhanced glassmorphism UI.
 */

import useWeather from '../hooks/useWeather';
import { iconUrl } from '../services/weatherApi';
import { formatFullDate } from '../utils/formatDate';

const CurrentWeather = () => {
  const { currentWeather, unit } = useWeather();
  if (!currentWeather) return null;

  const deg = unit === 'metric' ? '°C' : '°F';
  const locationLabel =
    currentWeather.display || [currentWeather.city, currentWeather.country].filter(Boolean).join(', ');

  return (
    <div className="animate-fade-in rounded-[28px] border border-white/10 bg-slate-950/15 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.18)] backdrop-blur-2xl md:p-8">
      {/* City + date */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Current Conditions
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-4xl" id="current-city">
            <span className="break-words">{locationLabel}</span>
          </h2>
        </div>
        <div className="text-sm font-medium text-white/65 sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Local Forecast Date
          </p>
          <p className="mt-1">{formatFullDate(currentWeather.observedAt)}</p>
        </div>
      </div>

      {/* Hero row */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center md:gap-5">
          <img
            src={iconUrl(currentWeather.icon, '4x')}
            alt={currentWeather.description}
            className="-ml-3 h-28 w-28 shrink-0 drop-shadow-2xl md:h-36 md:w-36"
          />
          <div className="min-w-0">
            <p className="text-6xl font-extrabold leading-none tracking-tighter text-white md:text-8xl" id="current-temp">
              {currentWeather.temp}<span className="text-3xl font-semibold opacity-70 md:text-4xl">{deg}</span>
            </p>
            <p className="mt-2 text-lg font-medium capitalize text-white/85">
              {currentWeather.description}
            </p>
            <p className="mt-1 text-sm text-white/60">
              Feels like {currentWeather.feelsLike}{deg}  ·  H:{currentWeather.tempMax}{deg}  L:{currentWeather.tempMin}{deg}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CurrentWeather;
