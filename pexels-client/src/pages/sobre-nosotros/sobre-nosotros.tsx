import React, { useEffect, useState } from 'react';
import "./sobre-nosotros.scss";

/**
 * Página "Sobre Nosotros" que describe el equipo de AirFilms.
 * Inspirada en el diseño de CheckNote con animaciones y efectos modernos.
 * 
 * @component
 * @returns {JSX.Element} Página completa del equipo con misión, visión y valores
 */
const AboutPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  /**
   * Actualiza la barra de progreso según el scroll.
   * Heurística #1: Visibilidad del estado del sistema.
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Miembros del equipo AirFilms.
   */
  const teamMembers = [
    {
      name: "Miguel Ángel Restrepo",
      role: "Product Owner & Frontend",
      image: "/MiguelRes.png",
      description: "Lidera la visión del producto y desarrolla interfaces modernas con React y TypeScript.",
      initials: "MAR"
    },
    {
      name: "Juan José Flórez",
      role: "Gestión de Proyectos & VCS",
      image: "/JuanFlo.png",
      description: "Coordina el desarrollo del proyecto y gestiona el control de versiones con Git.",
      initials: "JJF"
    },
    {
      name: "Juan Carlos Villa",
      role: "Database Manager",
      image: "/JuanVill.png",
      description: "Diseña y optimiza la estructura de datos para un rendimiento óptimo.",
      initials: "JCV"
    },
    {
      name: "Juan Esteban Agudelo",
      role: "Pruebas del Sistema",
      image: "/JuanAgu.png",
      description: "Garantiza la calidad del software mediante pruebas exhaustivas y QA.",
      initials: "JEA"
    },
    {
      name: "Kewin Alexander Grisales",
      role: "Backend Developer",
      image: "/KewinGri.png",
      description: "Construye APIs robustas y gestiona la lógica del servidor con Node.js.",
      initials: "KAG"
    }
  ];

  return (
    <div className="about-page">
      {/* Barra de progreso - Heurística #1: Visibilidad del sistema */}
      <div className="page-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Breadcrumb - Heurística #3: Control y libertad del usuario */}
      <nav className="breadcrumb">
        <a href="/">🏠 Inicio</a>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">Sobre Nosotros</span>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-logo">
          <span className="hero-logo-text">AirFilms</span>
        </div>
        <h1 className="hero-title">Sobre AirFilms</h1>
        <p className="hero-subtitle">
          Desarrollamos AirFilms como un proyecto universitario que se convirtió en una plataforma 
          poderosa para descubrir contenido audiovisual. Nuestro equipo de 5 desarrolladores trabaja 
          para crear la mejor experiencia de usuario.
        </p>
      </section>

      {/* Content Grid - Misión, Visión, Valores */}
      <div className="content-grid">
        <div className="content-card">
          <div className="card-icon">🎯</div>
          <h3 className="card-title">Nuestra Misión</h3>
          <p className="card-description">
            Deseamos ser la plataforma de búsqueda de videos para los usuarios más recónditos, ayudándolos
            a descubrir contenido audiovisual de calidad.
          </p>
        </div>

        <div className="content-card">
          <div className="card-icon">👁️</div>
          <h3 className="card-title">Nuestra Visión</h3>
          <p className="card-description">
            Convertirnos en desarrolladores Full Stack competentes y crear aplicaciones web que resuelvan 
            problemas reales mientras aplicamos las mejores prácticas de desarrollo y accesibilidad.
          </p>
        </div>

        <div className="content-card">
          <div className="card-icon">💎</div>
          <h3 className="card-title">Nuestros Valores</h3>
          <p className="card-description">
            Trabajo en equipo, aprendizaje continuo, código limpio y experiencia de usuario. 
            Cada línea de código refleja nuestro compromiso con la excelencia académica y profesional.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <section className="stats-section">
        <h2 className="section-title">AirFilms en Números</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">1K+</span>
            <span className="stat-label">Videos Disponibles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Búsquedas Diarias</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">70.5%</span>
            <span className="stat-label">Tiempo de Actividad</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Disponibilidad</span>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title">Nuestro Equipo</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-avatar">
                <img 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => {
                    // Fallback: mostrar iniciales si la imagen falla
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = member.initials;
                  }}
                />
              </div>
              <h4 className="member-name">{member.name}</h4>
              <p className="member-role">{member.role}</p>
              <p className="member-description">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <h2 className="cta-title">¿Tienes preguntas?</h2>
        <p className="cta-description">
          Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
        </p>
        <div className="cta-buttons">
          <a href="mailto:airfilms@support.com" className="btn-white">
            📧 Enviar Email
          </a>
          <a href="https://github.com" className="btn-outline" target="_blank" rel="noopener noreferrer">
            💻 Ver en GitHub
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;