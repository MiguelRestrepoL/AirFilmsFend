import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LayoutAirFilms from "../layout/LayoutAirFilms";
import HomePage from "../pages/home/home";
import MoviePage from "../pages/peliculas/peliculas";
import AboutPage from "../pages/sobre-nosotros/sobre-nosotros";
import SiteMapPage from "../pages/site-map/site-map";
import InicioSesion from "../pages/inicioSesion/inicioSesion";
import Registro from "../pages/registro/registro";
import OlvidarPw1 from "../pages/olvidar-pw/olvidar-pw1";
import OlvidarPw2 from "../pages/olvidar-pw/olvidar-pw2";
import Perfil from "../pages/perfil/perfil";
import EliminarPerfil from "../pages/perfil/eliminar-perfil";

/**
 * Componente para proteger rutas.
 * Simplemente verifica si hay token en localStorage.
 */
const RutaProtegida: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("airfilms_token");

  if (!token) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  return children;
};

const RoutesAirFilms: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LayoutAirFilms><HomePage /></LayoutAirFilms>} />
        <Route path="/peliculas" element={<LayoutAirFilms><MoviePage /></LayoutAirFilms>} />
        <Route path="/sobre-nosotros" element={<LayoutAirFilms><AboutPage /></LayoutAirFilms>} />
        <Route path="/site-map" element={<LayoutAirFilms><SiteMapPage /></LayoutAirFilms>} />

        {/* Rutas Protegidas */}
        <Route path="/perfil" element={ <LayoutAirFilms><Perfil /></LayoutAirFilms>} />
        <Route path="/eliminar-perfil" element={ <LayoutAirFilms><EliminarPerfil /></LayoutAirFilms>} />

        {/* Auth (sin Layout) */}
        <Route path="/inicio-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvidar-pw1" element={<OlvidarPw1 />} />
        <Route path="/olvidar-pw2" element={<OlvidarPw2 />} />

        {/* 404 */}
        <Route path="*" element={
          <LayoutAirFilms>
            <h2 style={{color: 'white', padding: '2rem'}}>404 - Página no encontrada</h2>
          </LayoutAirFilms>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesAirFilms;