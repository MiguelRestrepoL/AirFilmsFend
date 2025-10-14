import React from "react";
import "./sobre-nosotros.scss";

/**
 * Página "Sobre Nosotros" que describe el equipo de AirFilms.
 * 
 * @component
 * @returns {JSX.Element} Descripción breve del equipo
 */
const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-page__content">
        <h1 className="about-page__title">Sobre Nosotros</h1>
        <h2 className="about-page__subtitle">Conoce a nuestro equipo</h2>
        
        <div className="about-page__description">
          <p>
            AirFilms es un proyecto desarrollado por estudiantes apasionados por
            el cine y la tecnología. Nuestro objetivo es ofrecer una plataforma
            intuitiva y accesible para descubrir contenido audiovisual de calidad.
          </p>
          <p>
            Utilizamos las últimas tecnologías web como React, TypeScript y SASS
            para crear una experiencia de usuario moderna y fluida.
          </p>
          <p>
            Este proyecto forma parte del reto académico donde implementamos
            búsqueda de videos y visualización de contenido utilizando la API de Pexels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;