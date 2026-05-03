export function buildDailyForecast(forecast) {
  const days = new Map();

  for (const item of forecast?.list || []) {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0, 10);
    const existing = days.get(key) || {
      date,
      temps: [],
      items: [],
      middayScore: Number.POSITIVE_INFINITY,
      representative: item,
    };
    const hour = date.getHours();
    const middayScore = Math.abs(hour - 12);

    existing.temps.push(item.main.temp);
    existing.items.push(item);

    if (middayScore < existing.middayScore) {
      existing.middayScore = middayScore;
      existing.representative = item;
    }

    days.set(key, existing);
  }

  return Array.from(days.values())
    .slice(0, 5)
    .map((day) => ({
      date: day.date,
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
      icon: day.representative.weather[0].icon,
      condition: day.representative.weather[0].main,
    }));
}

export function formatTemp(value) {
  return `${Math.round(value)}°`;
}

export function formatWind(speed, units) {
  const suffix = units === 'imperial' ? 'mph' : 'm/s';
  return `${Math.round(speed)} ${suffix}`;
}
