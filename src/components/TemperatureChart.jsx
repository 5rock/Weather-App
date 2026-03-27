/**
 * WeatherChart.jsx
 * ────────────────
 * Temperature trend chart that updates dynamically using dailyForecast.
 */

import { useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import useWeather from '../hooks/useWeather';
import { formatDay } from '../utils/formatDate';

const TemperatureChart = () => {
  const { dailyForecast, unit } = useWeather();
  const degSymbol = unit === 'metric' ? '°C' : '°F';

  /* Memoize chart data — re-computes when forecast changes */
  const chartData = useMemo(() => {
    if (!dailyForecast?.length) return [];

    return dailyForecast.map((d, i) => ({
      day: i === 0 ? 'Today' : formatDay(d.date),
      max: d.tempMax,
      min: d.tempMin,
    }));
  }, [dailyForecast]);

  if (!chartData.length) return null;

  const chartKey = chartData.map((d) => `${d.max}-${d.min}`).join(',');

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <p className="font-semibold text-sm mb-1.5 text-white">{label}</p>
        <p className="text-orange-300 text-sm">↑ High: {payload[0]?.value}{degSymbol}</p>
        <p className="text-sky-300 text-sm">↓ Low: {payload[1]?.value}{degSymbol}</p>
      </div>
    );
  };

  return (
    <div className="animate-slide-up rounded-[28px] border border-white/10 bg-slate-950/15 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Temperature Trend</h3>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Highs & Lows
        </span>
      </div>

      <ResponsiveContainer key={chartKey} width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -5, bottom: 5 }}>
          <defs>
            <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="day"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            axisLine={false} tickLine={false} width={32}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="max" stroke="#fb923c" strokeWidth={2.5}
            fill="url(#gradMax)" dot={{ r: 4, fill: '#fb923c', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} name="High"
            animationDuration={800}
          />
          <Area
            type="monotone" dataKey="min" stroke="#38bdf8" strokeWidth={2.5}
            fill="url(#gradMin)" dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} name="Low"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
