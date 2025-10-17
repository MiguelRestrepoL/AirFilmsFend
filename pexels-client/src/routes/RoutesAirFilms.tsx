import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import LayoutAirFilms from "../layout/LayoutAirFilms";
import HomePage from "../pages/home/home";
import MoviePage from "../pages/peliculas/peliculas";
import AboutPage from "../pages/sobre-nosotros/sobre-nosotros";
import SiteMapPage from "../pages/site-map/site-map";
import InicioSesion from "../pages/inicioSesion/inicioSesion";
import Registro from "../pages/registro/registro";


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
      <Routes>
        {/* Rutas CON Layout */}
        <Route path="/" element={<LayoutAirFilms><HomePage /></LayoutAirFilms>} />
        <Route path="/peliculas" element={<LayoutAirFilms><MoviePage /></LayoutAirFilms>} />
        <Route path="/sobre-nosotros" element={<LayoutAirFilms><AboutPage /></LayoutAirFilms>} />
        <Route path="/site-map" element={<LayoutAirFilms><SiteMapPage /></LayoutAirFilms>} />
        
        {/* Rutas SIN Layout (Login standalone) */}
        <Route path="/inicio-sesion" element={<InicioSesion />} />
        <Route path="/olvidar-pw1" element={<div style={{color: 'white', padding: '2rem'}}>Recuperar contraseña (próximamente)</div>} />
        <Route path= "/perfil" element={<div style={{color: 'white', padding: '2rem'}}>Perfil de usuario (próximamente)</div>} />
        <Route path= "/registro" element={<Registro />} />

        {/* 404 */}
        <Route path="*" element={<LayoutAirFilms><h2 style={{color: 'white', padding: '2rem'}}>Página no encontrada</h2></LayoutAirFilms>} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesAirFilms;