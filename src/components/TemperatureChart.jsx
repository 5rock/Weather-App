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
import useTheme from '../hooks/useTheme';

const CustomTooltip = ({ active, payload, label, degSymbol }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-slate-200 dark:border-white/10">
      <p className="font-semibold text-sm mb-1.5 text-slate-900 dark:text-white">{label}</p>
      <p className="text-orange-500 dark:text-orange-300 text-sm">↑ High: {payload[0]?.value}{degSymbol}</p>
      <p className="text-sky-500 dark:text-sky-300 text-sm">↓ Low: {payload[1]?.value}{degSymbol}</p>
    </div>
  );
};

const TemperatureChart = () => {
  const { dailyForecast, unit } = useWeather();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const degSymbol = unit === 'metric' ? '°C' : '°F';

  /* Memoize chart data — re-computes when forecast changes */
  const chartData = useMemo(() => {
    if (!dailyForecast?.length) return [];
    
    const formatDay = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    };

    return dailyForecast.map((d, i) => ({
      day: i === 0 ? 'Today' : formatDay(d.date),
      max: d.tempMax,
      min: d.tempMin,
    }));
  }, [dailyForecast]);

  if (!chartData.length) return null;

  const chartKey = chartData.map((d) => `${d.max}-${d.min}`).join(',');

  return (
    <div className="animate-slide-up glass-panel rounded-3xl p-5 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Temperature Trend</h3>

      <ResponsiveContainer key={chartKey} width="100%" height="100%" minHeight={260}>
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
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} />
          <XAxis
            dataKey="day"
            tick={{ fill: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)', fontSize: 11, fontWeight: 500 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)', fontSize: 11 }}
            axisLine={false} tickLine={false} width={32}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip content={<CustomTooltip degSymbol={degSymbol} />} />
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
