import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import LayoutAirFilms from "../layout/LayoutAirFilms";
import HomePage from "../pages/home/home";
import MoviePage from "../pages/peliculas/peliculas";
import AboutPage from "../pages/sobre-nosotros/sobre-nosotros";
import SiteMapPage from "../pages/site-map/site-map";

/**
 * Configuración de rutas de nivel superior para la aplicación AirFilms.
 * 
 * @component
 * @returns {JSX.Element} Router con todas las rutas de la aplicación dentro del layout compartido
 * 
 * @remarks
 * - Usa BrowserRouter para URLs limpias (API de historial)
 * - Envuelve las páginas con LayoutAirFilms para proporcionar UI global (Navbar/Footer)
 */
const RoutesAirFilms: React.FC = () => {
  return (
    <BrowserRouter>
      <LayoutAirFilms>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/peliculas" element={<MoviePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/site-map" element={<SiteMapPage />} />
        </Routes>
      </LayoutAirFilms>
    </BrowserRouter>
  );
};

export default RoutesAirFilms;