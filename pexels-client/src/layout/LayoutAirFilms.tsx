import React from "react";
import { useAutenticacion } from "../services/AutenticacionS";
import Navbar from "../components/navbar/navbar";
import NavbarAutenticado from "../components/navbar/NavbarAutenticado";
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
 * - Navbar persistente en la parte superior (cambia según autenticación)
 * - Área de contenido principal (children)
 * - Footer persistente en la parte inferior
 * 
 * El Navbar se adapta automáticamente:
 * - Usuario NO autenticado → Muestra Navbar con "Iniciar Sesión" y "Registrarse"
 * - Usuario autenticado → Muestra NavbarAutenticado con avatar y configuración
 */
const LayoutAirFilms: React.FC<PropiedadesLayoutAirFilms> = ({ children }) => {
  const { estaAutenticado, estaCargando } = useAutenticacion();

  // Seleccionar el Navbar correcto según el estado de autenticación
  const NavbarComponente = estaAutenticado ? NavbarAutenticado : Navbar;

  // Mostrar un loader mientras se verifica la autenticación
  if (estaCargando) {
    return (
      <div className="layout-airfilms layout-airfilms--loading">
        <div className="layout-airfilms__loader">
          <div className="layout-airfilms__spinner"></div>
          <p>Cargando AirFilms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-airfilms">
      <NavbarComponente />
      <main className="layout-airfilms__content">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutAirFilms;