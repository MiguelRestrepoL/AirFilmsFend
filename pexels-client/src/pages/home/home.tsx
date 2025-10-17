import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ResultadoBusquedaVideo } from "../../types/video.types";
import "./home.scss";

/**
 * Página de inicio (landing) de la aplicación.
 * Muestra hero banner, categorías, videos destacados y características.
 * 
 * @component
 * @returns {JSX.Element} Vista de inicio con contenido dinámico
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [videosDestacados, setVideosDestacados] = useState<ResultadoBusquedaVideo[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los videos destacados al montar el componente.
   * Realiza un fetch a la API de videos populares y toma los primeros 4.
   */
  useEffect(() => {
    const cargarVideosDestacados = async () => {
      try {
        setEstaCargando(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_LOCAL_URL;
        if (!apiUrl) {
          throw new Error("URL de API no configurada");
        }

        const url = `${apiUrl}/videos/search?query=popular`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
          throw new Error(`Error al cargar videos: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        
        // Mostrar solo los primeros 4 videos
        setVideosDestacados(Array.isArray(datos) ? datos.slice(0, 4) : []);
      } catch (err: any) {
        console.error("Error al cargar videos destacados:", err);
        setError(err.message || "Error al cargar los videos");
        setVideosDestacados([]);
      } finally {
        setEstaCargando(false);
      }
    };

    cargarVideosDestacados();
  }, []);

  /**
   * Navega a la página de películas con filtro de categoría.
   * 
   * @param {string} category - La categoría a filtrar
   */
  const handleCategoryClick = (category: string) => {
    navigate(`/peliculas?categoria=${encodeURIComponent(category)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-page__hero">
        <div className="home-page__hero-content">
          <h1 className="home-page__hero-title">AirFilms</h1>
          <p className="home-page__hero-subtitle">
            Descubre películas y videos increíbles
          </p>
          <button 
            className="home-page__hero-cta"
            onClick={() => navigate("/peliculas")}
            aria-label="Explorar películas"
          >
            Explorar Ahora
          </button>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="home-page__content">
        {/* Sección de Categorías */}
        <section className="home-page__categories-section">
          <h2 className="home-page__categories-title">Categorías</h2>
          <div className="home-page__categories-grid">
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("action")}
            >
              Acción
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("comedy")}
            >
              Comedia
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("drama")}
            >
              Drama
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("science fiction")}
            >
              Ciencia Ficción
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("documentary")}
            >
              Documentales
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("nature")}
            >
              Naturaleza
            </button>
          </div>
        </section>

        {/* Sección de Videos Destacados */}
        <section className="home-page__featured">
          <h2 className="home-page__featured-title">Destacados</h2>
          
          {estaCargando ? (
            <div className="home-page__loading">
              <div className="home-page__spinner"></div>
              <p>Cargando videos...</p>
            </div>
          ) : error ? (
            <div className="home-page__error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="home-page__featured-grid">
              {videosDestacados.length > 0 ? (
                videosDestacados.map((video) => (
                  <div key={video.id} className="home-page__video-card">
                    <div className="home-page__video-image">
                      <img 
                        src={video.thumbnail} 
                        alt={`Video ${video.id}`}
                        loading="lazy"
                      />
                      <div className="home-page__video-overlay">
                        <svg 
                          className="home-page__play-icon"
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="home-page__video-id">ID: {video.id}</p>
                  </div>
                ))
              ) : (
                <p className="home-page__no-videos">No hay videos disponibles</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;