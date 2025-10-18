import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./registro.scss";

/**
 * Página de registro de usuarios.
 * Permite crear una nueva cuenta en la plataforma.
 * 
 * @component
 * @returns {JSX.Element} Formulario de registro
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
   * Maneja los cambios en los campos del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calcular fuerza de contraseña
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  /**
   * Calcula la fuerza de la contraseña
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
   * Valida el formulario antes de enviarlo
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
   * Maneja el envío del formulario de registro
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
        {/* Lado Izquierdo - Branding Animado */}
        <div className="registro__branding">
          <div className="registro__animated-bg">
            <div className="registro__circle registro__circle--1"></div>
            <div className="registro__circle registro__circle--2"></div>
            <div className="registro__circle registro__circle--3"></div>
          </div>
          
            <div className="registro__logo-container">
           <Link to="/">
             <img 
               src="/AirFilms.png" 
               alt="AirFilms Logo" 
               className="registro__logo-img"
             />
           </Link>
           </div>
          
          <div className="registro__welcome">
            <h2 className="registro__welcome-title">Abraza el entretenimiento</h2>
            {/* Abraza el entretenimiento es referencia a HK por Embrace the Void finale. mb soy friki */}
          </div>
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="registro__form-container">
          <div className="registro__form-header">
            <h2 className="registro__title">Crear cuenta</h2>
            <p className="registro__subtitle">
              Completa tus datos para comenzar
            </p>
          </div>

          {error && (
            <div className="registro__error">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="registro__form" onSubmit={handleSubmit}>
            <div className="registro__form-row">
              <div className="registro__form-group">
                <label htmlFor="name" className="registro__label">
                  Nombre
                </label>
                <div className="registro__input-wrapper">
                  <svg className="registro__input-icon" viewBox="0 0 24 24" fill="currentColor">
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
                  />
                </div>
              </div>

              <div className="registro__form-group">
                <label htmlFor="lastName" className="registro__label">
                  Apellido
                </label>
                <div className="registro__input-wrapper">
                  <svg className="registro__input-icon" viewBox="0 0 24 24" fill="currentColor">
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
                  />
                </div>
              </div>
            </div>

            <div className="registro__form-row">
              <div className="registro__form-group">
                <label htmlFor="age" className="registro__label">
                  Edad
                </label>
                <div className="registro__input-wrapper">
                  <svg className="registro__input-icon" viewBox="0 0 24 24" fill="currentColor">
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
                  />
                </div>
              </div>

              <div className="registro__form-group">
                <label htmlFor="email" className="registro__label">
                  Email
                </label>
                <div className="registro__input-wrapper">
                  <svg className="registro__input-icon" viewBox="0 0 24 24" fill="currentColor">
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
                  />
                </div>
              </div>
            </div>

            <div className="registro__form-group">
              <label htmlFor="password" className="registro__label">
                Contraseña
              </label>
              <div className="registro__input-wrapper">
                <svg className="registro__input-icon" viewBox="0 0 24 24" fill="currentColor">
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
                />
              </div>
              {formData.password && (
                <div className="registro__password-strength">
                  <div className="registro__password-strength-bar">
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
              <small className="registro__hint">
                Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
              </small>
            </div>

            <div className="registro__form-group">
              <label htmlFor="confirmPassword" className="registro__label">
                Confirmar contraseña
              </label>
              <div className="registro__input-wrapper">
                <svg className="registro__input-icon" viewBox="0 0 24 24" fill="currentColor">
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="registro__submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="registro__loading">
                  <div className="registro__spinner"></div>
                  <span>Creando cuenta...</span>
                </div>
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="registro__login-link">
            ¿Ya tienes cuenta? <Link to="/inicio-sesion">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;