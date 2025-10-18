import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./perfil.scss";

/**
 * Página de perfil de usuario con dos pestañas: Perfil y Seguridad.
 * Permite editar información personal y cambiar contraseña.
 * 
 * @component
 * @returns {JSX.Element} Vista de perfil con pestañas
 */
const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"perfil" | "seguridad">("perfil");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para el formulario de perfil
  const [perfilData, setPerfilData] = useState({
    name: "",
    lastName: "",
    age: "",
    email: ""
  });

  // Estados para el formulario de seguridad
  const [seguridadData, setSeguridadData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  /**
   * Carga los datos del usuario al montar el componente
   */
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
        const token = localStorage.getItem("authToken");

        if (!token) {
          navigate("/inicio-sesion");
          return;
        }

        const response = await fetch(`${apiUrl}/user/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
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
      }
    };

    cargarDatosUsuario();
  }, [navigate]);

  /**
   * Maneja cambios en los campos del perfil
   */
  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja cambios en los campos de seguridad
   */
  const handleSeguridadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSeguridadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Guarda los cambios del perfil
   */
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validaciones
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

      const response = await fetch(`${apiUrl}/user/profile`, {
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
   * Cambia la contraseña
   */
  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validaciones
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

      const response = await fetch(`${apiUrl}/user/profile`, {
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
   * Navega a la página de eliminar perfil
   */
  const handleEliminarCuenta = () => {
    navigate("/eliminar-perfil");
  };

  /**
   * Cierra la sesión del usuario
   */
  const handleCerrarSesion = () => {
    localStorage.removeItem("authToken");
    navigate("/inicio-sesion");
  };

  return (
    <div className="perfil">
      <div className="perfil__container">
        {/* Logo */}
        <div className="perfil__logo-header">
          <img src="/AirFilms.png" alt="AirFilms Logo" className="perfil__logo" />
        </div>

        <div className="perfil__header">
          <h1 className="perfil__title">Ajustes de cuenta</h1>
        </div>

        {/* Pestañas */}
        <div className="perfil__tabs">
          <button
            className={`perfil__tab ${activeTab === "perfil" ? "perfil__tab--active" : ""}`}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </button>
          <button
            className={`perfil__tab ${activeTab === "seguridad" ? "perfil__tab--active" : ""}`}
            onClick={() => setActiveTab("seguridad")}
          >
            Seguridad
          </button>
        </div>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="perfil__error">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="perfil__success">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Contenido de Perfil */}
        {activeTab === "perfil" && (
          <div className="perfil__content">
            {/* Foto de perfil - Solo en pestaña Perfil */}
            <div className="perfil__photo-section">
              <div className="perfil__photo-container">
                <div className="perfil__photo-placeholder">
                  Próximamente
                </div>
              </div>
            </div>

            <h2 className="perfil__section-title">Información</h2>
            <form className="perfil__form" onSubmit={handleGuardarPerfil}>
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
                  />
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
                  />
                </div>
              </div>

              <div className="perfil__actions">
                <button
                  type="button"
                  className="perfil__btn perfil__btn--secondary"
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="perfil__btn perfil__btn--primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contenido de Seguridad */}
        {activeTab === "seguridad" && (
          <div className="perfil__content">
            <div className="perfil__security-section">
              <h2 className="perfil__section-title">Cambiar contraseña</h2>
              <form className="perfil__form" onSubmit={handleCambiarPassword}>
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
                  />
                  <small className="perfil__hint">
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
                  />
                </div>

                <button
                  type="submit"
                  className="perfil__btn perfil__btn--primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Cambiando..." : "Cambiar contraseña"}
                </button>
              </form>
            </div>

            {/* Botón de Cerrar Sesión */}
            <div className="perfil__logout-section">
              <button
                type="button"
                className="perfil__btn perfil__btn--logout"
                onClick={handleCerrarSesion}
                disabled={isLoading}
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
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;