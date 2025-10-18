import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAutenticacion } from "../../services/AutenticacionS";
import "./NavbarAutenticado.scss";

/**
 * Barra de navegación para usuarios autenticados.
 * Muestra foto de perfil (próximamente) y acceso a configuración.
 * 
 * @component
 * @returns {JSX.Element} Navbar personalizado para usuarios con sesión
 */
const NavbarAutenticado: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const { usuario, cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const toggleMenuPerfil = () => {
    setMenuPerfilAbierto(!menuPerfilAbierto);
  };

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="navbar-auth">
      <div className="navbar-auth__container">
        <Link to="/" className="navbar-auth__logo" onClick={() => setMenuAbierto(false)}>
          <span className="navbar-auth__logo-text">AirFilms</span>
        </Link>
        
        {/* Search Bar - Centro */}
        <div className="navbar-auth__search">
          <svg 
            className="navbar-auth__search-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="navbar-auth__search-input"
            placeholder="Buscar películas..."
            onClick={() => navigate("/peliculas")}
            readOnly
          />
        </div>

        {/* Links Desktop */}
        <div className="navbar-auth__links">
          <Link to="/" className="navbar-auth__link">
            Inicio
          </Link>
          <Link to="/peliculas" className="navbar-auth__link">
            Películas
          </Link>
          <Link to="/sobre-nosotros" className="navbar-auth__link">
            Sobre Nosotros
          </Link>
        </div>

        {/* User Actions - Derecha */}
        <div className="navbar-auth__user-section">
          {/* Botón Settings */}
          <button
            className="navbar-auth__settings-btn"
            onClick={() => navigate("/perfil")}
            aria-label="Configuración de perfil"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m5.2-14.2l-4.2 4.2m-6 6l-4.2 4.2m14.4-4.2l-4.2-4.2m-6-6l-4.2-4.2" />
              <path d="M12 1v6m0 6v6" />
            </svg>
          </button>

          {/* Avatar con Dropdown */}
          <div className="navbar-auth__profile-dropdown">
            <button
              className="navbar-auth__avatar-btn"
              onClick={toggleMenuPerfil}
              aria-label="Menú de perfil"
              aria-expanded={menuPerfilAbierto}
            >
              <div className="navbar-auth__avatar">
                <span className="navbar-auth__avatar-text">
                  {usuario?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {menuPerfilAbierto && (
              <div className="navbar-auth__dropdown-menu">
                <div className="navbar-auth__dropdown-header">
                  <div className="navbar-auth__avatar navbar-auth__avatar--large">
                    <span className="navbar-auth__avatar-text">
                      {usuario?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="navbar-auth__user-info">
                    <p className="navbar-auth__user-name">
                      {usuario?.name} {usuario?.lastName}
                    </p>
                    <p className="navbar-auth__user-email">{usuario?.email}</p>
                  </div>
                  <span className="navbar-auth__badge">Próximamente...</span>
                </div>

                <div className="navbar-auth__dropdown-divider"></div>

                <Link 
                  to="/perfil" 
                  className="navbar-auth__dropdown-item"
                  onClick={toggleMenuPerfil}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mi Perfil</span>
                </Link>

                <button 
                  className="navbar-auth__dropdown-item navbar-auth__dropdown-item--danger"
                  onClick={() => {
                    toggleMenuPerfil();
                    handleLogout();
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className="navbar-auth__menu-toggle"
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
        <div className="navbar-auth__menu-movil">
          <div className="navbar-auth__links-movil">
            <Link to="/" className="navbar-auth__link-movil" onClick={toggleMenu}>
              Inicio
            </Link>
            <Link to="/peliculas" className="navbar-auth__link-movil" onClick={toggleMenu}>
              Películas
            </Link>
            <Link to="/sobre-nosotros" className="navbar-auth__link-movil" onClick={toggleMenu}>
              Sobre Nosotros
            </Link>
          </div>

          <div className="navbar-auth__actions-movil">
            <Link 
              to="/perfil" 
              className="navbar-auth__button navbar-auth__button--primary"
              onClick={toggleMenu}
            >
              Mi Perfil
            </Link>
            <button 
              className="navbar-auth__button navbar-auth__button--danger"
              onClick={() => {
                toggleMenu();
                handleLogout();
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAutenticado;