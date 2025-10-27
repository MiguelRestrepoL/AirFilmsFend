import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./inicioSesion.scss";

/**
 * Login page component.
 * Allows users to authenticate on the platform.
 * 
 * Features:
 * - Email and password authentication
 * - Form validation with user feedback
 * - Loading states during submission
 * - Error handling and display
 * - Password recovery link
 * - Registration redirect
 * 
 * 
 * @component
 * @returns {JSX.Element} Login form with branding
 * 
 * @example
 * ```tsx
 * <InicioSesion />
 * ```
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Proper form semantics with fieldset/legend where appropriate
 */
const InicioSesion: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles login form submission.
   * Validates input, makes API request, and handles response.
   * 
   * @param {React.FormEvent} e - Form submission event
   * @async
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect to home and force reload
      window.location.href = "/";
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message || "Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inicio-sesion">
      <div className="inicio-sesion__container">
        {/* Left Side - Branding */}
        <aside 
          className="inicio-sesion__branding"
          aria-label="AirFilms branding"
        >
          <div className="inicio-sesion__logo-container">
            <Link 
              to="/"
              aria-label="Go to AirFilms homepage"
            >
              <img 
                src="/AirFilms.png" 
                alt="AirFilms - Your favorite movies and videos platform" 
                className="inicio-sesion__logo-img"
              />
            </Link>
          </div>
          <p className="inicio-sesion__branding-text">
            Vinimos a controlar el entretenimiento. <br />
            Tu plataforma de peliculas y videos favorita.
          </p>
        </aside>

        {/* Right Side - Form */}
        <main className="inicio-sesion__form-container">
          <header className="inicio-sesion__form-header">
            <h1 className="inicio-sesion__title">Iniciar sesión</h1>
            <p className="inicio-sesion__subtitle">
              Ingresa a tu cuenta para continuar
            </p>
          </header>

          {error && (
            <div 
              className="inicio-sesion__error"
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

          <form 
            className="inicio-sesion__form" 
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="login-title"
          >
            <div className="inicio-sesion__form-group">
              <label 
                htmlFor="email" 
                className="inicio-sesion__label"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="inicio-sesion__input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div className="inicio-sesion__form-group">
              <label 
                htmlFor="password" 
                className="inicio-sesion__label"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="inicio-sesion__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div className="inicio-sesion__forgot-password-container">
              <Link 
                to="/olvidar-pw1" 
                className="inicio-sesion__forgot-password"
                tabIndex={0}
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="inicio-sesion__submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
              aria-live="polite"
            >
              {isLoading ? (
                <span className="inicio-sesion__loading">
                  <span 
                    className="inicio-sesion__spinner"
                    role="status"
                    aria-label="Loading"
                    aria-hidden="true"
                  ></span>
                  <span>Iniciando sesión...</span>
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="inicio-sesion__register-link">
            ¿No tiene cuenta?{" "}
            <Link 
              to="/registro"
              aria-label="Go to registration page"
            >
              ¡Regístrese!
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default InicioSesion;