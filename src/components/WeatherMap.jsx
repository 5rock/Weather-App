import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import useWeather from '../hooks/useWeather';

// Component to dynamically update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

const WeatherMap = () => {
  const { currentWeather } = useWeather();

  if (!currentWeather?.coord) {
    return (
      <div className="h-[400px] glass-panel rounded-3xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
        <Layers size={48} className="mb-4 opacity-50" />
        <p>Map data unavailable</p>
      </div>
    );
  }

  const { lat, lon } = currentWeather.coord;
  const center = [lat, lon];
  
  // Use OpenWeatherMap tile server (requires API key in URL, but we use a generic placeholder pattern for safety if key is restricted)
  // For production, OWM Maps API requires a specific plan. If unavailable, these layers might fail, but Leaflet handles it gracefully.
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  return (
    <div className="relative h-[400px] glass-panel rounded-3xl overflow-hidden p-1">
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-2">
        <Layers size={14} className="text-sky-500" />
        Interactive Weather Map
      </div>

      <MapContainer 
        center={center} 
        zoom={10} 
        scrollWheelZoom={false}
        className="w-full h-full rounded-[1.25rem] z-0"
      >
        <MapUpdater center={center} />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Map">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {WEATHER_API_KEY && WEATHER_API_KEY !== 'demo_key' && WEATHER_API_KEY !== 'your_api_key_here' && (
            <>
              <LayersControl.Overlay checked name="Temperature">
                <TileLayer
                  url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Precipitation">
                <TileLayer
                  url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Wind Speed">
                <TileLayer
                  url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Clouds">
                <TileLayer
                  url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
                />
              </LayersControl.Overlay>
            </>
          )}
        </LayersControl>

        <Marker position={center}>
          <Popup className="rounded-xl overflow-hidden">
            <div className="font-semibold">{currentWeather.city}</div>
            <div className="text-sm">{currentWeather.temp}° - {currentWeather.description}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
