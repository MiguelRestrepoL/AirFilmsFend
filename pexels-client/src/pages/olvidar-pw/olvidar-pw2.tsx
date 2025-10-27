import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./olvidar-pw2.scss";

/**
 * @fileoverview Password reset page - Step 2
 * Validates the reset token and allows users to set a new password.
 * 
 * WCAG 2.1 AA Compliance Features:
 * - Semantic HTML structure with proper heading hierarchy
 * - ARIA live regions for status updates and validation states
 * - Keyboard navigation fully supported (including Escape key)
 * - Focus management for error messages and dynamic content
 * - Form validation with accessible error messages
 * - Proper labeling of all form controls with hints
 * - Loading states announced to screen readers
 * - Success/error messages with appropriate ARIA attributes
 * - Icon decorations marked as aria-hidden
 * - Sufficient color contrast (4.5:1 for text, 3:1 for UI)
 * - Touch targets meet 44x44px minimum size
 * - Auto-focus management for better UX
 * - Visible focus indicators on all interactive elements
 */

/**
 * Form data interface for password reset
 * @interface FormData
 * @property {string} password - New password value
 * @property {string} confirmPassword - Password confirmation value
 */
interface FormData {
  password: string;
  confirmPassword: string;
}

/**
 * OlvidarPw2 Component
 * 
 * Password reset form that validates a token and allows users to set a new password.
 * Implements comprehensive WCAG 2.1 AA standards for accessibility.
 * 
 * @component
 * @example
 * // Basic usage in a route configuration
 * <Route path="/reset-password" element={<OlvidarPw2 />} />
 * 
 * @returns {JSX.Element} The password reset interface with validation
 * 
 * @accessibility
 * - Screen reader announcements for all state changes
 * - Keyboard-only navigation supported (including Escape to dismiss)
 * - Focus management during loading and error states
 * - Live regions for dynamic content updates (polite and assertive)
 * - Password requirements communicated via aria-describedby
 * - Countdown timers announced to assistive technologies
 * @security
 * - Password validation enforced (8+ chars, uppercase, lowercase, number, special char)
 * - Token validation before allowing password reset
 * - Secure password input with autocomplete attributes
 */
