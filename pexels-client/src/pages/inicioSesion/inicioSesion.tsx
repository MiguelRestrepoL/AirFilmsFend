import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./inicioSesion.scss";

/**
 * Página de inicio de sesión.
 * Permite a los usuarios autenticarse en la plataforma.
 * 
 * @component
 * @returns {JSX.Element} Formulario de inicio de sesión
 */
const InicioSesion: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Realiza la petición al backend y maneja la respuesta.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica
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

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirigir a la página principal y forzar recarga
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
        {/* Lado Izquierdo - Branding */}
        <div className="inicio-sesion__branding">
          <div className="inicio-sesion__logo-container">
            <Link to="/">
            <img 
              src="/AirFilms.png" 
              alt="AirFilms Logo" 
              className="inicio-sesion__logo-img"
              
            />
            </Link>
          </div>
          <p className="inicio-sesion__branding-text">
            Vinimos a controlar el entretenimiento. <br />
            Tu plataforma de peliculas y videos favorita.
          </p>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="inicio-sesion__form-container">
          <div className="inicio-sesion__form-header">
            <h2 className="inicio-sesion__title">Iniciar sesión</h2>
            <p className="inicio-sesion__subtitle">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {error && (
            <div className="inicio-sesion__error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="inicio-sesion__form" onSubmit={handleSubmit}>
            <div className="inicio-sesion__form-group">
              <label htmlFor="email" className="inicio-sesion__label">
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
              />
            </div>

            <div className="inicio-sesion__form-group">
              <label htmlFor="password" className="inicio-sesion__label">
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
              />
            </div>

            <div className="inicio-sesion__forgot-password-container">
              <Link 
                to="/recuperar-password" 
                className="inicio-sesion__forgot-password"
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="inicio-sesion__submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="inicio-sesion__loading">
                  <div className="inicio-sesion__spinner"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="inicio-sesion__register-link">
            ¿No tiene cuenta? <Link to="/registro">¡Regístrese!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;