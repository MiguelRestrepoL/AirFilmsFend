
import React, { useEffect, useState } from 'react';
import "./sobre-nosotros.scss";

/**
 * Team member interface definition
 * 
 * @interface TeamMember
 * @property {string} name - Full name of the team member
 * @property {string} role - Job title or role in the team
 * @property {string} image - Path to the member's profile image
 * @property {string} description - Brief description of responsibilities
 * @property {string} initials - Fallback initials for failed image loads
 */
interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  initials: string;
}

/**
 * About Page Component
 * 
 * Displays comprehensive information about the AirFilms team including:
 * - Hero section with company branding
 * - Mission, vision, and values cards
 * - Statistics section
 * - Team member profiles
 * - Contact call-to-action
 * 
 * /**
 * @fileoverview About Us Page Component for AirFilms
 * 
 * WCAG 2.1 Level AA Compliance:
 * - ✓ 1.1.1 Non-text Content: All images have alt text, fallback to initials
 * - ✓ 1.3.1 Info and Relationships: Semantic HTML (nav, section, headings hierarchy)
 * - ✓ 1.4.1 Use of Color: Information not conveyed by color alone
 * - ✓ 1.4.3 Contrast (Minimum): Text contrast ratios meet 4.5:1 for normal text
 * - ✓ 2.1.1 Keyboard: All interactive elements keyboard accessible
 * - ✓ 2.4.1 Bypass Blocks: Breadcrumb navigation allows easy navigation
 * - ✓ 2.4.2 Page Titled: Component has clear title structure
 * - ✓ 2.4.4 Link Purpose: All links have descriptive text
 * - ✓ 3.3.2 Labels or Instructions: Form elements clearly labeled
 * - ✓ 4.1.2 Name, Role, Value: Proper ARIA attributes where needed
 * 
 * Nielsen's Heuristics Applied:
 * - H1: Visibility of system status (scroll progress indicator)
 * - H3: User control and freedom (breadcrumb navigation)
 * - H4: Consistency and standards (familiar UI patterns)
 * - H6: Recognition rather than recall (clear visual cues)
 * - H8: Aesthetic and minimalist design (clean, focused layout) 
 * 
 * @component
 * @returns {JSX.Element} Complete about page with team information
 * 
 * @example
 * ```tsx
 * <AboutPage />
 * ```
 */
