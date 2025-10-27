import React, { useState } from "react";
import "./search-bar.scss";

/**
 * Props for the SearchBar component.
 * 
 * @interface PropiedadesSearchBar
 * @property {function} alBuscar - Callback executed when search is submitted
 * @property {string} [marcadorPosicion] - Input placeholder text (optional)
 */
interface PropiedadesSearchBar {
  alBuscar: (consulta: string) => void;
  marcadorPosicion?: string;
}

/**
 * SearchBar component with input field and submit button.
 * 
 * @component
 * @param {PropiedadesSearchBar} props - Component properties
 * @returns {JSX.Element} Search form with complete functionality
 * 
 * @example
 * ```tsx
 * <SearchBar 
 *   alBuscar={(consulta) => console.log(consulta)} 
 *   marcadorPosicion="Search movies..."
 * />
 * ```
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Minimum 44x44px touch targets
 * - Color contrast 4.5:1 or higher
 * - Fully navigable with keyboard
 * - Descriptive labels for screen readers
 */
const SearchBar: React.FC<PropiedadesSearchBar> = ({ 
  alBuscar, 
  marcadorPosicion = "Search movies..." 
}) => {
  const [consulta, setConsulta] = useState("");

  /**
   * Handles search form submission.
   * Prevents default behavior and executes search if there's text.
   * 
   * @param {React.FormEvent} e - Form event
   */
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (consulta.trim()) {
      alBuscar(consulta.trim());
    }
  };

  /**
   * Handles changes in the search input.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
   */
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsulta(e.target.value);
  };

  return (
    <form 
      className="search-bar" 
      onSubmit={manejarEnvio}
      role="search"
      aria-label="Movie search"
    >
      <div className="search-bar__container">
        <svg 
          className="search-bar__icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        
        <input
          type="search"
          className="search-bar__input"
          placeholder={marcadorPosicion}
          value={consulta}
          onChange={manejarCambio}
          aria-label="Movie search field"
          autoComplete="off"
          spellCheck="false"
        />
        
        <button 
          type="submit" 
          className="search-bar__button"
          aria-label={consulta.trim() ? `Search for ${consulta}` : "Search movies"}
          disabled={!consulta.trim()}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;