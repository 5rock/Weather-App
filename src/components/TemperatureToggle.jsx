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
      onClick={toggleUnit}
      className="relative inline-flex shrink-0 items-center gap-0 rounded-full border border-white/10 bg-white/10 p-0.5 transition-all hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
      aria-label="Toggle temperature unit"
      id="temp-unit-toggle"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0.5 w-[46px] rounded-full bg-white/20 shadow-lg transition-transform duration-200 ${
          isMetric ? 'translate-x-0' : 'translate-x-[46px]'
        }`}
      />
      <span
        className={`relative z-10 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
          isMetric ? 'text-white' : 'text-white/45'
        }`}
      >
        °C
      </span>
      <span
        className={`relative z-10 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
          !isMetric ? 'text-white' : 'text-white/45'
        }`}
      >
        °F
      </span>
    </button>
  );
};

export default TemperatureToggle;
