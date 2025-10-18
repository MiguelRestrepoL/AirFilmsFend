import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAutenticacion } from "../../services/AutenticacionS";
import type { ResultadoBusquedaVideo } from "../../types/video.types";
import "./homeprotected.scss"

/**
 * Página de inicio para usuarios autenticados.
 * Muestra más contenido, recomendaciones personalizadas y acceso completo.
 * 
 * @component
 * @returns {JSX.Element} Vista de inicio personalizada para usuarios con sesión
 */
const HomeProtected: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAutenticacion();
  
  const [videosRecomendados, setVideosRecomendados] = useState<ResultadoBusquedaVideo[]>([]);
  const [videosRecientes, setVideosRecientes] = useState<ResultadoBusquedaVideo[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga videos recomendados y recientes al montar el componente.
   */
  useEffect(() => {
    const cargarVideos = async () => {
      try {
        setEstaCargando(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_LOCAL_URL;
        if (!apiUrl) {
          throw new Error("URL de API no configurada");
        }

        // Cargar videos recomendados
        const urlRecomendados = `${apiUrl}/videos/search?query=popular`;
        const respuestaRecomendados = await fetch(urlRecomendados);

        if (!respuestaRecomendados.ok) {
          throw new Error(`Error al cargar videos: ${respuestaRecomendados.status}`);
        }

        const datosRecomendados = await respuestaRecomendados.json();
        setVideosRecomendados(Array.isArray(datosRecomendados) ? datosRecomendados.slice(0, 6) : []);

        // Cargar videos recientes
        const urlRecientes = `${apiUrl}/videos/search?query=nature`;
        const respuestaRecientes = await fetch(urlRecientes);

        if (!respuestaRecientes.ok) {
          throw new Error(`Error al cargar videos: ${respuestaRecientes.status}`);
        }

        const datosRecientes = await respuestaRecientes.json();
        setVideosRecientes(Array.isArray(datosRecientes) ? datosRecientes.slice(0, 4) : []);
      } catch (err: any) {
        console.error("Error al cargar videos:", err);
        setError(err.message || "Error al cargar los videos");
        setVideosRecomendados([]);
        setVideosRecientes([]);
      } finally {
        setEstaCargando(false);
      }
    };

    cargarVideos();
  }, []);

  /**
   * Maneja el cierre de sesión.
   */
  const manejarCerrarSesion = async () => {
    try {
      await cerrarSesion();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  /**
   * Navega a la página de películas con filtro de categoría.
   */
  const handleCategoryClick = (category: string) => {
    navigate(`/peliculas?categoria=${encodeURIComponent(category)}`);
  };

  return (
    <div className="home-protected">
      {/* Hero Section Personalizado */}
      <section className="home-protected__hero">
        <div className="home-protected__hero-content">
          <div className="home-protected__bienvenida">
            <h1 className="home-protected__hero-title">
              ¡Hola, {usuario?.name || "Usuario"}! 👋
            </h1>
            <p className="home-protected__hero-subtitle">
              Bienvenido de vuelta a AirFilms. ¿Qué quieres ver hoy?
            </p>
          </div>
          
          <div className="home-protected__user-actions">
            <button 
              className="home-protected__btn home-protected__btn--primary"
              onClick={() => navigate("/peliculas")}
            >
              Explorar Películas
            </button>
            <button 
              className="home-protected__btn home-protected__btn--secondary"
              onClick={manejarCerrarSesion}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="home-protected__content">
        {/* Categorías Rápidas */}
        <section className="home-protected__quick-categories">
          <h2 className="home-protected__section-title">Explorar por Categoría</h2>
          <div className="home-protected__categories-scroll">
            <button 
              className="home-protected__category-card"
              onClick={() => handleCategoryClick("action")}
            >
              <div className="home-protected__category-icon">💥</div>
              <span>Acción</span>
            </button>
            <button 
              className="home-protected__category-card"
              onClick={() => handleCategoryClick("comedy")}
            >
              <div className="home-protected__category-icon">😂</div>
              <span>Comedia</span>
            </button>
            <button 
              className="home-protected__category-card"
              onClick={() => handleCategoryClick("drama")}
            >
              <div className="home-protected__category-icon">🎭</div>
              <span>Drama</span>
            </button>
            <button 
              className="home-protected__category-card"
              onClick={() => handleCategoryClick("science fiction")}
            >
              <div className="home-protected__category-icon">🚀</div>
              <span>Sci-Fi</span>
            </button>
            <button 
              className="home-protected__category-card"
              onClick={() => handleCategoryClick("documentary")}
            >
              <div className="home-protected__category-icon">📽️</div>
              <span>Documentales</span>
            </button>
            <button 
              className="home-protected__category-card"
              onClick={() => handleCategoryClick("nature")}
            >
              <div className="home-protected__category-icon">🌿</div>
              <span>Naturaleza</span>
            </button>
          </div>
        </section>

        {/* Videos Recomendados */}
        <section className="home-protected__section">
          <div className="home-protected__section-header">
            <h2 className="home-protected__section-title">Recomendados para Ti</h2>
            <button 
              className="home-protected__see-all"
              onClick={() => navigate("/peliculas")}
            >
              Ver todos →
            </button>
          </div>
          
          {estaCargando ? (
            <div className="home-protected__loading">
              <div className="home-protected__spinner"></div>
              <p>Cargando recomendaciones...</p>
            </div>
          ) : error ? (
            <div className="home-protected__error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="home-protected__videos-grid">
              {videosRecomendados.length > 0 ? (
                videosRecomendados.map((video) => (
                  <div 
                    key={video.id} 
                    className="home-protected__video-card"
                    onClick={() => navigate(`/peliculas?videoId=${video.id}`)}
                  >
                    <div className="home-protected__video-image">
                      <img 
                        src={video.thumbnail} 
                        alt={`Video ${video.id}`}
                        loading="lazy"
                      />
                      <div className="home-protected__video-overlay">
                        <svg 
                          className="home-protected__play-icon"
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="home-protected__video-info">
                      <p className="home-protected__video-id">ID: {video.id}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="home-protected__no-videos">No hay videos disponibles</p>
              )}
            </div>
          )}
        </section>

        {/* Videos Recientes */}
        <section className="home-protected__section">
          <div className="home-protected__section-header">
            <h2 className="home-protected__section-title">Agregados Recientemente</h2>
            <button 
              className="home-protected__see-all"
              onClick={() => navigate("/peliculas")}
            >
              Ver todos →
            </button>
          </div>
          
          {!estaCargando && (
            <div className="home-protected__videos-grid home-protected__videos-grid--compact">
              {videosRecientes.length > 0 ? (
                videosRecientes.map((video) => (
                  <div 
                    key={video.id} 
                    className="home-protected__video-card"
                    onClick={() => navigate(`/peliculas?videoId=${video.id}`)}
                  >
                    <div className="home-protected__video-image">
                      <img 
                        src={video.thumbnail} 
                        alt={`Video ${video.id}`}
                        loading="lazy"
                      />
                      <div className="home-protected__video-overlay">
                        <svg 
                          className="home-protected__play-icon"
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="home-protected__video-info">
                      <p className="home-protected__video-id">ID: {video.id}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="home-protected__no-videos">No hay videos disponibles</p>
              )}
            </div>
          )}
        </section>

        {/* Info del Usuario */}
        <section className="home-protected__user-info">
          <div className="home-protected__info-card">
            <h3>Tu Perfil</h3>
            <div className="home-protected__profile-details">
              <p><strong>Nombre:</strong> {usuario?.name} {usuario?.lastName}</p>
              <p><strong>Email:</strong> {usuario?.email}</p>
              <p><strong>Edad:</strong> {usuario?.age} años</p>
              <p><strong>Miembro desde:</strong> {usuario?.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES') : 'N/A'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeProtected;