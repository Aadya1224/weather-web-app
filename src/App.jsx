import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather.jsx';
import Forecast from './components/Forecast.jsx';
import SearchBar from './components/SearchBar.jsx';
import UnitToggle from './components/UnitToggle.jsx';
import { buildDailyForecast } from './utils/forecast.js';
import { fetchWeatherByCoords, hasApiKey, searchCity } from './services/weatherApi.js';

const DEFAULT_CITY = 'Kolkata';

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [lastLocation, setLastLocation] = useState(null);

  const forecastDays = useMemo(
    () => (weather?.forecast ? buildDailyForecast(weather.forecast) : []),
    [weather],
  );

  async function loadByCity(searchValue = city) {
    const nextCity = searchValue.trim();
    if (!nextCity) return;

    setStatus('loading');
    setMessage('');

    try {
      const location = await searchCity(nextCity);
      const nextWeather = await fetchWeatherByCoords(location, units);
      setWeather(nextWeather);
      setLastLocation(location);
      setCity(location.name);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong while loading weather.');
    }
  }

  async function loadByCoords(coords) {
    setStatus('loading');
    setMessage('');

    try {
      const location = { lat: coords.latitude, lon: coords.longitude };
      const nextWeather = await fetchWeatherByCoords(location, units);
      setWeather(nextWeather);
      setLastLocation(location);
      setCity(nextWeather.current.name || city);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Unable to load weather for your location.');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadByCity();
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setStatus('error');
      setMessage('Geolocation is not available in this browser.');
      return;
    }

    setStatus('loading');
    setMessage('Waiting for your browser location permission...');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => loadByCoords(coords),
      () => {
        setStatus('error');
        setMessage('Location permission was denied. Search for a city instead.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleUnitsChange(nextUnits) {
    setUnits(nextUnits);
  }

  useEffect(() => {
    if (!hasApiKey()) {
      setStatus('error');
      setMessage('Create a .env file with VITE_OPENWEATHER_API_KEY to load live weather.');
      return;
    }

    loadByCity(DEFAULT_CITY);
  }, []);

  useEffect(() => {
    if (!lastLocation || status === 'loading') return;

    setStatus('loading');
    setMessage('');
    fetchWeatherByCoords(lastLocation, units)
      .then((nextWeather) => {
        setWeather(nextWeather);
        setStatus('success');
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.message || 'Unable to refresh weather with the new unit.');
      });
  }, [units]);

  const isLoading = status === 'loading';

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Sparkles aria-hidden="true" size={20} />
          </span>
          <div>
            <span>Weatherly</span>
            <small>OpenWeather dashboard</small>
          </div>
        </div>
        <UnitToggle units={units} onChange={handleUnitsChange} />
      </header>

      <section className="hero">
        <div>
          <p className="kicker">Live city forecast</p>
          <h1>Plan your day with clear, current weather.</h1>
        </div>
        <SearchBar
          city={city}
          onCityChange={setCity}
          onSubmit={handleSubmit}
          onUseLocation={handleUseLocation}
          isLoading={isLoading}
        />
      </section>

      {message && (
        <div className={`notice ${status === 'error' ? 'error' : ''}`}>
          {isLoading ? <Loader2 className="spin" size={18} /> : <AlertCircle size={18} />}
          <span>{message}</span>
        </div>
      )}

      {isLoading && !weather && (
        <div className="loading-state">
          <Loader2 className="spin" size={28} />
          <span>Loading weather data...</span>
        </div>
      )}

      {weather && (
        <div className="dashboard">
          <CurrentWeather data={weather.current} units={units} />
          <Forecast days={forecastDays} />
        </div>
      )}
    </main>
  );
}
