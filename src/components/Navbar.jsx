/**
 * Navbar.jsx
 * ──────────
 * Top navigation: branding, search, and temperature toggle.
 * Stacking context set to ensure search dropdown always on top.
 */

import { WiDaySunny } from 'react-icons/wi';
import SearchBar from './SearchBar';
import TemperatureToggle from './TemperatureToggle';

const Navbar = () => (
  <nav
    className="relative w-full rounded-[28px] border border-white/10 bg-slate-950/20 px-4 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl md:px-5"
    style={{ zIndex: 1000 }}
  >
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-5">
      {/* Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <WiDaySunny className="text-3xl text-yellow-300 drop-shadow-lg" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Weather<span className="font-light opacity-80">Dashboard</span>
          </h1>
          <p className="text-sm text-white/55">Live forecast, air quality, and trends.</p>
        </div>
      </div>

      {/* Search */}
      <div className="w-full min-w-0">
        <SearchBar />
      </div>

      {/* Toggle */}
      <div className="flex justify-start lg:justify-end">
        <TemperatureToggle />
      </div>
    </div>
  </nav>
);

export default Navbar;
