import React from "react";
import "./hero-banner.scss";

/**
 * Banner principal de la página con imagen de fondo y texto destacado.
 * 
 * @component
 * @returns {JSX.Element} Banner hero con imagen de fondo
 */
const HeroBanner: React.FC = () => {
  return (
    <section className="hero-banner">
      <div className="hero-banner__overlay"></div>
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">AirFilms</h1>
        <p className="hero-banner__subtitle">
          Descubre películas y videos increíbles
        </p>
      </div>
    </section>
  );
};

export default HeroBanner;