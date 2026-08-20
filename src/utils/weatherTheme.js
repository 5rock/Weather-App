/**
 * weatherTheme.js
 * ───────────────
 * Dynamic gradients per weather condition.
 */

const themes = {
  Clear: {
    gradient: 'from-amber-400 via-orange-400 to-rose-400',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-white',
    cardBg: 'bg-white/15',
  },
  Clouds: {
    gradient: 'from-slate-500 via-slate-500 to-gray-400',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-white',
    cardBg: 'bg-white/12',
  },
  Rain: {
    gradient: 'from-slate-800 via-blue-900 to-indigo-950',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-white',
    cardBg: 'bg-white/10',
  },
  Drizzle: {
    gradient: 'from-slate-700 via-blue-800 to-indigo-900',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-white',
    cardBg: 'bg-white/10',
  },
  Thunderstorm: {
    gradient: 'from-gray-950 via-purple-950 to-slate-900',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-white',
    cardBg: 'bg-white/8',
  },
  Snow: {
    gradient: 'from-blue-200 via-white to-slate-200',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-gray-800',
    cardBg: 'bg-white/30',
  },
  Mist: {
    gradient: 'from-gray-400 via-gray-300 to-slate-300',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-gray-800',
    cardBg: 'bg-white/20',
  },
  Haze: {
    gradient: 'from-yellow-300 via-amber-200 to-orange-200',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-gray-800',
    cardBg: 'bg-white/20',
  },
  Fog: {
    gradient: 'from-gray-400 via-gray-300 to-slate-300',
    bgClass: 'bg-gradient-to-br',
    textClass: 'text-gray-800',
    cardBg: 'bg-white/20',
  },
};

const defaultTheme = {
  gradient: 'from-sky-500 via-blue-600 to-indigo-700',
  bgClass: 'bg-gradient-to-br',
  textClass: 'text-white',
  cardBg: 'bg-white/12',
};

export const getWeatherTheme = (condition) =>
  themes[condition] || defaultTheme;
