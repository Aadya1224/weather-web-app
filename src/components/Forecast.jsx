import { getIconUrl } from '../services/weatherApi.js';

export default function Forecast({ days }) {
  return (
    <section className="forecast-panel" aria-label="Five day forecast">
      <div className="section-heading">
        <h2>5-day forecast</h2>
        <p>Daily highs and lows from OpenWeather’s 3-hour forecast.</p>
      </div>
      <div className="forecast-grid">
        {days.map((day) => (
          <article className="forecast-card" key={day.date.toISOString()}>
            <span className="day-name">
              {new Intl.DateTimeFormat('en', { weekday: 'short' }).format(day.date)}
            </span>
            <img src={getIconUrl(day.icon)} alt={day.condition} />
            <strong>{day.condition}</strong>
            <span>
              {day.max}° / {day.min}°
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
