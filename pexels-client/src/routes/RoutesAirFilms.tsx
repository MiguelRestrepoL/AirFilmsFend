/** Imports de la aplicación AirFilms */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ProveedorAutenticacion, useAutenticacion } from "../services/AutenticacionS";
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
 * Componente para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /inicio-sesion
 */
const RutaProtegida: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { estaAutenticado, estaCargando } = useAutenticacion();

  if (estaCargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: 'white'
      }}>
        Cargando...
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  return children;
};

/**
 * Configuración de rutas de nivel superior para la aplicación AirFilms.
 * 
 * @component
 * @returns {JSX.Element} Router con todas las rutas de la aplicación
 * 
 * @remarks
 * - Rutas públicas: Home, Películas, Sobre Nosotros, Site Map
 * - Rutas protegidas: Perfil, Eliminar Perfil (requieren login)
 * - Rutas de autenticación: Login, Registro, Recuperar contraseña
 */
const RoutesAirFilms: React.FC = () => {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        <Routes>
          {/* ============================================ */}
          {/* RUTAS PÚBLICAS (accesibles sin login) */}
          {/* ============================================ */}
          <Route path="/" element={<LayoutAirFilms><HomePage /></LayoutAirFilms>} />
          <Route path="/peliculas" element={<LayoutAirFilms><MoviePage /></LayoutAirFilms>} />
          <Route path="/sobre-nosotros" element={<LayoutAirFilms><AboutPage /></LayoutAirFilms>} />
          <Route path="/site-map" element={<LayoutAirFilms><SiteMapPage /></LayoutAirFilms>} />
        
          {/* ============================================ */}
          {/* RUTAS PROTEGIDAS (requieren autenticación) */}
          {/* ============================================ */}
          <Route 
            path="/perfil" 
            element={
              <RutaProtegida>
                <LayoutAirFilms><Perfil /></LayoutAirFilms>
              </RutaProtegida>
            } 
          />
          <Route 
            path="/eliminar-perfil" 
            element={
              <RutaProtegida>
                <LayoutAirFilms><EliminarPerfil /></LayoutAirFilms>
              </RutaProtegida>
            } 
          />
        
          {/* ============================================ */}
          {/* RUTAS DE AUTENTICACIÓN (sin Layout) */}
          {/* ============================================ */}
          <Route path="/inicio-sesion" element={<InicioSesion />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvidar-pw1" element={<OlvidarPw1 />} />
          <Route path="/olvidar-pw2" element={<OlvidarPw2 />} />

          {/* ============================================ */}
          {/* 404 - PÁGINA NO ENCONTRADA */}
          {/* ============================================ */}
          <Route path="*" element={
            <LayoutAirFilms>
              <div style={{
                color: 'white', 
                padding: '4rem 2rem', 
                textAlign: 'center',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #E45B12, #F5283A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Página no encontrada</h2>
                <a href="/" style={{
                  color: '#E45B12',
                  textDecoration: 'none',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  ← Volver al inicio
                </a>
              </div>
            </LayoutAirFilms>
          } />
        </Routes>
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
};

export default RoutesAirFilms;