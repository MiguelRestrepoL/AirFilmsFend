import React from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import "./LayoutAirFilms.scss";

/**
 * Propiedades aceptadas por LayoutAirFilms.
 */
interface PropiedadesLayoutAirFilms {
  /**
   * Contenido de la página que se renderiza entre Navbar y Footer.
   */
  children: React.ReactNode;
}

/**
 * Layout compartido de la aplicación que renderiza navegación global,
 * contenido de la página actual y pie de página.
 * 
 * @component
 * @param {PropiedadesLayoutAirFilms} props - Propiedades del componente
 * @returns {JSX.Element} Estructura de layout para las páginas
 * 
 * @remarks
 * Este layout envuelve todas las páginas para proporcionar:
 * - Navbar persistente en la parte superior
 * - Área de contenido principal (children)
 * - Footer persistente en la parte inferior
 */
const LayoutAirFilms: React.FC<PropiedadesLayoutAirFilms> = ({ children }) => {
  return (
    <div className="layout-airfilms">
      <Navbar />
      <main className="layout-airfilms__content">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutAirFilms;