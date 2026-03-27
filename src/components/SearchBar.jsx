/**
 * SearchBar.jsx
 * ─────────────
 * City search with autocomplete and recent searches.
 * FIXED: dropdown z-index, glassmorphism, contrast, animations.
 */

import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX, FiClock, FiMapPin } from 'react-icons/fi';
import { fetchCitySuggestions } from '../services/weatherApi';
import useWeather from '../hooks/useWeather';

const SearchBar = () => {
  const { fetchWeatherByCity, fetchWeatherByCoords, recentCities, clearRecentCities } = useWeather();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const suggestionRequestRef = useRef(0);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const resetSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    suggestionRequestRef.current += 1;
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  /* Debounced autocomplete */
  const handleChange = (e) => {
    const value = e.target.value;
    const trimmedValue = value.trim();
    setQuery(value);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (trimmedValue.length >= 2) {
      const requestId = ++suggestionRequestRef.current;
      debounceRef.current = setTimeout(async () => {
        const results = await fetchCitySuggestions(trimmedValue);
        if (suggestionRequestRef.current !== requestId) return;
        setSuggestions(results);
        setShowDropdown(true);
      }, 300);
    } else {
      suggestionRequestRef.current += 1;
      setSuggestions([]);
      setShowDropdown(trimmedValue.length === 0 && recentCities.length > 0);
    }
  };

  const handleFocus = () => {
    if (query.length < 2 && recentCities.length > 0) setShowDropdown(true);
    if (query.length >= 2 && suggestions.length > 0) setShowDropdown(true);
  };

  const selectCity = (location) => {
    resetSearch();

    if (typeof location === 'string') {
      fetchWeatherByCity(location);
      return;
    }

    if (location?.lat !== null && location?.lat !== undefined &&
        location?.lon !== null && location?.lon !== undefined) {
      fetchWeatherByCoords(location.lat, location.lon, location);
      return;
    }

    if (location?.name) {
      fetchWeatherByCity(location.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) selectCity(query.trim());
  };

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ zIndex: 1000 }}>
      {/* ─── Input Form ─── */}
      <form onSubmit={handleSubmit} className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 text-sm" />
        <input
          type="text"
          placeholder="Search city…"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/50 backdrop-blur-md placeholder-white/50 text-white
                     border border-white/10 outline-none focus:ring-2 focus:ring-sky-400/50 transition-all text-sm shadow-inner"
          id="city-search-input"
        />
        {query && (
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
            onClick={resetSearch}
            aria-label="Clear search"
          >
            <FiX size={14} />
          </button>
        )}
      </form>

      {/* ─── Dropdown ─── */}
      {showDropdown && (
        <div
          className="absolute mt-2 w-full rounded-2xl overflow-hidden
                     bg-slate-900/95 backdrop-blur-2xl
                     shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10
                     animate-fade-in"
          style={{ zIndex: 1000 }}
        >
          {/* Autocomplete results */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <span className="px-4 text-[10px] uppercase tracking-widest text-sky-400 font-semibold mb-1 block">
                Suggestions
              </span>
              <ul>
                {suggestions.map((s, i) => (
                  <li key={`${s.lat}-${s.lon}-${i}`}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-white/10
                                 transition-colors flex items-center gap-3"
                      onClick={() => selectCity(s)}
                      id={`suggestion-${i}`}
                    >
                      <FiMapPin className="text-sky-400/70 shrink-0" size={14} />
                      <span className="font-medium leading-5">{s.display || s.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent searches */}
          {suggestions.length === 0 && recentCities.length > 0 && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-white/10 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecentCities}
                  className="text-[10px] text-white/40 hover:text-white/80 transition uppercase tracking-widest font-semibold"
                  id="clear-recent-btn"
                >
                  Clear
                </button>
              </div>
              <ul>
                {recentCities.map((c, i) => (
                  <li key={`${c.lat ?? 'na'}-${c.lon ?? 'na'}-${c.display || c.name}-${i}`}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/10
                                 transition-colors flex items-center gap-3"
                      onClick={() => selectCity(c)}
                      id={`recent-city-${i}`}
                    >
                      <FiClock className="text-white/30 shrink-0" size={14} />
                      <span>{c.display || c.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {query.length >= 2 && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-white/50">
              No cities found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
