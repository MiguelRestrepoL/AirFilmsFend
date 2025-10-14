import React from "react";
import { Link } from "react-router";
import "./navbar.scss";

/**
 * Barra de navegación global con enlaces a las rutas principales.
 * 
 * @component
 * @returns {JSX.Element} Elemento de navegación semántico con enlaces
 * 
 * @accessibility
 * Usa <nav> semántico y <Link> para navegación con teclado y lectores de pantalla.
 */
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">AirFilms</span>
        </Link>
        
        <div className="navbar__links">
          <Link to="/" className="navbar__link">
            Inicio
          </Link>
          <Link to="/peliculas" className="navbar__link">
            Películas
          </Link>
          <Link to="/sobre-nosotros" className="navbar__link">
            Sobre Nosotros
          </Link>
        </div>

        <div className="navbar__actions">
          <button className="navbar__button navbar__button--secondary">
            Contacto
          </button>
          <button className="navbar__button navbar__button--primary">
            Iniciar Sesión
          </button>
          <button className="navbar__button navbar__button--accent">
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;