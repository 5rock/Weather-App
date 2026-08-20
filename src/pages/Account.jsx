import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WeatherContext } from '../context/WeatherContext';
import useTheme from '../hooks/useTheme';
import { ArrowLeft, User, Settings, MapPin, Search } from 'lucide-react';

const Account = () => {
  const { user, loginWithGoogle, logout } = useContext(AuthContext);
  const { unit, toggleUnit, favoriteCities, recentCities, fetchWeatherByCity } = useContext(WeatherContext);
  const { theme, setTheme } = useTheme();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred during sign-in.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Weather</span>
      </Link>

      <div className="max-w-md mx-auto mt-12 space-y-8">
        
        {/* Account Header */}
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-slate-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {user?.displayName || 'Guest User'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {user ? 'Manage your account' : 'Sign in to sync your data'}
            </p>
          </div>
        </div>

        {/* Authentication Action */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
          {authError && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center">
              {authError}
            </div>
          )}
          
          {!user ? (
            <button 
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white py-3.5 rounded-xl font-medium transition-colors border border-slate-100 dark:border-slate-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={logout}
              className="w-full text-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 py-3.5 rounded-xl font-medium transition-colors"
            >
              Sign out
            </button>
          )}
        </div>

        {/* Preferences */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Settings size={18} className="text-slate-400" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Preferences</h2>
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
              <span className="font-medium text-slate-700 dark:text-slate-300">Appearance</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {['light', 'dark', 'system'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${theme === t ? 'bg-white dark:bg-slate-600 text-sky-500 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
              <span className="font-medium text-slate-700 dark:text-slate-300">Temperature</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button 
                  onClick={() => unit !== 'metric' && toggleUnit()}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${unit === 'metric' ? 'bg-white dark:bg-slate-600 text-sky-500 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  °C
                </button>
                <button 
                  onClick={() => unit === 'metric' && toggleUnit()}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${unit !== 'metric' ? 'bg-white dark:bg-slate-600 text-sky-500 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  °F
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Data */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-semibold text-slate-800 dark:text-white">Your Data</h2>
          </div>
          
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-2 flex items-center gap-2">
                <MapPin size={14} /> Favorites
              </h3>
              {favoriteCities.length > 0 ? (
                <div className="space-y-1">
                  {favoriteCities.map(city => (
                    <Link to="/" key={city} onClick={() => fetchWeatherByCity(city)} className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">
                      {city}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 italic">
                  ☆ No favorite cities yet
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-2 flex items-center gap-2">
                <Search size={14} /> Recent Searches
              </h3>
              {recentCities.length > 0 ? (
                <div className="space-y-1">
                  {recentCities.map(city => (
                    <Link to="/" key={city} onClick={() => fetchWeatherByCity(city)} className="block px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">
                      {city}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 italic">
                  No recent searches
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Account;
