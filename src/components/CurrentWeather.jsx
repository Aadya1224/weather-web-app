import { CloudSun } from 'lucide-react';
import { formatTemp, formatWind } from '../utils/forecast.js';
import { getIconUrl } from '../services/weatherApi.js';

export default function CurrentWeather({ data, units }) {
  const condition = data.weather[0];
  const place = [data.name, data.sys?.country].filter(Boolean).join(', ');
  const today = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <section className="current-panel" aria-label="Current weather">
      <div className="current-copy">
        <div className="eyebrow">
          <CloudSun aria-hidden="true" size={18} />
          <span>Current Weather</span>
        </div>
        <h1>{place}</h1>
        <p>{today}</p>
        <div className="temperature-row">
          <span className="temperature">{formatTemp(data.main.temp)}</span>
          <span className="condition">{condition.description}</span>
        </div>
      </div>
      <img className="weather-art" src={getIconUrl(condition.icon)} alt={condition.description} />
      <div className="metric-grid">
        <Metric label="Feels like" value={formatTemp(data.main.feels_like)} />
        <Metric label="Humidity" value={`${data.main.humidity}%`} />
        <Metric label="Wind" value={formatWind(data.wind.speed, units)} />
        <Metric label="Pressure" value={`${data.main.pressure} hPa`} />
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
