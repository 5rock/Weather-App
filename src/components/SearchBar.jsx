/**
 * SearchBar.jsx
 * ─────────────
 * Accessible search input with autocomplete suggestions.
 */

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import useWeather from '../hooks/useWeather';
import { fetchCitySuggestions } from '../services/weatherApi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  const { fetchWeatherByCity } = useWeather();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        const results = await fetchCitySuggestions(query);
        setSuggestions(results);
        setLoading(false);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (cityName) => {
    setQuery('');
    setShowDropdown(false);
    fetchWeatherByCity(cityName);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSelect(query.trim());
    }
  };

  return (
    <div className="relative w-full z-[1000]" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-slate-400 dark:text-slate-500" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length) setShowDropdown(true); }}
          placeholder="Search for cities..."
          aria-label="Search for a city"
          className="w-full bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 
                     pl-11 pr-11 py-2.5 rounded-full text-sm font-medium focus:outline-none 
                     focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-500 text-slate-900 dark:text-white"
        />
        {loading && (
          <Loader2 className="absolute right-4 animate-spin text-sky-500" size={18} />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl 
                       border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2">
          {suggestions.map((s, idx) => (
            <li
              key={`${s.display}-${idx}`}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors dark:text-slate-200"
              onClick={() => handleSelect(s.name)}
            >
              {s.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
