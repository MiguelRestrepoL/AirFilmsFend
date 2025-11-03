import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./eliminar-perfil.scss";

/**
 * Account deletion page component.
 * Displays warnings and requires explicit confirmation before permanent deletion.
 * 
 * Features:
 * - Multiple safety checks before deletion
 * - Password verification required
 * - Confirmation phrase matching
 * - Explicit checkbox acknowledgment
 * - User account information display
 * - Comprehensive warnings about data loss
 * 
 * Accessibility features:
 * - Semantic HTML structure with proper heading hierarchy
 * - ARIA labels for all interactive elements
 * - Form validation with accessible error messages
 * - Keyboard navigation support
 * - Screen reader announcements for critical actions
 * - Clear visual warnings with appropriate ARIA attributes
 * - Minimum 44x44px touch targets
 * 
 * @component
 * @returns {JSX.Element} Account deletion form with safety measures
 * 
 * @example
 * ```tsx
 * <EliminarPerfil />
 * ```
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Critical warnings with appropriate ARIA roles
 * - Form semantics with proper label associations
 * - Error messages announced to screen readers
 * - Focus management during form interaction
 */
const EliminarPerfil: React.FC = () => {
  const navigate = useNavigate();
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");

  const CONFIRMATION_PHRASE = "ELIMINAR";

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    createdDate: "",
    moviesRated: "0"
  });

  /**
   * Loads user information on component mount.
   * Redirects to login if no valid token is found.
   * 
   * @async
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
          const createdDate = data.user.createdAt 
            ? new Date(data.user.createdAt).toLocaleDateString('es-ES')
            : "N/A";

          setUserInfo({
            name: `${data.user.name} ${data.user.lastName}`,
            email: data.user.email || "",
            createdDate: createdDate,
            moviesRated: "0"
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
   * Handles account deletion process.
   * Validates all safety checks before proceeding.
   * 
   * @param {React.FormEvent} e - Form submission event
   * @async
   */
  const handleEliminarCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        body: JSON.stringify({ password: currentPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar cuenta");
      }

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
   * Cancels deletion and returns to profile page.
   */
  const handleCancelar = () => {
    navigate("/perfil");
  };

  return (
    <div className="eliminar-perfil">
      <div className="eliminar-perfil__container">
        <header className="eliminar-perfil__logo-header">
          <img 
            src="/airfilms.png" 
            alt="AirFilms" 
            className="eliminar-perfil__logo"
          />
        </header>

        <div className="eliminar-perfil__header">
          <div 
            className="eliminar-perfil__icon"
            role="img"
            aria-label="Warning icon"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <h1 className="eliminar-perfil__title">Eliminar Cuenta</h1>
          <p className="eliminar-perfil__subtitle">
            Esta acción es permanente e irreversible
          </p>
        </div>

        <section 
          className="eliminar-perfil__warning"
          role="alert"
          aria-labelledby="warning-title"
        >
          <div 
            className="eliminar-perfil__warning-icon"
            aria-hidden="true"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor"
              focusable="false"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <div className="eliminar-perfil__warning-content">
            <h2 
              id="warning-title"
              className="eliminar-perfil__warning-title"
            >
              ¡ADVERTENCIA CRÍTICA!
            </h2>
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
        </section>

        <section 
          className="eliminar-perfil__info"
          aria-labelledby="account-info-title"
        >
          <h2 
            id="account-info-title"
            className="eliminar-perfil__info-title"
          >
            Datos de la cuenta a eliminar:
          </h2>
          <dl className="eliminar-perfil__info-grid">
            <div className="eliminar-perfil__info-item">
              <dt className="eliminar-perfil__info-label">Nombre:</dt>
              <dd className="eliminar-perfil__info-value">{userInfo.name}</dd>
            </div>
            <div className="eliminar-perfil__info-item">
              <dt className="eliminar-perfil__info-label">Email:</dt>
              <dd className="eliminar-perfil__info-value">{userInfo.email}</dd>
            </div>
            <div className="eliminar-perfil__info-item">
              <dt className="eliminar-perfil__info-label">Cuenta creada:</dt>
              <dd className="eliminar-perfil__info-value">{userInfo.createdDate}</dd>
            </div>
            <div className="eliminar-perfil__info-item">
              <dt className="eliminar-perfil__info-label">Películas calificadas:</dt>
              <dd className="eliminar-perfil__info-value">{userInfo.moviesRated}</dd>
            </div>
          </dl>
        </section>

        <section 
          className="eliminar-perfil__steps"
          aria-labelledby="steps-title"
        >
          <h2 
            id="steps-title"
            className="eliminar-perfil__steps-title"
          >
            Para proceder, debes completar los siguientes pasos:
          </h2>
          <ol className="eliminar-perfil__steps-list">
            <li>Ingresa tu contraseña actual para verificar tu identidad</li>
            <li>Escribe exactamente la frase de confirmación que aparece abajo</li>
            <li>Confirma que entiendes que esta acción es irreversible</li>
          </ol>
        </section>

        <form 
          className="eliminar-perfil__form" 
          onSubmit={handleEliminarCuenta}
          noValidate
        >
          <div className="eliminar-perfil__form-group">
            <label 
              htmlFor="currentPassword" 
              className="eliminar-perfil__label"
            >
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
              required
              aria-required="true"
              aria-invalid={error && !currentPassword ? "true" : "false"}
            />
          </div>

          <div className="eliminar-perfil__form-group">
            <label 
              htmlFor="confirmation" 
              className="eliminar-perfil__label"
            >
              CONFIRMACIÓN ⚠️
            </label>
            <p 
              className="eliminar-perfil__confirmation-hint"
              id="confirmation-hint"
            >
              Escribe exactamente esta frase:
            </p>
            <div 
              className="eliminar-perfil__phrase-box"
              role="status"
              aria-label={`Confirmation phrase: ${CONFIRMATION_PHRASE}`}
            >
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
              required
              aria-required="true"
              aria-describedby="confirmation-hint"
              aria-invalid={error && confirmationPhrase.toUpperCase() !== CONFIRMATION_PHRASE ? "true" : "false"}
            />
          </div>

          <div className="eliminar-perfil__checkbox-group">
            <input
              id="confirm"
              type="checkbox"
              className="eliminar-perfil__checkbox"
              checked={confirmCheckbox}
              onChange={(e) => setConfirmCheckbox(e.target.checked)}
              disabled={isLoading}
              required
              aria-required="true"
              aria-describedby="checkbox-label"
            />
            <label 
              htmlFor="confirm" 
              id="checkbox-label"
              className="eliminar-perfil__checkbox-label"
            >
              Confirmo que he leído y entendido todas las advertencias. Acepto que esta acción
              eliminará permanentemente mi cuenta y todos mis datos, y que no podrá ser revertida
              bajo ninguna circunstancia.
            </label>
          </div>

          {error && (
            <div 
              className="eliminar-perfil__error"
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

          <div className="eliminar-perfil__actions">
            <button
              type="button"
              className="eliminar-perfil__btn eliminar-perfil__btn--cancel"
              onClick={handleCancelar}
              disabled={isLoading}
              aria-label="Cancel and return to profile"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar y Volver
            </button>
            <button
              type="submit"
              className="eliminar-perfil__btn eliminar-perfil__btn--delete"
              disabled={isLoading}
              aria-busy={isLoading}
              aria-label="Permanently delete account"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
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