import React, { useState } from "react";
import { Link } from "react-router";
import "./Navbar.scss";

/**
 * Barra de navegación global con enlaces a las rutas principales.
 * Incluye menú hamburguesa para dispositivos móviles.
 * 
 * @component
 * @returns {JSX.Element} Elemento de navegación semántico con enlaces
 * @remarks
 * - Enlaces a Inicio, Películas, Sobre Nosotros
 * - Botones para Contacto, Iniciar Sesión, Registrarse
 * - Menú responsive que se adapta a pantallas pequeñas
 */

const Navbar: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={() => setMenuAbierto(false)}>
          <span className="navbar__logo-text">AirFilms</span>
        </Link>
        
        {/* Links Desktop */}
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

        {/* Botones Desktop */}
        <div className="navbar__actions">
          <Link to="/inicio-sesion" className="navbar__button navbar__button--primary">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="navbar__button navbar__button--accent">
            Registrarse
          </Link>
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className="navbar__menu-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menú de navegación"
          aria-expanded={menuAbierto}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="navbar__menu-movil">
          <div className="navbar__links-movil">
            <Link to="/" className="navbar__link-movil" onClick={toggleMenu}>
              Inicio
            </Link>
            <Link to="/peliculas" className="navbar__link-movil" onClick={toggleMenu}>
              Películas
            </Link>
            <Link to="/sobre-nosotros" className="navbar__link-movil" onClick={toggleMenu}>
              Sobre Nosotros
            </Link>
          </div>

          <div className="navbar__actions-movil">
            <button className="navbar__button navbar__button--secondary" onClick={toggleMenu}>
              Contacto
            </button>
            <button className="navbar__button navbar__button--primary" onClick={toggleMenu}>
              Iniciar Sesión
            </button>
            <button className="navbar__button navbar__button--accent" onClick={toggleMenu}>
              Registrarse
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;