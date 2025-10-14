import React from "react";
import { useNavigate } from "react-router";
import HeroBanner from "../../components/hero-banner/hero-banner";
import "./home.scss";

/**
 * Página de inicio (landing) de la aplicación.
 * Muestra el banner hero y un botón para navegar a las películas.
 * 
 * @component
 * @returns {JSX.Element} Vista de inicio con llamado a la acción
 * 
 * @example
 * // Renderiza el banner principal y botón de exploración
 * <HomePage />
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <HeroBanner />
      
      <div className="home-page__content">
        <h2 className="home-page__subtitle">Bienvenido a AirFilms</h2>
        <p className="home-page__description">
          Descubre una increíble colección de videos y películas de todo el mundo.
          Explora categorías, busca tus favoritos y disfruta del mejor contenido.
        </p>
        
        <button 
          className="home-page__cta"
          onClick={() => navigate("/peliculas")}
        >
          Explorar Películas
        </button>
      </div>
    </div>
  );
};

export default HomePage;