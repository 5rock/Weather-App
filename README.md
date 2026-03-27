# Weather Dashboard 

A clean, modern, fully-responsive weather dashboard built with React, Vite, and Tailwind CSS. Provides real-time weather tracking, 7-day forecasting, and dynamic temperature trends using OpenWeatherMap APIs.

---

## Features

- **Real-Time Weather Data:** Accurate current weather including temperature, "feels like", humidity, wind speed, pressure, UV index, and visibility.
- **Geocoding City Search:** Autocomplete city names automatically after 2 characters (powered by OpenWeather Geo API).
- **Recent Searches:** Remembers your 5 most recently viewed cities for easy access.
- **Geolocation Support:** Automatically detects your local weather on initial mount (with a graceful fallback).
- **Hourly Forecast:** A sleek, 24-hour horizontal scrolling forecast layout.
- **7-Day Forecast:** Spec-accurate layout showing daily condition, min/max temperatures, and a visual range bar comparing the day’s range against the week’s.
- **Temperature Trend Chart:** Dynamic Recharts-powered graph plotting the week's highs and lows.
- **Air Quality Index Panel:** Full PM2.5, PM10, CO, NO₂, O₃, and SO₂ pollutant tracking.
- **Performance Optimized:** Includes 300ms search debouncing and 10-minute LocalStorage data caching per coordinate.
- **Beautiful UI:** Glassmorphism styled cards, fluid animations, and a dynamic gradient background that changes based on weather conditions.
- **Unit Toggle:** Instantly swap between °C and °F anywhere in the dashboard.

---

## Tech Stack

- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS (Vanilla + utility classes)
- **Data Fetching:** Axios
- **Charting Engine:** Recharts
- **Icons:** React Icons (`react-icons/wi`, `react-icons/fi`)
- **State Management:** React Context API (`WeatherContext.jsx`)

---

## Project Structure

```text
weather-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── icons/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── CurrentWeather.jsx
│   │   ├── WeatherDetails.jsx
│   │   ├── HourlyForecast.jsx
│   │   ├── SevenDayForecast.jsx
│   │   ├── TemperatureChart.jsx
│   │   └── AirQuality.jsx
│   ├── context/
│   │   └── WeatherContext.jsx
│   ├── hooks/
│   │   └── useWeather.js
│   ├── services/
│   │   └── weatherApi.js
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── weatherIcons.js
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── tailwind.config.js
```

---

## Installation & API Setup

1. **Open the project folder:**
   ```bash
   cd weather-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get an OpenWeatherMap API Key:**
   Sign up at [OpenWeatherMap](https://openweathermap.org/) and navigate to your API keys page. You need the "One Call 3.0 API" enabled for full forecast details.

4. **Environment Variables:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

5. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view it in the browser.

---

## Deployment

This project uses Vite, so it is optimized and ready to be deployed to static hosting platforms like Vercel or Netlify, or packaged with Docker.

### Production Build
To create an optimized production build, run:
```bash
npm run build
```
This generates a `dist/` directory containing your finalized production code.

### Deploying to Vercel
1. Create a new Vercel project and point it at this app's source folder or upload it through your preferred workflow.
2. In the Environment Variables section, add:
   - **Name:** `VITE_WEATHER_API_KEY`
   - **Value:** `<your-api-key>`
3. Deploy the app with the default Vite build settings (`npm run build`, `dist` output).

### Deploying to Netlify
1. Create a new Netlify site for this project.
2. Set build command to `npm run build` and publish directory to `dist`.
3. Add `VITE_WEATHER_API_KEY` in Netlify's Environment Variables settings.
4. Deploy site.

### Deploying with Docker
1. Build the image:
   ```bash
   docker build -t weather-dashboard .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:80 weather-dashboard
   ```

---

*Powered by OpenWeatherMap · Built with React & Tailwind CSS*
