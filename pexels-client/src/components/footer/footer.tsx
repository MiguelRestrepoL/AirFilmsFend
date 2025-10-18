import React from "react";
import { Link } from "react-router";
import "./footer.scss";

/**
 * Pie de página de la aplicación con enlaces secundarios y redes sociales.
 * 
 * @component
 * @returns {JSX.Element} Footer con navegación secundaria y logo
 */
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Sección Mapa del Sitio */}
        <div className="footer__section">
          <h3 className="footer__title">Mapa del sitio</h3>
          <div className="footer__links">
            <Link to="/" className="footer__link">Inicio</Link>
            <Link to="/peliculas" className="footer__link">Películas</Link>
            <Link to="/sobre-nosotros" className="footer__link">Sobre Nosotros</Link>
            <Link to="/perfil" className="footer__link">Mi Perfil</Link>
            <Link to="/mapa-sitio" className="footer__link">Mapa del Sitio</Link>
          </div>
        </div>

        {/* Sección Menú */}
        <div className="footer__section">
          <h3 className="footer__title">Menú</h3>
          <div className="footer__links">
            <a href="#" className="footer__link">Acción</a>
            <a href="#" className="footer__link">Animación</a>
            <a href="#" className="footer__link">Anime</a>
            <a href="#" className="footer__link">Aventura</a>
            <a href="#" className="footer__link">Ciencia Ficción</a>
            <a href="#" className="footer__link">Comedia</a>
          </div>
        </div>

        {/* Sección Síguenos */}
        <div className="footer__section">
          <h3 className="footer__title">Síguenos</h3>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Sección Logo - AirFilms */}
        <div className="footer__section footer__section--logo">
          <div className="footer__logo">
            <span className="footer__logo-text">AirFilms</span>
          </div>
          <img src="/public/AirFilms.png" alt="Logo de AirFilms" className="footer__logo-image" />
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; 2025 AirFilms. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;