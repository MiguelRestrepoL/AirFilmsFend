import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import "./navbar.scss";

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
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const navigate = useNavigate();

  // Verificar si hay token al cargar
  useEffect(() => {
    const token = localStorage.getItem("airfilms_token");
    const userStr = localStorage.getItem("airfilms_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsuario(user);
        setEstaAutenticado(true);
      } catch {
        // Si hay error parseando, limpiar
        localStorage.removeItem("airfilms_token");
        localStorage.removeItem("airfilms_user");
      }
    }
  }, []);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const toggleMenuPerfil = () => {
    setMenuPerfilAbierto(!menuPerfilAbierto);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("airfilms_token");

    // Intentar logout en el backend
    if (token) {
      try {
        await fetch("https://airfilms-server.onrender.com/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }

    // Limpiar localStorage
    localStorage.removeItem("airfilms_token");
    localStorage.removeItem("airfilms_user");
    
    setEstaAutenticado(false);
    setUsuario(null);
    navigate("/");
    window.location.reload(); // Forzar recarga para actualizar todo
  };

  // ============================================
  // NAVBAR AUTENTICADO
  // ============================================
  if (estaAutenticado && usuario) {
    return (
      <nav className="navbar navbar--authenticated">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo" onClick={() => setMenuAbierto(false)}>
            <span className="navbar__logo-text">AirFilms</span>
          </Link>

          {/* Search Bar */}
          <div className="navbar__search">
            <svg className="navbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="navbar__search-input"
              placeholder="Buscar películas..."
              onClick={() => navigate("/peliculas")}
              readOnly
            />
          </div>

          {/* Links Desktop */}
          <div className="navbar__links">
            <Link to="/" className="navbar__link">Inicio</Link>
            <Link to="/peliculas" className="navbar__link">Películas</Link>
            <Link to="/sobre-nosotros" className="navbar__link">Sobre Nosotros</Link>
          </div>

          {/* User Actions */}
          <div className="navbar__user-section">
            {/* Settings Button */}
            <button
              className="navbar__settings-btn"
              onClick={() => navigate("/perfil")}
              aria-label="Configuración"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6" />
              </svg>
            </button>

            {/* Avatar Dropdown */}
            <div className="navbar__profile-dropdown">
              <button
                className="navbar__avatar-btn"
                onClick={toggleMenuPerfil}
                aria-label="Menú de perfil"
              >
                <div className="navbar__avatar">
                  <span>{usuario.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
              </button>

              {menuPerfilAbierto && (
                <div className="navbar__dropdown-menu">
                  <div className="navbar__dropdown-header">
                    <div className="navbar__avatar navbar__avatar--large">
                      <span>{usuario.name?.charAt(0).toUpperCase() || "U"}</span>
                    </div>
                    <p className="navbar__user-name">{usuario.name} {usuario.lastName}</p>
                    <p className="navbar__user-email">{usuario.email}</p>
                    <span className="navbar__badge">Próximamente...</span>
                  </div>

                  <div className="navbar__dropdown-divider"></div>

                  <Link to="/perfil" className="navbar__dropdown-item" onClick={toggleMenuPerfil}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>

                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
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

          {/* Mobile Menu Toggle */}
          <button className="navbar__menu-toggle" onClick={toggleMenu} aria-label="Menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuAbierto && (
          <div className="navbar__menu-movil">
            <div className="navbar__links-movil">
              <Link to="/" className="navbar__link-movil" onClick={toggleMenu}>Inicio</Link>
              <Link to="/peliculas" className="navbar__link-movil" onClick={toggleMenu}>Películas</Link>
              <Link to="/sobre-nosotros" className="navbar__link-movil" onClick={toggleMenu}>Sobre Nosotros</Link>
            </div>
            <div className="navbar__actions-movil">
              <Link to="/perfil" className="navbar__button navbar__button--primary" onClick={toggleMenu}>
                Mi Perfil
              </Link>
              <button className="navbar__button navbar__button--danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // ============================================
  // NAVBAR NO AUTENTICADO
  // ============================================
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={() => setMenuAbierto(false)}>
          <span className="navbar__logo-text">AirFilms</span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">Inicio</Link>
          <Link to="/peliculas" className="navbar__link">Películas</Link>
          <Link to="/sobre-nosotros" className="navbar__link">Sobre Nosotros</Link>
        </div>

        <div className="navbar__actions">
          <Link to="/inicio-sesion" className="navbar__button navbar__button--primary">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="navbar__button navbar__button--accent">
            Registrarse
          </Link>
        </div>

        <button className="navbar__menu-toggle" onClick={toggleMenu} aria-label="Menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuAbierto && (
        <div className="navbar__menu-movil">
          <div className="navbar__links-movil">
            <Link to="/" className="navbar__link-movil" onClick={toggleMenu}>Inicio</Link>
            <Link to="/peliculas" className="navbar__link-movil" onClick={toggleMenu}>Películas</Link>
            <Link to="/sobre-nosotros" className="navbar__link-movil" onClick={toggleMenu}>Sobre Nosotros</Link>
          </div>
          <div className="navbar__actions-movil">
            <Link to="/inicio-sesion" className="navbar__button navbar__button--primary" onClick={toggleMenu}>
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="navbar__button navbar__button--accent" onClick={toggleMenu}>
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;