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
 * Props for the ProtectedRoute component.
 * 
 * @interface ProtectedRouteProps
 * @property {React.ReactElement} children - The child component to render if authentication succeeds.
 */
interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * ProtectedRoute Component
 * 
 * Higher-order component that protects routes by checking for authentication token.
 * If no token exists in localStorage, redirects user to login page.
 * 
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @returns {React.ReactElement} Either the protected children or a redirect to login
 * 
 * @example
 * <ProtectedRoute>
 *   <ProfilePage />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("airfilms_token");

  if (!token) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  return children;
};

/**
 * RoutesAirFilms Component
 * 
 * Main routing configuration for the AirFilms application.
 * Defines all public, protected, and authentication routes with proper accessibility structure.
 * 
 * Route Structure:
 * - Public Routes: Home, Movies, About, Sitemap (wrapped in LayoutAirFilms)
 * - Protected Routes: Profile, Delete Profile (requires authentication)
 * - Auth Routes: Login, Register, Password Recovery (no layout)
 * - Fallback: 404 Not Found page
 * 
 * @component
 * @returns {React.ReactElement} The complete routing configuration for the application
 * 
 * @accessibility
 * - Uses semantic HTML structure through page components
 * - Provides proper navigation hierarchy
 * - 404 page includes descriptive heading for screen readers
 * - Protected routes ensure secure access control
 * 
 * @example
 * // In App.tsx
 * <RoutesAirFilms />
 */
const RoutesAirFilms: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Accessible to all users */}
        <Route 
          path="/" 
          element={
            <LayoutAirFilms>
              <HomePage />
            </LayoutAirFilms>
          } 
        />
        <Route 
          path="/peliculas" 
          element={
            <LayoutAirFilms>
              <MoviePage />
            </LayoutAirFilms>
          } 
        />
        <Route 
          path="/sobre-nosotros" 
          element={
            <LayoutAirFilms>
              <AboutPage />
            </LayoutAirFilms>
          } 
        />
        <Route 
          path="/site-map" 
          element={
            <LayoutAirFilms>
              <SiteMapPage />
            </LayoutAirFilms>
          } 
        />

        {/* Protected Routes - Require authentication */}
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <LayoutAirFilms>
                <Perfil />
              </LayoutAirFilms>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/eliminar-perfil" 
          element={
            <ProtectedRoute>
              <LayoutAirFilms>
                <EliminarPerfil />
              </LayoutAirFilms>
            </ProtectedRoute>
          } 
        />

        {/* Authentication Routes - No layout wrapper */}
        <Route path="/inicio-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvidar-pw1" element={<OlvidarPw1 />} />
        <Route path="/olvidar-pw2" element={<OlvidarPw2 />} />

        {/* 404 Not Found - Fallback route with WCAG-compliant heading */}
        <Route 
          path="*" 
          element={
            <LayoutAirFilms>
              <main role="main" aria-labelledby="error-heading">
                <h1 
                  id="error-heading"
                  style={{
                    color: 'white', 
                    padding: '2rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  404 - Página no encontrada
                </h1>
                <p 
                  style={{
                    color: 'white', 
                    padding: '0 2rem',
                    fontSize: '1rem'
                  }}
                >
                  La página que buscas no existe o ha sido movida.
                </p>
              </main>
            </LayoutAirFilms>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesAirFilms;