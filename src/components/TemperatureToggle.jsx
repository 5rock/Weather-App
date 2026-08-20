/**
 * TemperatureToggle.jsx
 * ─────────────────────
 * Styled pill toggle between °C and °F.
 */

import useWeather from '../hooks/useWeather';

const TemperatureToggle = () => {
  const { unit, toggleUnit } = useWeather();
  const isMetric = unit === 'metric';

  return (
    <button
      type="button"
      onClick={toggleUnit}
      className="relative flex items-center gap-0 rounded-full bg-slate-200/50 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50
                 transition-all p-0.5 shrink-0 border border-slate-300/30 dark:border-white/10"
      aria-label="Toggle temperature unit"
      id="temp-unit-toggle"
    >
      <span
        className={`relative z-10 px-3 py-1.5 rounded-full text-sm font-semibold transition-all
          ${isMetric ? 'bg-white text-sky-500 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
      >
        °C
      </span>
      <span
        className={`relative z-10 px-3 py-1.5 rounded-full text-sm font-semibold transition-all
          ${!isMetric ? 'bg-white text-sky-500 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
      >
        °F
      </span>
    </button>
  );
};

export default TemperatureToggle;
