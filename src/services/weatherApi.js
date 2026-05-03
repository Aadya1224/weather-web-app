const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function hasApiKey() {
  return Boolean(API_KEY && API_KEY !== 'your_key_here');
}

async function getJson(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || errorMessage);
  }

  return response.json();
}

export async function searchCity(city) {
  if (!hasApiKey()) {
    throw new Error('Add your OpenWeather API key to .env to load live weather.');
  }

  const query = encodeURIComponent(city.trim());
  const url = `${GEO_BASE_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`;
  const results = await getJson(url, 'Unable to search for that city.');

  if (!results.length) {
    throw new Error('No matching city was found. Try a nearby city or include the country.');
  }

  return results[0];
}

export async function fetchWeatherByCoords({ lat, lon }, units) {
  if (!hasApiKey()) {
    throw new Error('Add your OpenWeather API key to .env to load live weather.');
  }

  const params = `lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const [current, forecast] = await Promise.all([
    getJson(`${WEATHER_BASE_URL}/weather?${params}`, 'Unable to load current weather.'),
    getJson(`${WEATHER_BASE_URL}/forecast?${params}`, 'Unable to load the forecast.'),
  ]);

  return { current, forecast };
}

export function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}
