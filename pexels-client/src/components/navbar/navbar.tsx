import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";

/**
 * Global navigation bar component with authentication support.
 * 
 * Features:
 * - Responsive design with hamburger menu
 * - Authentication state management
 * - User profile dropdown
 * - Search bar (authenticated users)
 * - Full WCAG 2.1 AA compliance
 * - Keyboard navigation support
 * 
 * @component
 * @returns {JSX.Element} Semantic navigation element with links and actions
 */
const Navbar: React.FC = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const navigate = useNavigate();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Verifies user authentication on component mount
   * Checks for valid JWT token and fetches user profile
   */
  useEffect(() => {
    const verificarAutenticacion = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
          
          const response = await fetch(`${apiUrl}/auth/verify-auth`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              try {
                const profileResponse = await fetch(`${apiUrl}/users/profile`, {
                  headers: {
                    "Authorization": `Bearer ${token}`
                  }
                });

                if (profileResponse.ok) {
                  const profileData = await profileResponse.json();
                  if (profileData.success && profileData.user) {
                    setUsuario(profileData.user);
                    setEstaAutenticado(true);
                  } else {
                    setUsuario({ name: "Usuario", email: "" });
                    setEstaAutenticado(true);
                  }
                } else {
                  console.warn("Error al obtener perfil");
                  setUsuario({ name: "Usuario", email: "" });
                  setEstaAutenticado(true);
                }
              } catch (err) {
                console.error("Error al cargar perfil:", err);
                setUsuario({ name: "Usuario", email: "" });
                setEstaAutenticado(true);
              }
            } else {
              localStorage.removeItem("authToken");
              setEstaAutenticado(false);
            }
          } else {
            localStorage.removeItem("authToken");
            setEstaAutenticado(false);
          }
        } catch (error) {
          console.error("Error al verificar autenticación:", error);
          setUsuario({ name: "Usuario", email: "" });
          setEstaAutenticado(true);
        }
      } else {
        setEstaAutenticado(false);
      }
    };

    verificarAutenticacion();

    const handleStorageChange = () => {
      verificarAutenticacion();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Handles clicks outside dropdown to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setMenuPerfilAbierto(false);
      }
    };

    if (menuPerfilAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuPerfilAbierto]);

  /**
   * Handles ESC key to close dropdown
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuPerfilAbierto) {
        setMenuPerfilAbierto(false);
        avatarButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuPerfilAbierto]);

  /**
   * Toggles mobile menu visibility
   */
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  /**
   * Toggles profile dropdown menu
   */
  const toggleMenuPerfil = () => {
    setMenuPerfilAbierto(!menuPerfilAbierto);
  };

  /**
   * Handles user logout
   * Clears authentication token and redirects to home
   * 
   * @async
   */
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
        await fetch(`${apiUrl}/auth/logout`, {
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

    localStorage.removeItem("authToken");
    
    setEstaAutenticado(false);
    setUsuario(null);
    setMenuPerfilAbierto(false);
    
    window.location.href = "/";
  };

  // ============================================
  // AUTHENTICATED NAVBAR
  // ============================================
  if (estaAutenticado && usuario) {
    return (
      <nav 
        className="navbar navbar--authenticated"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="navbar__container">
          <Link 
            to="/" 
            className="navbar__logo" 
            onClick={() => setMenuAbierto(false)}
            aria-label="AirFilms - Ir a inicio"
          >
            <span className="navbar__logo-text">AirFilms</span>
          </Link>

          {/* Search Bar */}
          <div 
            className="navbar__search"
            role="search"
          >
            <svg 
              className="navbar__search-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="navbar__search-input"
              placeholder="Buscar películas..."
              onClick={() => navigate("/peliculas")}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  navigate("/peliculas");
                }
              }}
              readOnly
              aria-label="Buscar películas - Clic para ir a la página de películas"
            />
          </div>

          {/* Desktop Links */}
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
              aria-label="Ir a configuración de perfil"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6" />
              </svg>
            </button>

            {/* Avatar Dropdown */}
            <div className="navbar__profile-dropdown">
              <button
                ref={avatarButtonRef}
                className="navbar__avatar-btn"
                onClick={toggleMenuPerfil}
                aria-label={`Menú de perfil de ${usuario.name || "usuario"}`}
                aria-expanded={menuPerfilAbierto}
                aria-haspopup="true"
              >
                <div className="navbar__avatar">
                  <span aria-hidden="true">
                    {usuario.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </button>

              {menuPerfilAbierto && (
                <div 
                  ref={dropdownRef}
                  className="navbar__dropdown-menu"
                  role="menu"
                  aria-label="Opciones de perfil"
                >
                  <div className="navbar__dropdown-header">
                    <div 
                      className="navbar__avatar navbar__avatar--large"
                      aria-hidden="true"
                    >
                      <span>{usuario.name?.charAt(0).toUpperCase() || "U"}</span>
                    </div>
                    <p className="navbar__user-name">{usuario.name || "Usuario"}</p>
                    {usuario.email && (
                      <p className="navbar__user-email">{usuario.email}</p>
                    )}
                    <span 
                      className="navbar__badge"
                      role="status"
                    >
                      Próximamente...
                    </span>
                  </div>

                  <div 
                    className="navbar__dropdown-divider" 
                    role="separator"
                    aria-hidden="true"
                  ></div>

                  <Link 
                    to="/perfil" 
                    className="navbar__dropdown-item" 
                    onClick={toggleMenuPerfil}
                    role="menuitem"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
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
                    role="menuitem"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar__menu-toggle" 
            onClick={toggleMenu} 
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              aria-hidden="true"
              focusable="false"
            >
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
          <div 
            className="navbar__menu-movil"
            role="navigation"
            aria-label="Menú móvil"
          >
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
  // UNAUTHENTICATED NAVBAR
  // ============================================
  return (
    <nav 
      className="navbar"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="navbar__container">
        <Link 
          to="/" 
          className="navbar__logo" 
          onClick={() => setMenuAbierto(false)}
          aria-label="AirFilms - Ir a inicio"
        >
          <span className="navbar__logo-text">AirFilms</span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">Inicio</Link>
          <Link to="/peliculas" className="navbar__link">Películas</Link>
          <Link to="/sobre-nosotros" className="navbar__link">Sobre Nosotros</Link>
        </div>

        <div className="navbar__actions">
          <Link 
            to="/inicio-sesion" 
            className="navbar__button navbar__button--accent"
            aria-label="Ir a página de inicio de sesión"
          >
            Iniciar Sesión
          </Link>
          <Link 
            to="/registro" 
            className="navbar__button navbar__button--accent"
            aria-label="Ir a página de registro"
          >
            Registrarse
          </Link>
        </div>

        <button 
          className="navbar__menu-toggle" 
          onClick={toggleMenu} 
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuAbierto && (
        <div 
          className="navbar__menu-movil"
          role="navigation"
          aria-label="Menú móvil"
        >
          <div className="navbar__links-movil">
            <Link to="/" className="navbar__link-movil" onClick={toggleMenu}>Inicio</Link>
            <Link to="/peliculas" className="navbar__link-movil" onClick={toggleMenu}>Películas</Link>
            <Link to="/sobre-nosotros" className="navbar__link-movil" onClick={toggleMenu}>Sobre Nosotros</Link>
          </div>
          <div className="navbar__actions-movil">
            <Link 
              to="/inicio-sesion" 
              className="navbar__button navbar__button--accent" 
              onClick={toggleMenu}
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/registro" 
              className="navbar__button navbar__button--accent" 
              onClick={toggleMenu}
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;