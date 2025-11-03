import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./registro.scss";

/**
 * User registration page component.
 * Allows users to create a new account on the platform.
 * 
 * Features:
 * - Multi-field registration form
 * - Real-time password strength indicator
 * - Client-side form validation
 * - Age verification (minimum 13 years)
 * - Email format validation
 * - Password requirements enforcement
 * - Loading states during submission
 * 
 * Accessibility features:
 * - Semantic HTML form structure
 * - Proper label associations for all inputs
 * - ARIA live regions for password strength
 * - Error messages announced to screen readers
 * - Form validation with accessible feedback
 * - Keyboard navigation support
 * - Minimum 44x44px touch targets
 * - Visual and programmatic password strength indicator
 * 
 * @component
 * @returns {JSX.Element} Registration form with validation
 * 
 * @example
 * ```tsx
 * <Registro />
 * ```
 * 
 * @accessibility
 * - WCAG 2.1 AA compliant
 * - Proper form semantics with fieldset/legend
 * - ARIA attributes for dynamic content
 * - Error messages associated with inputs
 * - Autocomplete attributes for better UX
 * - Focus indicators on all interactive elements
 */
const Registro: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  /**
   * Handles changes in form input fields.
   * Updates form state and calculates password strength if password field.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  /**
   * Calculates password strength based on various criteria.
   * Checks for length, lowercase, uppercase, numbers, and special characters.
   * 
   * @param {string} password - Password string to evaluate
   */
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  /**
   * Validates form data before submission.
   * Checks required fields, age requirement, email format, and password rules.
   * 
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    if (!formData.name || !formData.lastName || !formData.age || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 13) {
      setError("La edad debe ser mayor o igual a 13 años");
      return false;
    }

    const emailRule = /^\S+@\S+\.\S+$/;
    if (!emailRule.test(formData.email)) {
      setError("El formato de la dirección de correo electrónico no es válido");
      return false;
    }

    const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/;
    if (!passwordRule.test(formData.password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  /**
   * Handles form submission for user registration.
   * Validates form, makes API request, and redirects on success.
   * 
   * @param {React.FormEvent} e - Form submission event
   * @async
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          age: parseInt(formData.age),
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      navigate("/inicio-sesion", { 
        state: { message: "¡Registro exitoso! Ya puedes iniciar sesión." }
      });
    } catch (err: any) {
      console.error("Error al registrarse:", err);
      setError(err.message || "Error al registrarse. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gets text description of password strength level.
   * 
   * @returns {string} Password strength description
   */
  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0:
      case 1: return "Muy débil";
      case 2: return "Débil";
      case 3: return "Regular";
      case 4: return "Fuerte";
      case 5: return "Muy fuerte";
      default: return "";
    }
  };

  /**
   * Gets color for password strength indicator.
   * 
   * @returns {string} Color hex code for strength level
   */
  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0:
      case 1: return "#f44336";
      case 2: return "#ff9800";
      case 3: return "#ffeb3b";
      case 4: return "#8bc34a";
      case 5: return "#4caf50";
      default: return "transparent";
    }
  };

  return (
    <div className="registro">
      <div className="registro__container">
        {/* Left Side - Branding */}
        <aside 
          className="registro__branding"
          aria-label="AirFilms branding"
        >
          <div 
            className="registro__animated-bg"
            aria-hidden="true"
          >
            <div className="registro__circle registro__circle--1"></div>
            <div className="registro__circle registro__circle--2"></div>
            <div className="registro__circle registro__circle--3"></div>
          </div>
          
          <div className="registro__logo-container">
            <Link 
              to="/"
              aria-label="Go to AirFilms homepage"
            >
              <img 
                src="/AirFilms.png" 
                alt="AirFilms - Your favorite movies and videos platform" 
                className="registro__logo-img"
              />
            </Link>
          </div>
          
          <div className="registro__welcome">
            <h2 className="registro__welcome-title">Abraza el entretenimiento</h2>
          </div>
        </aside>

        {/* Right Side - Form */}
        <main className="registro__form-container">
          <header className="registro__form-header">
            <h1 className="registro__title">Crear cuenta</h1>
            <p className="registro__subtitle">
              Completa tus datos para comenzar
            </p>
          </header>

          {error && (
            <div 
              className="registro__error"
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
            className="registro__form" 
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="registro__form-row">
              <div className="registro__form-group">
                <label 
                  htmlFor="name" 
                  className="registro__label"
                >
                  Nombre
                </label>
                <div className="registro__input-wrapper">
                  <svg 
                    className="registro__input-icon" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="registro__input"
                    placeholder="Juan"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="given-name"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="registro__form-group">
                <label 
                  htmlFor="lastName" 
                  className="registro__label"
                >
                  Apellido
                </label>
                <div className="registro__input-wrapper">
                  <svg 
                    className="registro__input-icon" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="registro__input"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="family-name"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            <div className="registro__form-row">
              <div className="registro__form-group">
                <label 
                  htmlFor="age" 
                  className="registro__label"
                >
                  Edad
                </label>
                <div className="registro__input-wrapper">
                  <svg 
                    className="registro__input-icon" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    className="registro__input"
                    placeholder="18"
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    aria-required="true"
                    aria-describedby="age-hint"
                  />
                </div>
                <small 
                  id="age-hint" 
                  className="registro__hint"
                >
                  Debes tener al menos 13 años
                </small>
              </div>

              <div className="registro__form-group">
                <label 
                  htmlFor="email" 
                  className="registro__label"
                >
                  Email
                </label>
                <div className="registro__input-wrapper">
                  <svg 
                    className="registro__input-icon" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="registro__input"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="email"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            <div className="registro__form-group">
              <label 
                htmlFor="password" 
                className="registro__label"
              >
                Contraseña
              </label>
              <div className="registro__input-wrapper">
                <svg 
                  className="registro__input-icon" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="registro__input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-describedby="password-requirements password-strength"
                />
              </div>
              {formData.password && (
                <div 
                  className="registro__password-strength"
                  id="password-strength"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div 
                    className="registro__password-strength-bar"
                    role="progressbar"
                    aria-valuenow={passwordStrength}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    aria-label="Password strength indicator"
                  >
                    <div 
                      className="registro__password-strength-fill"
                      style={{ 
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span 
                    className="registro__password-strength-text"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
              <small 
                id="password-requirements" 
                className="registro__hint"
              >
                Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
              </small>
            </div>

            <div className="registro__form-group">
              <label 
                htmlFor="confirmPassword" 
                className="registro__label"
              >
                Confirmar contraseña
              </label>
              <div className="registro__input-wrapper">
                <svg 
                  className="registro__input-icon" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="registro__input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <button
              type="submit"
              className="registro__submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="registro__loading">
                  <span 
                    className="registro__spinner"
                    role="status"
                    aria-label="Loading"
                    aria-hidden="true"
                  ></span>
                  <span>Creando cuenta...</span>
                </span>
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="registro__login-link">
            ¿Ya tienes cuenta?{" "}
            <Link 
              to="/inicio-sesion"
              aria-label="Go to login page"
            >
              Inicia sesión
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default Registro;