import { MapPin, Search } from 'lucide-react';

export default function SearchBar({
  city,
  onCityChange,
  onSubmit,
  onUseLocation,
  isLoading,
}) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <label className="search-field">
        <Search aria-hidden="true" size={20} />
        <input
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          placeholder="Search city"
          aria-label="Search city"
          disabled={isLoading}
        />
      </label>
      <button className="primary-action" type="submit" disabled={isLoading || !city.trim()}>
        <Search aria-hidden="true" size={18} />
        <span>Search</span>
      </button>
      <button className="icon-action" type="button" onClick={onUseLocation} disabled={isLoading}>
        <MapPin aria-hidden="true" size={19} />
        <span>Use my location</span>
      </button>
    </form>
  );
}
