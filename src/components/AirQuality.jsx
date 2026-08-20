/**
 * AirQualityCard.jsx
 * ──────────────────
 * Displays the Air Quality Index and key pollutant levels
 * with color-coded badges.
 */

import { WiSmog } from 'react-icons/wi';
import useWeather from '../hooks/useWeather';

/* AQI color & label mapping */
const aqiConfig = [
  {},
  { color: 'bg-emerald-500', text: 'text-emerald-400', bar: 'w-1/5' },
  { color: 'bg-lime-500', text: 'text-lime-400', bar: 'w-2/5' },
  { color: 'bg-yellow-500', text: 'text-yellow-400', bar: 'w-3/5' },
  { color: 'bg-orange-500', text: 'text-orange-400', bar: 'w-4/5' },
  { color: 'bg-red-500', text: 'text-red-400', bar: 'w-full' },
];

const AirQuality = () => {
  const { airQuality } = useWeather();

  if (!airQuality) return null;

  const cfg = aqiConfig[airQuality.aqi] || aqiConfig[1];
  const { components: c } = airQuality;

  const pollutants = [
    { label: 'PM2.5', value: c.pm2_5?.toFixed(1), unit: 'μg/m³' },
    { label: 'PM10', value: c.pm10?.toFixed(1), unit: 'μg/m³' },
    { label: 'CO', value: c.co?.toFixed(0), unit: 'μg/m³' },
    { label: 'NO₂', value: c.no2?.toFixed(1), unit: 'μg/m³' },
    { label: 'O₃', value: c.o3?.toFixed(1), unit: 'μg/m³' },
    { label: 'SO₂', value: c.so2?.toFixed(1), unit: 'μg/m³' },
  ];

  return (
    <div className="animate-slide-up glass-panel rounded-3xl p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
          <WiSmog className="text-2xl text-slate-500 dark:text-slate-400" />
          Air Quality
        </h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.color} text-white`}>
          {airQuality.label}
        </span>
      </div>

      {/* AQI bar */}
      <div className="h-2 rounded-full bg-white/10 mb-5 overflow-hidden">
        <div className={`h-full rounded-full ${cfg.color} ${cfg.bar} transition-all duration-700`} />
      </div>

      {/* Pollutant grid */}
      <div className="grid grid-cols-3 gap-3">
        {pollutants.map((p) => (
          <div key={p.label} className="rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 px-3 py-3 text-center text-slate-800 dark:text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{p.label}</p>
            <p className="text-sm font-bold">{p.value}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQuality;
