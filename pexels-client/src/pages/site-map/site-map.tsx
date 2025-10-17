import React from "react";
import { Link } from "react-router";
import "./site-map.scss";

/**
 * Página de mapa del sitio que lista todas las rutas disponibles.
 * 
 * @component
 * @returns {JSX.Element} Lista estructurada de enlaces del sitio
 * 
 * @remarks
 * Útil para navegación y accesibilidad, listando todas las páginas disponibles.
 */
const SiteMapPage: React.FC = () => {
  return (
    <div className="sitemap-page">
      <div className="sitemap-page__content">
        <h1 className="sitemap-page__title">Mapa del Sitio</h1>
        
        <div className="sitemap-page__links">
          <div className="sitemap-page__section">
            <h2>Páginas Principales</h2>
            <ul>
              <li>
                <Link to="/">🏠 Inicio</Link>
                <p>Página principal de AirFilms</p>
              </li>
              <li>
                <Link to="/peliculas">🎬 Películas</Link>
                <p>Explora y busca videos por categoría</p>
              </li>
              <li>
                <Link to="/sobre-nosotros">👥 Sobre Nosotros</Link>
                <p>Conoce al equipo detrás de AirFilms</p>
              </li>
              <li>
                <Link to="/mapa-sitio">🗺️ Mapa del Sitio</Link>
                <p>Navegación completa del sitio web</p>
              </li>
            </ul>
          </div>

          <div className="sitemap-page__section">
            <h2>Funcionalidades</h2>
            <ul>
              <li>
                <span>🔍 Búsqueda de Videos</span>
                <p>Busca videos por término o categoría</p>
              </li>
              <li>
                <span>🎥 Reproducción de Videos</span>
                <p>Visualiza videos en alta calidad</p>
              </li>
              <li>
                <span>📂 Filtrado por Categorías</span>
                <p>Acción, Comedia, Drama, Ciencia Ficción, y más</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMapPage;