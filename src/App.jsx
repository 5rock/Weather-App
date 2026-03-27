/**
 * App.jsx
 * ───────
 * Root application component.
 * Wraps the Dashboard with the WeatherProvider context.
 */

import { Analytics } from '@vercel/analytics/react';
import { WeatherProvider } from './context/WeatherContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <WeatherProvider>
      <Dashboard />
      <Analytics />
    </WeatherProvider>
  );
}

export default App;
