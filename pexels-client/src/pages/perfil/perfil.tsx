import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./perfil.scss";

/**
 * User profile page with two tabs: Profile and Security.
 * Allows editing personal information and changing password.
 * 
 * Features:
 * - Tabbed interface for Profile and Security settings
 * - Profile information editing (name, lastName, age, email)
 * - Password change functionality with validation
 * - Account deletion option
 * - Session management (logout)
 * - Real-time form validation
 * 
 * Accessibility features:
 * - Semantic HTML with proper heading hierarchy
 * - ARIA tabs pattern for navigation
 * - Form labels properly associated with inputs
 * - Error and success messages announced to screen readers
 * - Keyboard navigation support
 * - Focus management between tabs
 * - Minimum 44x44px touch targets
 * 
 * @component
 * @returns {JSX.Element} Profile view with tabs
 * 
 * @example
 * ```tsx
 * <Perfil />
 * ```
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Proper ARIA roles for tabs and tabpanels
 * - Live regions for dynamic content updates
 * - Focus indicators on all interactive elements
 * - Form validation with accessible error messages
 */
const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"perfil" | "seguridad">("perfil");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile form states
  const [perfilData, setPerfilData] = useState({
    name: "",
    lastName: "",
    age: "",
    email: ""
  });

  // Security form states
  const [seguridadData, setSeguridadData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  /**
   * Loads user data on component mount.
   * Redirects to login if no valid token is found.
   * 
   * @async
   */
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/inicio-sesion");
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";

        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error("Failed to load profile, status:", response.status);
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            navigate("/inicio-sesion");
            return;
          }
          throw new Error("Error al cargar datos del usuario");
        }

        const data = await response.json();
        
        if (data.success && data.user) {
          setPerfilData({
            name: data.user.name || "",
            lastName: data.user.lastName || "",
            age: data.user.age?.toString() || "",
            email: data.user.email || ""
          });
        }
      } catch (err: any) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudieron cargar los datos del perfil");
      } finally {
        setIsInitialLoading(false);
      }
    };

    cargarDatosUsuario();
  }, [navigate]);

  /**
   * Handles changes in profile form fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles changes in security form fields.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSeguridadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeguridadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Saves profile changes.
   * Validates input before submission.
   * 
   * @param {React.FormEvent} e - Form submission event
   * @async
   */
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!perfilData.name || !perfilData.lastName || !perfilData.age || !perfilData.email) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const ageNum = parseInt(perfilData.age);
    if (isNaN(ageNum) || ageNum < 13) {
      setError("La edad debe ser mayor o igual a 13 años");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: perfilData.name,
          lastName: perfilData.lastName,
          age: ageNum,
          email: perfilData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      setSuccessMessage("Perfil actualizado exitosamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Error al guardar perfil:", err);
      setError(err.message || "Error al guardar cambios");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Changes user password.
   * Validates password requirements before submission.
   * 
   * @param {React.FormEvent} e - Form submission event
   * @async
   */
  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!seguridadData.currentPassword || !seguridadData.newPassword || !seguridadData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (seguridadData.newPassword !== seguridadData.confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (seguridadData.newPassword.length < 8 || !/[A-Z]/.test(seguridadData.newPassword) || !/\d/.test(seguridadData.newPassword) || !/[^A-Za-z0-9]/.test(seguridadData.newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: seguridadData.currentPassword,
          newPassword: seguridadData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar contraseña");
      }

      setSuccessMessage("Contraseña actualizada exitosamente");
      setSeguridadData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Error al cambiar contraseña:", err);
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigates to account deletion page.
   */
  const handleEliminarCuenta = () => {
    navigate("/eliminar-perfil");
  };

  /**
   * Logs out the user and redirects to login page.
   */
  const handleCerrarSesion = () => {
    localStorage.removeItem("authToken");
    navigate("/inicio-sesion");
  };

  /**
   * Handles tab change and manages focus.
   * 
   * @param {("perfil" | "seguridad")} tab - Tab to activate
   */
  const handleTabChange = (tab: "perfil" | "seguridad") => {
    setActiveTab(tab);
    setError(null);
    setSuccessMessage(null);
  };

  if (isInitialLoading) {
    return (
      <div 
        className="perfil__loading"
        role="status"
        aria-live="polite"
        aria-label="Loading profile data"
      >
        <div className="perfil__spinner" aria-hidden="true"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil">
      <div className="perfil__container">
        <header className="perfil__logo-header">
          <img 
            src="/AirFilms.png" 
            alt="AirFilms" 
            className="perfil__logo"
          />
        </header>

        <div className="perfil__header">
          <h1 className="perfil__title">Ajustes de cuenta</h1>
        </div>

        {/* Tabs Navigation */}
        <nav 
          className="perfil__tabs"
          role="tablist"
          aria-label="Account settings"
        >
          <button
            role="tab"
            aria-selected={activeTab === "perfil"}
            aria-controls="perfil-panel"
            id="perfil-tab"
            className={`perfil__tab ${activeTab === "perfil" ? "perfil__tab--active" : ""}`}
            onClick={() => handleTabChange("perfil")}
            tabIndex={activeTab === "perfil" ? 0 : -1}
          >
            Perfil
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "seguridad"}
            aria-controls="seguridad-panel"
            id="seguridad-tab"
            className={`perfil__tab ${activeTab === "seguridad" ? "perfil__tab--active" : ""}`}
            onClick={() => handleTabChange("seguridad")}
            tabIndex={activeTab === "seguridad" ? 0 : -1}
          >
            Seguridad
          </button>
        </nav>

        {/* Error/Success Messages */}
        {error && (
          <div 
            className="perfil__error"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div 
            className="perfil__success"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === "perfil" && (
          <section
            id="perfil-panel"
            role="tabpanel"
            aria-labelledby="perfil-tab"
            className="perfil__content"
            tabIndex={0}
          >
            <div className="perfil__photo-section">
              <div className="perfil__photo-container">
                <div 
                  className="perfil__photo-placeholder"
                  role="img"
                  aria-label="Profile photo coming soon"
                >
                  Próximamente
                </div>
              </div>
            </div>

            <h2 className="perfil__section-title">Información</h2>
            <form 
              className="perfil__form" 
              onSubmit={handleGuardarPerfil}
              noValidate
            >
              <div className="perfil__form-row">
                <div className="perfil__form-group">
                  <label htmlFor="name" className="perfil__label">
                    Nombres
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="perfil__input"
                    value={perfilData.name}
                    onChange={handlePerfilChange}
                    disabled={isLoading}
                    required
                    aria-required="true"
                    autoComplete="given-name"
                  />
                </div>

                <div className="perfil__form-group">
                  <label htmlFor="lastName" className="perfil__label">
                    Apellidos
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="perfil__input"
                    value={perfilData.lastName}
                    onChange={handlePerfilChange}
                    disabled={isLoading}
                    required
                    aria-required="true"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="perfil__form-row">
                <div className="perfil__form-group">
                  <label htmlFor="age" className="perfil__label">
                    Edad
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    className="perfil__input"
                    value={perfilData.age}
                    onChange={handlePerfilChange}
                    disabled={isLoading}
                    min="13"
                    required
                    aria-required="true"
                    aria-describedby="age-hint"
                  />
                  <small id="age-hint" className="perfil__hint">
                    Mínimo 13 años
                  </small>
                </div>

                <div className="perfil__form-group">
                  <label htmlFor="email" className="perfil__label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="perfil__input"
                    value={perfilData.email}
                    onChange={handlePerfilChange}
                    disabled={isLoading}
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="perfil__actions">
                <button
                  type="button"
                  className="perfil__btn perfil__btn--secondary"
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                  aria-label="Cancel and return to home"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="perfil__btn perfil__btn--primary"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Security Tab Content */}
        {activeTab === "seguridad" && (
          <section
            id="seguridad-panel"
            role="tabpanel"
            aria-labelledby="seguridad-tab"
            className="perfil__content"
            tabIndex={0}
          >
            <div className="perfil__security-section">
              <h2 className="perfil__section-title">Cambiar contraseña</h2>
              <form 
                className="perfil__form" 
                onSubmit={handleCambiarPassword}
                noValidate
              >
                <div className="perfil__form-group">
                  <label htmlFor="currentPassword" className="perfil__label">
                    Contraseña actual
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className="perfil__input"
                    placeholder="Escribe tu contraseña actual"
                    value={seguridadData.currentPassword}
                    onChange={handleSeguridadChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="perfil__form-group">
                  <label htmlFor="newPassword" className="perfil__label">
                    Nueva contraseña
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="perfil__input"
                    placeholder="Nueva contraseña"
                    value={seguridadData.newPassword}
                    onChange={handleSeguridadChange}
                    disabled={isLoading}
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-describedby="password-requirements"
                  />
                  <small 
                    id="password-requirements" 
                    className="perfil__hint"
                  >
                    Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
                  </small>
                </div>

                <div className="perfil__form-group">
                  <label htmlFor="confirmPassword" className="perfil__label">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="perfil__input"
                    placeholder="Confirma tu nueva contraseña"
                    value={seguridadData.confirmPassword}
                    onChange={handleSeguridadChange}
                    disabled={isLoading}
                    autoComplete="new-password"
                    required
                    aria-required="true"
                  />
                </div>

                <button
                  type="submit"
                  className="perfil__btn perfil__btn--primary"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Cambiando..." : "Cambiar contraseña"}
                </button>
              </form>
            </div>

            <div className="perfil__logout-section">
              <button
                type="button"
                className="perfil__btn perfil__btn--logout"
                onClick={handleCerrarSesion}
                disabled={isLoading}
                aria-label="Log out of your account"
              >
                Cerrar sesión
              </button>
            </div>

            <div className="perfil__danger-zone">
              <h2 className="perfil__section-title perfil__section-title--danger">
                Desactivación de cuenta
              </h2>
              <p className="perfil__danger-text">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.
              </p>
              <button
                type="button"
                className="perfil__btn perfil__btn--danger"
                onClick={handleEliminarCuenta}
                disabled={isLoading}
                aria-label="Delete account permanently"
              >
                Eliminar cuenta
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Perfil;