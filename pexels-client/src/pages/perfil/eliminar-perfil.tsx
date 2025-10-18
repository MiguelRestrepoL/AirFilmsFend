import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./eliminar-perfil.scss";

/**
 * Página para eliminar cuenta de usuario de forma permanente.
 * Muestra advertencias y requiere confirmación explícita.
 * 
 * @component
 * @returns {JSX.Element} Formulario de eliminación de cuenta
 */
const EliminarPerfil: React.FC = () => {
  const navigate = useNavigate();
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState(""); // ✅ AGREGADO

  const CONFIRMATION_PHRASE = "ELIMINAR";

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    createdDate: "",
    moviesRated: "0"
  });

  /**
   * Carga la información del usuario al montar el componente
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

        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al cargar datos del usuario");
        }

        const data = await response.json();
        
        if (data.success && data.user) {
          // Formatear fecha de creación
          const createdDate = data.user.createdAt 
            ? new Date(data.user.createdAt).toLocaleDateString('es-ES')
            : "N/A";

          setUserInfo({
            name: `${data.user.name} ${data.user.lastName}`,
            email: data.user.email || "",
            createdDate: createdDate,
            moviesRated: "0" // Placeholder hasta que tengas este dato en el backend
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
   * Maneja la eliminación de la cuenta
   */
  const handleEliminarCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!currentPassword) {
      setError("Debes ingresar tu contraseña actual");
      return;
    }

    if (confirmationPhrase.toUpperCase() !== CONFIRMATION_PHRASE) {
      setError(`Debes escribir exactamente "${CONFIRMATION_PHRASE}" para confirmar`);
      return;
    }

    if (!confirmCheckbox) {
      setError("Debes confirmar que entiendes que esta acción es irreversible");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ password: currentPassword }) // ✅ AGREGADO para enviar contraseña
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar cuenta");
      }

      // Limpiar localStorage y redirigir
      localStorage.removeItem("authToken");
      navigate("/inicio-sesion");
    } catch (err: any) {
      console.error("Error al eliminar cuenta:", err);
      setError(err.message || "Error al eliminar cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancela y regresa al perfil
   */
  const handleCancelar = () => {
    navigate("/perfil");
  };

  return (
    <div className="eliminar-perfil">
      <div className="eliminar-perfil__container">
        {/* Logo */}
        <div className="eliminar-perfil__logo-header">
          <img src="/airfilms.png" alt="AirFilms Logo" className="eliminar-perfil__logo" />
        </div>

        {/* Header con icono de advertencia */}
        <div className="eliminar-perfil__header">
          <div className="eliminar-perfil__icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <h1 className="eliminar-perfil__title">Eliminar Cuenta</h1>
          <p className="eliminar-perfil__subtitle">
            Esta acción es permanente e irreversible
          </p>
        </div>

        {/* Advertencia crítica */}
        <div className="eliminar-perfil__warning">
          <div className="eliminar-perfil__warning-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <div className="eliminar-perfil__warning-content">
            <h3 className="eliminar-perfil__warning-title">¡ADVERTENCIA CRÍTICA!</h3>
            <p className="eliminar-perfil__warning-text">
              Estás a punto de eliminar permanentemente tu cuenta de AirFilms. Esta acción:
            </p>
            <ul className="eliminar-perfil__warning-list">
              <li>Eliminará todo tu progreso en videos y películas</li>
              <li>Borrará todas tus calificaciones y reseñas</li>
              <li>Eliminará tu lista de favoritos y watchlist</li>
              <li>No se puede deshacer bajo ninguna circunstancia</li>
              <li>Requerirá crear una nueva cuenta si deseas volver</li>
            </ul>
          </div>
        </div>

        {/* Información de la cuenta */}
        <div className="eliminar-perfil__info">
          <h3 className="eliminar-perfil__info-title">Datos de la cuenta a eliminar:</h3>
          <div className="eliminar-perfil__info-grid">
            <div className="eliminar-perfil__info-item">
              <span className="eliminar-perfil__info-label">Nombre:</span>
              <span className="eliminar-perfil__info-value">{userInfo.name}</span>
            </div>
            <div className="eliminar-perfil__info-item">
              <span className="eliminar-perfil__info-label">Email:</span>
              <span className="eliminar-perfil__info-value">{userInfo.email}</span>
            </div>
            <div className="eliminar-perfil__info-item">
              <span className="eliminar-perfil__info-label">Cuenta creada:</span>
              <span className="eliminar-perfil__info-value">{userInfo.createdDate}</span>
            </div>
            <div className="eliminar-perfil__info-item">
              <span className="eliminar-perfil__info-label">Películas calificadas:</span>
              <span className="eliminar-perfil__info-value">{userInfo.moviesRated}</span>
            </div>
          </div>
        </div>

        {/* Pasos para proceder */}
        <div className="eliminar-perfil__steps">
          <h3 className="eliminar-perfil__steps-title">
            Para proceder, debes completar los siguientes pasos:
          </h3>
          <ol className="eliminar-perfil__steps-list">
            <li>Ingresa tu contraseña actual para verificar tu identidad</li>
            <li>Escribe exactamente la frase de confirmación que aparece abajo</li>
            <li>Confirma que entiendes que esta acción es irreversible</li>
          </ol>
        </div>

        {/* Formulario */}
        <form className="eliminar-perfil__form" onSubmit={handleEliminarCuenta}>
          {/* Contraseña actual */}
          <div className="eliminar-perfil__form-group">
            <label htmlFor="currentPassword" className="eliminar-perfil__label">
              CONTRASEÑA ACTUAL 🔒
            </label>
            <input
              id="currentPassword"
              type="password"
              className="eliminar-perfil__input"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Frase de confirmación */}
          <div className="eliminar-perfil__form-group">
            <label htmlFor="confirmation" className="eliminar-perfil__label">
              CONFIRMACIÓN ⚠️
            </label>
            <p className="eliminar-perfil__confirmation-hint">
              Escribe exactamente esta frase:
            </p>
            <div className="eliminar-perfil__phrase-box">
              {CONFIRMATION_PHRASE}
            </div>
            <input
              id="confirmation"
              type="text"
              className="eliminar-perfil__input"
              placeholder="Escribe la frase exacta aquí"
              value={confirmationPhrase}
              onChange={(e) => setConfirmationPhrase(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Checkbox de confirmación */}
          <div className="eliminar-perfil__checkbox-group">
            <input
              id="confirm"
              type="checkbox"
              className="eliminar-perfil__checkbox"
              checked={confirmCheckbox}
              onChange={(e) => setConfirmCheckbox(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="confirm" className="eliminar-perfil__checkbox-label">
              Confirmo que he leído y entendido todas las advertencias. Acepto que esta acción
              eliminará permanentemente mi cuenta y todos mis datos, y que no podrá ser revertida
              bajo ninguna circunstancia.
            </label>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="eliminar-perfil__error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Botones */}
          <div className="eliminar-perfil__actions">
            <button
              type="button"
              className="eliminar-perfil__btn eliminar-perfil__btn--cancel"
              onClick={handleCancelar}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar y Volver
            </button>
            <button
              type="submit"
              className="eliminar-perfil__btn eliminar-perfil__btn--delete"
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
              {isLoading ? "Eliminando..." : "ELIMINAR CUENTA PERMANENTEMENTE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EliminarPerfil;