/**
 * AirQualityCard.jsx
 * ──────────────────
 * Displays the Air Quality Index and key pollutant levels
 * with color-coded badges.
 */

import { useMemo } from 'react';
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
  const cfg = aqiConfig[airQuality?.aqi] || aqiConfig[1];
  const c = airQuality?.components;
  const pollutants = useMemo(
    () => [
      { label: 'PM2.5', value: c?.pm2_5 != null ? c.pm2_5.toFixed(1) : '–', unit: 'μg/m³' },
      { label: 'PM10', value: c?.pm10 != null ? c.pm10.toFixed(1) : '–', unit: 'μg/m³' },
      { label: 'CO', value: c?.co != null ? c.co.toFixed(0) : '–', unit: 'μg/m³' },
      { label: 'NO₂', value: c?.no2 != null ? c.no2.toFixed(1) : '–', unit: 'μg/m³' },
      { label: 'O₃', value: c?.o3 != null ? c.o3.toFixed(1) : '–', unit: 'μg/m³' },
      { label: 'SO₂', value: c?.so2 != null ? c.so2.toFixed(1) : '–', unit: 'μg/m³' },
    ],
    [c],
  );

  if (!airQuality) {
    return (
      <div className="animate-slide-up rounded-[28px] border border-white/10 bg-slate-950/15 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-white">
          <WiSmog className="text-2xl text-white/70" />
          <h3 className="text-lg font-semibold">Air Quality</h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Air quality data is temporarily unavailable for this location.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up rounded-[28px] border border-white/10 bg-slate-950/15 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <WiSmog className="text-2xl opacity-70" />
            Air Quality
          </h3>
          <p className="mt-1 text-sm text-white/60">US AQI scale with live pollutant breakdown.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">AQI</p>
          <p className={`mt-1 text-2xl font-bold ${cfg.text}`}>{airQuality.aqi}/5</p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${cfg.color} text-white`}>
          {airQuality.label}
        </span>
        <span className="text-xs font-medium text-white/45">Updated from Open-Meteo</span>
      </div>

      {/* AQI bar */}
      <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${cfg.color} ${cfg.bar} transition-all duration-700`} />
      </div>

      {/* Pollutant grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pollutants.map((p) => (
          <div key={p.label} className="rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{p.label}</p>
            <p className="mt-2 text-base font-bold text-white">{p.value}</p>
            <p className="mt-1 text-[10px] text-white/40">{p.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQuality;
