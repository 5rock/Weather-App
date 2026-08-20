/**
 * App.jsx
 * ───────
 * Application Routes.
 */

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import useTheme from './hooks/useTheme';

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark' : ''}`}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
