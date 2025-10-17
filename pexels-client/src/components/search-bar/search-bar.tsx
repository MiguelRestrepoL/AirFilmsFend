import React, { useState } from "react";
import "./search-bar.scss";

/**
 * Propiedades para el componente SearchBar.
 */
interface PropiedadesSearchBar {
  alBuscar: (consulta: string) => void;
  marcadorPosicion?: string;
}

/**
 * Barra de búsqueda para consultas de videos.
 * Permite al usuario escribir un término de búsqueda y enviarlo.
 * 
 * @component
 * @param {PropiedadesSearchBar} props - Propiedades del componente
 * @returns {JSX.Element} Input de búsqueda con funcionalidad de envío
 * 
 * @example
 * <SearchBar 
 *   alBuscar={(consulta) => console.log(consulta)} 
 *   marcadorPosicion="Buscar películas..."
 * />
 */
const SearchBar: React.FC<PropiedadesSearchBar> = ({ 
  alBuscar, 
  marcadorPosicion = "Buscar películas..." 
}) => {
  const [consulta, setConsulta] = useState("");

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (consulta.trim()) {
      alBuscar(consulta.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={manejarEnvio}>
      <div className="search-bar__container">
        <svg 
          className="search-bar__icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-bar__input"
          placeholder={marcadorPosicion}
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          aria-label="Buscar películas"
        />
        <button 
          type="submit" 
          className="search-bar__button"
          aria-label="Buscar"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;