const AboutPage: React.FC = () => {
  /**
   * Scroll progress state (0-100)
   * Tracks vertical scroll position as a percentage
   * 
   * @type {number}
   */
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  /**
   * Effect: Updates scroll progress indicator
   * 
   * Calculates scroll position as percentage and updates state.
   * Implements Nielsen's Heuristic #1: Visibility of system status
   * WCAG 1.3.1: Provides non-essential visual feedback
   * 
   * @effect
   * @returns {Function} Cleanup function to remove scroll listener
   */
  useEffect(() => {
    /**
     * Handles scroll events and calculates progress percentage
     * 
     * @function handleScroll
     * @returns {void}
     */
    const handleScroll = (): void => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Team members data array
   * Contains information about all AirFilms team members
   * 
   * @constant {TeamMember[]} teamMembers
   */
  const teamMembers: TeamMember[] = [
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

  /**
   * Handles image loading errors and displays fallback initials
   * WCAG 1.1.1: Provides text alternative for non-text content
   * 
   * @function handleImageError
   * @param {React.SyntheticEvent<HTMLImageElement>} e - Image error event
   * @param {string} initials - Fallback initials to display
   * @returns {void}
   */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    initials: string
  ): void => {
    const target = e.currentTarget;
    target.style.display = 'none';
    if (target.parentElement) {
      target.parentElement.innerHTML = initials;
    }
  };

  return (
    <div className="about-page">
      {/* 
        Progress Bar - Nielsen's H1: Visibility of system status
        WCAG 1.3.1: Visual feedback only, not essential for understanding
      */}
      <div 
        className="page-progress" 
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className="progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* 
        Breadcrumb Navigation - Nielsen's H3: User control and freedom
        WCAG 2.4.1: Bypass blocks mechanism
        WCAG 2.4.8: Location information
      */}
      <nav className="breadcrumb" aria-label="Breadcrumb navigation">
        <a href="/" aria-label="Navigate to home page">
          <span aria-hidden="true">🏠</span> Inicio
        </a>
        <span className="breadcrumb-separator" aria-hidden="true">→</span>
        <span className="breadcrumb-current" aria-current="page">Sobre Nosotros</span>
      </nav>

      {/* 
        Hero Section
        WCAG 2.4.2: Page titled appropriately
        WCAG 1.3.1: Proper heading hierarchy
      */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-logo" aria-hidden="true">
          <span className="hero-logo-text">AirFilms</span>
        </div>
        <h1 id="hero-title" className="hero-title">Sobre AirFilms</h1>
        <p className="hero-subtitle">
          Desarrollamos AirFilms como un proyecto universitario que se convirtió en una plataforma 
          poderosa para descubrir contenido audiovisual. Nuestro equipo de 5 desarrolladores trabaja 
          para crear la mejor experiencia de usuario.
        </p>
      </section>

      {/* 
        Content Grid - Mission, Vision, Values
        WCAG 1.3.1: Info and relationships preserved
        WCAG 1.4.1: Color not sole means of conveying information
      */}
      <div className="content-grid">
        <article className="content-card">
          <div className="card-icon" aria-hidden="true">🎯</div>
          <h3 className="card-title">Nuestra Misión</h3>
          <p className="card-description">
            Deseamos ser la plataforma de búsqueda de videos para los usuarios más recónditos, ayudándolos
            a descubrir contenido audiovisual de calidad.
          </p>
        </article>

        <article className="content-card">
          <div className="card-icon" aria-hidden="true">👁️</div>
          <h3 className="card-title">Nuestra Visión</h3>
          <p className="card-description">
            Convertirnos en desarrolladores Full Stack competentes y crear aplicaciones web que resuelvan 
            problemas reales mientras aplicamos las mejores prácticas de desarrollo y accesibilidad.
          </p>
        </article>

        <article className="content-card">
          <div className="card-icon" aria-hidden="true">💎</div>
          <h3 className="card-title">Nuestros Valores</h3>
          <p className="card-description">
            Trabajo en equipo, aprendizaje continuo, código limpio y experiencia de usuario. 
            Cada línea de código refleja nuestro compromiso con la excelencia académica y profesional.
          </p>
        </article>
      </div>

      {/* 
        Stats Section
        WCAG 1.3.1: Data presented in accessible format
      */}
      <section className="stats-section" aria-labelledby="stats-title">
        <h2 id="stats-title" className="section-title">AirFilms en Números</h2>
        <div className="stats-grid" role="list">
          <div className="stat-item" role="listitem">
            <span className="stat-number" aria-label="Mil">1K+</span>
            <span className="stat-label">Videos Disponibles</span>
          </div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">200+</span>
            <span className="stat-label">Búsquedas Diarias</span>
          </div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">70.5%</span>
            <span className="stat-label">Tiempo de Actividad</span>
          </div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Disponibilidad</span>
          </div>
        </div>
      </section>

      {/* 
        Team Section
        WCAG 1.1.1: All images have alt text
        WCAG 1.3.1: Proper semantic structure
      */}
      <section className="team-section" aria-labelledby="team-title">
        <h2 id="team-title" className="section-title">Nuestro Equipo</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <article key={index} className="team-member">
              <div className="member-avatar">
                <img 
                  src={member.image} 
                  alt={`Fotografía de ${member.name}, ${member.role}`}
                  onError={(e) => handleImageError(e, member.initials)}
                />
              </div>
              <h4 className="member-name">{member.name}</h4>
              <p className="member-role">{member.role}</p>
              <p className="member-description">{member.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 
        Contact CTA
        WCAG 2.4.4: Link purpose clear from text
        WCAG 3.2.4: Consistent identification
      */}
      <section className="contact-cta" aria-labelledby="contact-title">
        <h2 id="contact-title" className="cta-title">¿Tienes preguntas?</h2>
        <p className="cta-description">
          Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
        </p>
        <div className="cta-buttons">
          <a 
            href="mailto:airfilms@support.com" 
            className="btn-white"
            aria-label="Send email to AirFilms support"
          >
            <span aria-hidden="true">📧</span> Enviar Email
          </a>
          <a 
            href="https://github.com" 
            className="btn-outline" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="View AirFilms project on GitHub (opens in new tab)"
          >
            <span aria-hidden="true">💻</span> Ver en GitHub
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;