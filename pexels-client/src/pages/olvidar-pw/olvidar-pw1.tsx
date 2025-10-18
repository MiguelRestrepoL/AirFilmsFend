import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./olvidar-pw1.scss";

/**
 * Página para solicitar recuperación de contraseña - Paso 1.
 * Permite al usuario ingresar su email para recibir un enlace de recuperación.
 * 
 * @component
 * @returns {JSX.Element} Formulario de recuperación de contraseña
 */
const OlvidarPw1: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja el envío del formulario de recuperación de contraseña.
   * Envía el email al backend para recibir el enlace de recuperación.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación básica
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar el correo de recuperación");
      }

      setSuccess(true);
      setEmail(""); // Limpiar el campo
    } catch (err: any) {
      console.error("Error al solicitar recuperación:", err);
      setError(err.message || "Error al enviar el correo. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="olvidar-pw1">
      <div className="olvidar-pw1__container">
        {/* Lado Izquierdo - Branding */}
        <div className="olvidar-pw1__branding">
          <div className="olvidar-pw1__logo-container">
            <Link to="/">
              <img 
                src="/AirFilms.png" 
                alt="AirFilms Logo" 
                className="olvidar-pw1__logo-img"
              />
            </Link>
          </div>
          <p className="olvidar-pw1__branding-text">
            Con AirFilms no te preocuparás de nada. 
            En breve tendrás acceso nuevamente a tu cuenta.
          </p>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="olvidar-pw1__form-container">
          <div className="olvidar-pw1__form-header">
            <div className="olvidar-pw1__icon-container">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
              </svg>
            </div>
            <h2 className="olvidar-pw1__title">¿Olvidaste tu contraseña?</h2>
            <p className="olvidar-pw1__subtitle">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {error && (
            <div className="olvidar-pw1__error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="olvidar-pw1__success">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <strong>¡Correo enviado!</strong>
                <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
              </div>
            </div>
          )}

          <form className="olvidar-pw1__form" onSubmit={handleSubmit}>
            <div className="olvidar-pw1__form-group">
              <label htmlFor="email" className="olvidar-pw1__label">
                Email
              </label>
              <div className="olvidar-pw1__input-wrapper">
                <svg className="olvidar-pw1__input-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  className="olvidar-pw1__input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="olvidar-pw1__submit-btn"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <div className="olvidar-pw1__loading">
                  <div className="olvidar-pw1__spinner"></div>
                  <span>Enviando...</span>
                </div>
              ) : success ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Correo enviado</span>
                </>
              ) : (
                <>
                  <span>Enviar enlace de recuperación</span>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="olvidar-pw1__back-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <Link to="/inicio-sesion">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OlvidarPw1;