
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ResultadoBusquedaVideo } from "../../types/video.types";
import "./home.scss";

/**
 * Página de inicio que muestra diferentes vistas según autenticación.
 * - Usuario NO autenticado: Vista pública básica
 * - Usuario autenticado: Vista con recomendaciones personalizadas
 * 
 * @component
 * @returns {JSX.Element} Vista de inicio condicional
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [estaCargando, setEstaCargando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [videosDestacados, setVideosDestacados] = useState<ResultadoBusquedaVideo[]>([]);
  const [videosRecomendados, setVideosRecomendados] = useState<ResultadoBusquedaVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verifica autenticación y carga datos del usuario
   */
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          // Verificar token con el backend
          const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
          
          try {
            const response = await fetch(`${apiUrl}/auth/verify-auth`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                // Token válido, ahora obtenemos el perfil
                const profileResponse = await fetch(`${apiUrl}/user/profile`, {
                  headers: {
                    "Authorization": `Bearer ${token}`
                  }
                });

                if (profileResponse.ok) {
                  const profileData = await profileResponse.json();
                  if (profileData.success && profileData.user) {
                    setUsuario(profileData.user);
                    setEstaAutenticado(true);
                  } else {
                    // Si no hay perfil pero el token es válido, igual autenticamos
                    setEstaAutenticado(true);
                    setUsuario({ name: "Usuario" });
                  }
                } else {
                  setEstaAutenticado(false);
                  localStorage.removeItem("authToken");
                }
              } else {
                setEstaAutenticado(false);
                localStorage.removeItem("authToken");
              }
            } else {
              setEstaAutenticado(false);
              localStorage.removeItem("authToken");
            }
          } catch (err) {
            console.error("Error al verificar token:", err);
            // Si hay error de red pero tenemos token, asumimos autenticado temporalmente
            if (token) {
              setEstaAutenticado(true);
              setUsuario({ name: "Usuario" });
            }
          }
        } else {
          setEstaAutenticado(false);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setEstaAutenticado(false);
      } finally {
        setEstaCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  /**
   * Carga videos según el tipo de usuario
   */
  useEffect(() => {
    if (estaCargando) return;

    const cargarVideos = async () => {
      try {
        setError(null);
        const apiUrl = import.meta.env.VITE_API_LOCAL_URL;
        
        if (!apiUrl) {
          throw new Error("URL de API no configurada");
        }

        if (estaAutenticado) {
          // Usuario autenticado: cargar más videos
          const urlRecomendados = `${apiUrl}/videos/search?query=popular`;
          const respuestaRecomendados = await fetch(urlRecomendados);
          
          if (respuestaRecomendados.ok) {
            const datosRecomendados = await respuestaRecomendados.json();
            setVideosRecomendados(Array.isArray(datosRecomendados) ? datosRecomendados.slice(0, 6) : []);
          }

          const urlRecientes = `${apiUrl}/videos/search?query=nature`;
          const respuestaRecientes = await fetch(urlRecientes);
          
          if (respuestaRecientes.ok) {
            const datosRecientes = await respuestaRecientes.json();
            setVideosDestacados(Array.isArray(datosRecientes) ? datosRecientes.slice(0, 4) : []);
          }
        } else {
          // Usuario NO autenticado: solo 4 videos destacados
          const url = `${apiUrl}/videos/search?query=popular`;
          const respuesta = await fetch(url);
          
          if (respuesta.ok) {
            const datos = await respuesta.json();
            setVideosDestacados(Array.isArray(datos) ? datos.slice(0, 4) : []);
          }
        }
      } catch (err: any) {
        console.error("Error al cargar videos:", err);
        setError(err.message || "Error al cargar los videos");
      }
    };

    cargarVideos();
  }, [estaAutenticado, estaCargando]);

  /**
   * Maneja el cierre de sesión
   */
  const handleCerrarSesion = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }

      localStorage.removeItem("authToken");
      setEstaAutenticado(false);
      setUsuario(null);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  /**
   * Navega a categoría
   */
  const handleCategoryClick = (category: string) => {
    navigate(`/peliculas?categoria=${encodeURIComponent(category)}`);
  };

  // Loading state
  if (estaCargando) {
    return (
      <div className="home-page__loading-screen">
        <div className="home-page__spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // ============================================
  // VISTA PARA USUARIO AUTENTICADO
  // ============================================
  if (estaAutenticado && usuario) {
    return (
      <div className="home-page home-page--protected">
        {/* Hero Personalizado */}
        <section className="home-page__hero home-page__hero--protected">
          <div className="home-page__hero-content">
            <div className="home-page__welcome">
              <h1 className="home-page__hero-title">
                ¡Hola, {usuario.name}! 👋
              </h1>
              <p className="home-page__hero-subtitle">
                Bienvenido de vuelta a AirFilms. ¿Qué quieres ver hoy?
              </p>
            </div>
            
            <div className="home-page__user-actions">
              <button 
                className="home-page__btn home-page__btn--primary"
                onClick={() => navigate("/peliculas")}
              >
                Explorar Películas
              </button>
              <button 
                className="home-page__btn home-page__btn--secondary"
                onClick={handleCerrarSesion}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <div className="home-page__content">
          {/* Categorías Rápidas */}
          <section className="home-page__quick-categories">
            <h2 className="home-page__section-title">Explorar por Categoría</h2>
            <div className="home-page__categories-scroll">
              <button className="home-page__category-card" onClick={() => handleCategoryClick("action")}>
                <div className="home-page__category-icon">💥</div>
                <span>Acción</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("comedy")}>
                <div className="home-page__category-icon">😂</div>
                <span>Comedia</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("drama")}>
                <div className="home-page__category-icon">🎭</div>
                <span>Drama</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("science fiction")}>
                <div className="home-page__category-icon">🚀</div>
                <span>Sci-Fi</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("documentary")}>
                <div className="home-page__category-icon">📽️</div>
                <span>Documentales</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("nature")}>
                <div className="home-page__category-icon">🌿</div>
                <span>Naturaleza</span>
              </button>
            </div>
          </section>

          {/* Videos Recomendados */}
          <section className="home-page__section">
            <div className="home-page__section-header">
              <h2 className="home-page__section-title">Recomendados para Ti</h2>
              <button className="home-page__see-all" onClick={() => navigate("/peliculas")}>
                Ver todos →
              </button>
            </div>
            
            {error ? (
              <div className="home-page__error"><p>{error}</p></div>
            ) : (
              <div className="home-page__videos-grid">
                {videosRecomendados.length > 0 ? (
                  videosRecomendados.map((video) => (
                    <div key={video.id} className="home-page__video-card">
                      <div className="home-page__video-image">
                        <img src={video.thumbnail} alt={`Video ${video.id}`} loading="lazy" />
                        <div className="home-page__video-overlay">
                          <svg className="home-page__play-icon" viewBox="0 0 24 24" fill="currentColor">
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

          {/* Videos Recientes */}
          <section className="home-page__section">
            <div className="home-page__section-header">
              <h2 className="home-page__section-title">Agregados Recientemente</h2>
            </div>
            <div className="home-page__videos-grid home-page__videos-grid--compact">
              {videosDestacados.map((video) => (
                <div key={video.id} className="home-page__video-card">
                  <div className="home-page__video-image">
                    <img src={video.thumbnail} alt={`Video ${video.id}`} loading="lazy" />
                    <div className="home-page__video-overlay">
                      <svg className="home-page__play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="home-page__video-id">ID: {video.id}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Info del Usuario */}
          <section className="home-page__user-info">
            <div className="home-page__info-card">
              <h3>Tu Perfil</h3>
              <div className="home-page__profile-details">
                <p><strong>Nombre:</strong> {usuario.name} {usuario.lastName}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Edad:</strong> {usuario.age} años</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ============================================
  // VISTA PARA USUARIO NO AUTENTICADO
  // ============================================
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
            <button className="home-page__category-btn" onClick={() => handleCategoryClick("action")}>
              Acción
            </button>
            <button className="home-page__category-btn" onClick={() => handleCategoryClick("comedy")}>
              Comedia
            </button>
            <button className="home-page__category-btn" onClick={() => handleCategoryClick("drama")}>
              Drama
            </button>
            <button className="home-page__category-btn" onClick={() => handleCategoryClick("science fiction")}>
              Ciencia Ficción
            </button>
            <button className="home-page__category-btn" onClick={() => handleCategoryClick("documentary")}>
              Documentales
            </button>
            <button className="home-page__category-btn" onClick={() => handleCategoryClick("nature")}>
              Naturaleza
            </button>
          </div>
        </section>

        {/* Sección de Videos Destacados */}
        <section className="home-page__featured">
          <h2 className="home-page__featured-title">Destacados</h2>
          
          {error ? (
            <div className="home-page__error"><p>{error}</p></div>
          ) : (
            <div className="home-page__featured-grid">
              {videosDestacados.length > 0 ? (
                videosDestacados.map((video) => (
                  <div key={video.id} className="home-page__video-card">
                    <div className="home-page__video-image">
                      <img src={video.thumbnail} alt={`Video ${video.id}`} loading="lazy" />
                      <div className="home-page__video-overlay">
                        <svg className="home-page__play-icon" viewBox="0 0 24 24" fill="currentColor">
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