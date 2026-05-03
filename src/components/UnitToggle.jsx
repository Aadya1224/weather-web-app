export default function UnitToggle({ units, onChange }) {
  return (
    <div className="unit-toggle" aria-label="Temperature units">
      <button
        className={units === 'metric' ? 'active' : ''}
        type="button"
        onClick={() => onChange('metric')}
      >
        °C
      </button>
      <button
        className={units === 'imperial' ? 'active' : ''}
        type="button"
        onClick={() => onChange('imperial')}
      >
        °F
      </button>
    </div>
  );
}
