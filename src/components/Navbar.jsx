/**
 * Navbar.jsx
 * ──────────
 * Top navigation: branding, search, theme toggle, unit toggle, and user profile.
 */

import { Link } from 'react-router-dom';
import { WiDaySunny } from 'react-icons/wi';
import { Moon, Sun, User as UserIcon } from 'lucide-react';
import SearchBar from './SearchBar';
import TemperatureToggle from './TemperatureToggle';
import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();

  const handleThemeCycle = () => {
    if (theme === 'system') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('system');
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <nav className="relative w-full flex flex-col md:flex-row items-center justify-between gap-4
                    px-5 py-3.5 glass-panel rounded-2xl z-[1000]"
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
        <WiDaySunny className="text-3xl text-sky-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Weather<span className="font-light opacity-80">AI</span>
        </h1>
      </Link>

      {/* Search */}
      <div className="w-full md:max-w-md">
        <SearchBar />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <TemperatureToggle />
        
        <button 
          type="button"
          onClick={handleThemeCycle}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 relative"
          aria-label="Toggle Theme"
        >
          {theme === 'system' && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span></span>}
          {isDark ? <Moon size={18} className="text-sky-400" /> : <Sun size={18} className="text-orange-500" />}
        </button>

        <Link 
          to="/account"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors overflow-hidden"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={18} className="text-slate-600 dark:text-slate-300" />
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