const OlvidarPw2: React.FC = () => {
  // ============================================
  // HOOKS & REFS
  // ============================================
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  /**
   * Ref for error message container to manage focus
   * @type {React.RefObject<HTMLDivElement>}
   */
  const errorRef = useRef<HTMLDivElement>(null);

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  /**
   * Form data containing password and confirmation
   * @type {FormData}
   */
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: ""
  });
  
  /**
   * Error message to display (null if no error)
   * @type {string | null}
   */
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Loading state during password reset request
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  /**
   * Loading state during token validation
   * @type {boolean}
   */
  const [isValidating, setIsValidating] = useState<boolean>(true);
  
  /**
   * Token validity state
   * @type {boolean}
   */
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  
  /**
   * Countdown for invalid token redirect (in seconds)
   * @type {number}
   */
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);
  
  /**
   * Success state indicator
   * @type {boolean}
   */
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  /**
   * Countdown for success redirect (in seconds)
   * @type {number}
   */
  const [successCountdown, setSuccessCountdown] = useState<number>(3);

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Effect: Validates the reset token when component mounts
   * 
   * @sideeffects
   * - Updates tokenValid state based on validation
   * - Updates isValidating state when complete
   * - Sets focus to error message if token is invalid
   * 
   * @async
   */
  useEffect(() => {
    const validateToken = async (): Promise<void> => {
      if (!token) {
        setTokenValid(false);
        setIsValidating(false);
        return;
      }

      try {
        // Simulate token validation (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTokenValid(true);
      } catch (err) {
        console.error("Token validation error:", err);
        setTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  /**
   * Effect: Manages countdown timer for invalid token redirect
   * 
   * @sideeffects
   * - Decrements redirectCountdown every second
   * - Navigates to forgot password page when countdown reaches 0
   * - Cleans up interval on unmount
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
   * Effect: Manages countdown timer for success redirect
   * 
   * @sideeffects
   * - Decrements successCountdown every second
   * - Navigates to login page when countdown reaches 0
   * - Cleans up interval on unmount
   */
  useEffect(() => {
    if (showSuccess) {
      const timer = setInterval(() => {
        setSuccessCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/inicio-sesion");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showSuccess, navigate]);

  /**
   * Effect: Manages focus for error messages
   * Moves focus to error container when error appears for screen reader announcement
   */
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handles input changes in the form
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   * @returns {void}
   * 
   * @sideeffects
   * - Updates formData state with new input value
   * - Clears error message when user starts typing
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error on input
    if (error) setError(null);
  };

  /**
   * Validates password against security requirements
   * 
   * @param {string} password - Password to validate
   * @returns {boolean} True if password meets all requirements
   * 
   * @requirements
   * - Minimum 8 characters
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 number
   * - At least 1 special character (@$!%*?&)
   */
  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password)
    );
  };

  /**
   * Handles form submission for password reset
   * 
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>}
   * 
   * @throws {Error} When API request fails
   * 
   * @fires API POST request to /auth/reset-password
   * 
   * @sideeffects
   * - Updates error state on validation failure
   * - Updates showSuccess state on successful reset
   * - Updates loading state during API call
   * - Logs errors to console
   * - Navigates to login page after success countdown
   * 
   * @validation
   * - Checks for empty fields
   * - Validates password strength requirements
   * - Confirms password match
   * 
   * @example
   * // Form submission triggers this handler
   * <form onSubmit={handleSubmit}>...</form>
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    // Validation: Empty fields
    if (!formData.password || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validation: Password strength
    if (!validatePassword(formData.password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)"
      );
      return;
    }

    // Validation: Password match
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

      // Show success state
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "Error al restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard events for accessibility
   * Allows users to dismiss messages with Escape key
   * 
   * @param {React.KeyboardEvent} e - Keyboard event
   * @returns {void}
   * 
   * @keyboardSupport
   * - Escape: Dismisses success message or error
   */
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape' && (showSuccess || error)) {
      setShowSuccess(false);
      setError(null);
    }
  };

  // ============================================
  // RENDER: VALIDATING STATE
  // ============================================

  if (isValidating) {
    return (
      <div className="olvidar-pw2">
        <main className="olvidar-pw2__card" role="main" aria-live="polite">
          <div className="olvidar-pw2__logo-container">
            <Link to="/" aria-label="Volver a la página principal de AirFilms">
              <img 
                src="/AirFilms.png" 
                alt="AirFilms - Logo de la plataforma de streaming" 
                className="olvidar-pw2__logo-img"
              />
            </Link>
          </div>
          <div className="olvidar-pw2__validating" role="status" aria-live="polite">
            <div 
              className="olvidar-pw2__spinner" 
              aria-label="Validando enlace de recuperación"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
            <p>Validando enlace...</p>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: INVALID TOKEN STATE
  // ============================================

  if (!tokenValid) {
    return (
      <div className="olvidar-pw2">
        <main className="olvidar-pw2__card" role="main">
          <div className="olvidar-pw2__logo-container">
            <Link to="/" aria-label="Volver a la página principal de AirFilms">
              <img 
                src="/AirFilms.png" 
                alt="AirFilms - Logo de la plataforma de streaming" 
                className="olvidar-pw2__logo-img"
              />
            </Link>
          </div>

          <div className="olvidar-pw2__icon-container olvidar-pw2__icon-container--error" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>

          <div className="olvidar-pw2__error-card" role="alert" aria-live="assertive" aria-atomic="true">
            <h1 className="olvidar-pw2__error-title">Enlace inválido o expirado</h1>
            <p className="olvidar-pw2__error-text">
              El enlace de recuperación es inválido o ha expirado. 
              Por favor, solicita un nuevo enlace.
            </p>

            <Link 
              to="/olvidar-pw1" 
              className="olvidar-pw2__action-btn"
              aria-label="Solicitar un nuevo enlace de recuperación de contraseña"
            >
              Solicitar nuevo enlace
            </Link>

            <p className="olvidar-pw2__redirect-text" role="timer" aria-live="polite" aria-atomic="true">
              Redirigiendo en <strong>{redirectCountdown}</strong> segundo{redirectCountdown !== 1 ? 's' : ''}...
            </p>
          </div>

          <nav className="olvidar-pw2__links" aria-label="Enlaces de navegación">
            <Link 
              to="/inicio-sesion" 
              className="olvidar-pw2__link"
              aria-label="Ir a la página de inicio de sesión"
            >
              Iniciar sesión
            </Link>
            <Link 
              to="/olvidar-pw1" 
              className="olvidar-pw2__link"
              aria-label="Ir a recuperación de contraseña"
            >
              Recuperar contraseña
            </Link>
          </nav>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: SUCCESS STATE
  // ============================================

  if (showSuccess) {
    return (
      <div className="olvidar-pw2">
        <main className="olvidar-pw2__card" role="main">
          <div className="olvidar-pw2__logo-container">
            <Link to="/" aria-label="Volver a la página principal de AirFilms">
              <img 
                src="/AirFilms.png" 
                alt="AirFilms - Logo de la plataforma de streaming" 
                className="olvidar-pw2__logo-img"
              />
            </Link>
          </div>

          <div className="olvidar-pw2__icon-container olvidar-pw2__icon-container--success" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>

          <div className="olvidar-pw2__success-card" role="status" aria-live="polite" aria-atomic="true">
            <h1 className="olvidar-pw2__success-title">¡Contraseña restablecida exitosamente!</h1>
            <p className="olvidar-pw2__success-text">
              Tu contraseña ha sido actualizada correctamente. 
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <div className="olvidar-pw2__success-info" role="status" aria-live="polite">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p>
                <span className="sr-only">Nota:</span> Redirigiendo a inicio de sesión en <strong>{successCountdown}</strong> segundo{successCountdown !== 1 ? 's' : ''}...
              </p>
            </div>

            <Link 
              to="/inicio-sesion" 
              className="olvidar-pw2__action-btn olvidar-pw2__action-btn--success"
              aria-label="Ir a iniciar sesión ahora"
            >
              Iniciar sesión ahora
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // RENDER: PASSWORD RESET FORM
  // ============================================

  return (
    <div className="olvidar-pw2" onKeyDown={handleKeyDown}>
      <main className="olvidar-pw2__card" role="main">
        <div className="olvidar-pw2__logo-container">
          <Link to="/" aria-label="Volver a la página principal de AirFilms">
            <img 
              src="/AirFilms.png" 
              alt="AirFilms - Logo de la plataforma de streaming" 
              className="olvidar-pw2__logo-img"
            />
          </Link>
        </div>

        <div className="olvidar-pw2__icon-container" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>

        <header className="olvidar-pw2__header">
          <h1 className="olvidar-pw2__title">Restablecer contraseña</h1>
          <p className="olvidar-pw2__subtitle">
            Ingresa tu nueva contraseña para completar el proceso
          </p>
        </header>

        {/* Error Message - ARIA Live Region */}
        {error && (
          <div 
            ref={errorRef}
            className="olvidar-pw2__error" 
            role="alert" 
            aria-live="assertive"
            aria-atomic="true"
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Password Reset Form */}
        <form 
          className="olvidar-pw2__form" 
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de restablecimiento de contraseña"
        >
          {/* New Password Field */}
          <div className="olvidar-pw2__form-group">
            <label htmlFor="password" className="olvidar-pw2__label">
              Nueva contraseña
            </label>
            <div className="olvidar-pw2__input-wrapper">
              <svg 
                className="olvidar-pw2__input-icon" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                aria-hidden="true"
              >
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
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby="password-hint password-error"
              />
            </div>
            <small id="password-hint" className="olvidar-pw2__hint">
              Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (@$!%*?&)
            </small>
            {/* Hidden error for screen readers */}
            {error && (
              <span id="password-error" className="sr-only">
                {error}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="olvidar-pw2__form-group">
            <label htmlFor="confirmPassword" className="olvidar-pw2__label">
              Confirmar contraseña
            </label>
            <div className="olvidar-pw2__input-wrapper">
              <svg 
                className="olvidar-pw2__input-icon" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                aria-hidden="true"
              >
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
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby="confirm-hint"
              />
            </div>
            <span id="confirm-hint" className="sr-only">
              Vuelve a ingresar la misma contraseña para confirmar
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="olvidar-pw2__submit-btn"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-live="polite"
          >
            {isLoading ? (
              <span className="olvidar-pw2__loading">
                <span 
                  className="olvidar-pw2__spinner" 
                  role="status"
                  aria-label="Restableciendo contraseña, por favor espera"
                ></span>
                <span>Restableciendo...</span>
              </span>
            ) : (
              <>
                <span>Restablecer contraseña</span>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="olvidar-pw2__links" aria-label="Enlaces de navegación">
          <Link 
            to="/inicio-sesion" 
            className="olvidar-pw2__link"
            aria-label="Ir a la página de inicio de sesión"
          >
            Iniciar sesión
          </Link>
          <Link 
            to="/olvidar-pw1" 
            className="olvidar-pw2__link"
            aria-label="Solicitar nuevo enlace de recuperación"
          >
            Recuperar contraseña
          </Link>
        </nav>
      </main>
    </div>
  );
};

export default OlvidarPw2;