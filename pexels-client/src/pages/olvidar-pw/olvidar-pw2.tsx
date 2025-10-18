import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./olvidar-pw2.scss";

/**
 * Página para restablecer contraseña - Paso 2.
 * Valida el token y permite al usuario ingresar una nueva contraseña.
 * 
 * @component
 * @returns {JSX.Element} Formulario de restablecimiento de contraseña
 */
const OlvidarPw2: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  /**
   * Valida el token al cargar el componente
   */
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setIsValidating(false);
        return;
      }

      try {
        // Simular validación del token
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  /**
   * Countdown y redirección automática si el token es inválido
   */
  useEffect(() => {
    if (!isValidating && !tokenValid) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/olvidar-pw1");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isValidating, tokenValid, navigate]);

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.password || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validación según el backend: mínimo 8, mayúscula, minúscula, número, carácter especial
    if (formData.password.length < 8 || 
        !/[A-Z]/.test(formData.password) || 
        !/[a-z]/.test(formData.password) ||
        !/\d/.test(formData.password) || 
        !/[@$!%*?&]/.test(formData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña");
      }

      // CORREGIDO: /inicio-sesion en lugar de /login
      navigate("/inicio-sesion", {
        state: { message: "¡Contraseña restablecida exitosamente! Ya puedes iniciar sesión." }
      });
    } catch (err: any) {
      console.error("Error al restablecer contraseña:", err);
      setError(err.message || "Error al restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras valida el token
  if (isValidating) {
    return (
      <div className="olvidar-pw2">
        <div className="olvidar-pw2__card">
          <div className="olvidar-pw2__logo-container">
            <img 
              src="/AirFilms.png" 
              alt="AirFilms Logo" 
              className="olvidar-pw2__logo-img"
            />
          </div>
          <div className="olvidar-pw2__validating">
            <div className="olvidar-pw2__spinner"></div>
            <p>Validando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si el token es inválido
  if (!tokenValid) {
    return (
      <div className="olvidar-pw2">
        <div className="olvidar-pw2__card">
          <div className="olvidar-pw2__logo-container">
            <img 
              src="/AirFilms.png" 
              alt="AirFilms Logo" 
              className="olvidar-pw2__logo-img"
            />
          </div>

          <div className="olvidar-pw2__icon-container olvidar-pw2__icon-container--error">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>

          <div className="olvidar-pw2__error-card">
            <h2 className="olvidar-pw2__error-title">Acceso denegado</h2>
            <p className="olvidar-pw2__error-text">
              El enlace de recuperación es inválido o ha expirado. 
              Por favor, solicita un nuevo enlace.
            </p>

            <Link to="/olvidar-pw1" className="olvidar-pw2__action-btn">
              Solicitar nuevo enlace
            </Link>

            <p className="olvidar-pw2__redirect-text">
              Redirigiendo en <strong>{redirectCountdown}</strong> segundos...
            </p>
          </div>

          <div className="olvidar-pw2__links">
            <Link to="/inicio-sesion" className="olvidar-pw2__link">
              Iniciar sesión
            </Link>
            <Link to="/olvidar-pw1" className="olvidar-pw2__link">
              Recuperar contraseña
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de restablecimiento
  return (
    <div className="olvidar-pw2">
      <div className="olvidar-pw2__card">
        <div className="olvidar-pw2__logo-container">
          <img 
            src="/AirFilms.png" 
            alt="AirFilms Logo" 
            className="olvidar-pw2__logo-img"
          />
        </div>

        <div className="olvidar-pw2__icon-container">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>

        <div className="olvidar-pw2__header">
          <h2 className="olvidar-pw2__title">Restablecer contraseña</h2>
          <p className="olvidar-pw2__subtitle">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {error && (
          <div className="olvidar-pw2__error">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="olvidar-pw2__form" onSubmit={handleSubmit}>
          <div className="olvidar-pw2__form-group">
            <label htmlFor="password" className="olvidar-pw2__label">
              Nueva contraseña
            </label>
            <div className="olvidar-pw2__input-wrapper">
              <svg className="olvidar-pw2__input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                className="olvidar-pw2__input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
            <small className="olvidar-pw2__hint">
              Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (@$!%*?&)
            </small>
          </div>

          <div className="olvidar-pw2__form-group">
            <label htmlFor="confirmPassword" className="olvidar-pw2__label">
              Confirmar contraseña
            </label>
            <div className="olvidar-pw2__input-wrapper">
              <svg className="olvidar-pw2__input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="olvidar-pw2__input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="olvidar-pw2__submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="olvidar-pw2__loading">
                <div className="olvidar-pw2__spinner"></div>
                <span>Restableciendo...</span>
              </div>
            ) : (
              <>
                <span>Restablecer contraseña</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="olvidar-pw2__links">
          <Link to="/inicio-sesion" className="olvidar-pw2__link">
            Iniciar sesión
          </Link>
          <Link to="/olvidar-pw1" className="olvidar-pw2__link">
            Recuperar contraseña
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OlvidarPw2;