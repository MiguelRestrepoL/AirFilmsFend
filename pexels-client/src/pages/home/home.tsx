import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import servicioPeliculas from "../../services/peliculas.servicio";
import type { Movie } from "../../types/movies.types";
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
  const [peliculasDestacadas, setPeliculasDestacadas] = useState<Movie[]>([]);
  const [peliculasRecomendadas, setPeliculasRecomendadas] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verifica autenticación y carga datos del usuario
   */
  /**
   * Verifica autenticación y carga datos del usuario
   */
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        console.log("🔍 Verificando token:", token ? "✅ Token encontrado" : "❌ No hay token");
        
        if (token) {
          setEstaAutenticado(true);
          
          // Intentar obtener datos del usuario
          const apiUrl = import.meta.env.VITE_API_URL || "https://airfilms-server.onrender.com/api";
          
          try {
            const profileResponse = await fetch(`${apiUrl}/users/profile`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              console.log("👤 Datos de perfil:", profileData);
              
              if (profileData.success && profileData.user) {
                setUsuario(profileData.user);
                console.log("✅ Usuario autenticado:", profileData.user.name);
              } else {
                setUsuario({ name: "Usuario" });
              }
            } else {
              console.warn("⚠️ Error al obtener perfil");
              setUsuario({ name: "Usuario" });
            }
          } catch (profileErr) {
            console.error("❌ Error al cargar perfil:", profileErr);
            setUsuario({ name: "Usuario" });
          }
        } else {
          console.log("ℹ️ No hay token, usuario no autenticado");
          setEstaAutenticado(false);
        }
      } catch (error) {
        console.error("❌ Error general en verificación:", error);
        setEstaAutenticado(false);
      } finally {
        console.log("✅ Verificación completada");
        setEstaCargando(false);
      }
    };

    verificarAutenticacion();

    // Escuchar cambios en localStorage (cuando se hace login/logout en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        console.log("🔄 Token cambió en localStorage, re-verificando...");
        verificarAutenticacion();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Carga películas según el tipo de usuario
   */
  useEffect(() => {
    if (estaCargando) return;

    const cargarPeliculas = async () => {
      try {
        setError(null);

        if (estaAutenticado) {
          // Usuario autenticado: cargar más películas
          try {
            const respuestaPopulares = await servicioPeliculas.obtenerPopulares(1);
            setPeliculasRecomendadas(respuestaPopulares.results.slice(0, 6));
          } catch (err) {
            console.error("Error al cargar recomendadas:", err);
          }

          try {
            const respuestaAccion = await servicioPeliculas.buscarPorGenero("28"); // Acción
            setPeliculasDestacadas(respuestaAccion.results.slice(0, 4));
          } catch (err) {
            console.error("Error al cargar destacadas:", err);
          }
        } else {
          // Usuario NO autenticado: solo 4 películas destacadas
          try {
            const respuesta = await servicioPeliculas.obtenerPopulares(1);
            setPeliculasDestacadas(respuesta.results.slice(0, 4));
          } catch (err) {
            console.error("Error al cargar destacadas:", err);
          }
        }
      } catch (err: any) {
        console.error("Error al cargar películas:", err);
        setError(err.message || "Error al cargar las películas");
      }
    };

    cargarPeliculas();
  }, [estaAutenticado, estaCargando]);

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
                <div className="home-page__category-icon"></div>
                <span>Acción</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("comedy")}>
                <div className="home-page__category-icon"></div>
                <span>Comedia</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("drama")}>
                <div className="home-page__category-icon"></div>
                <span>Drama</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("science fiction")}>
                <div className="home-page__category-icon"></div>
                <span>Sci-Fi</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("documentary")}>
                <div className="home-page__category-icon"></div>
                <span>Documentales</span>
              </button>
              <button className="home-page__category-card" onClick={() => handleCategoryClick("nature")}>
                <div className="home-page__category-icon"></div>
                <span>Naturaleza</span>
              </button>
            </div>
          </section>

          {/* Películas Recomendadas */}
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
                {peliculasRecomendadas.length > 0 ? (
                  peliculasRecomendadas.map((movie) => (
                    <div key={movie.id} className="home-page__video-card" onClick={() => navigate(`/peliculas`)}>
                      <div className="home-page__video-image">
                        {movie.poster ? (
                          <img src={movie.poster} alt={movie.title} loading="lazy" />
                        ) : (
                          <div className="home-page__no-poster">Sin imagen</div>
                        )}
                        <div className="home-page__video-overlay">
                          <svg className="home-page__play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="home-page__video-id">{movie.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="home-page__no-videos">No hay películas disponibles</p>
                )}
              </div>
            )}
          </section>

          {/* Películas Recientes */}
          <section className="home-page__section">
            <div className="home-page__section-header">
              <h2 className="home-page__section-title">Agregados Recientemente</h2>
            </div>
            <div className="home-page__videos-grid home-page__videos-grid--compact">
              {peliculasDestacadas.map((movie) => (
                <div key={movie.id} className="home-page__video-card" onClick={() => navigate(`/peliculas`)}>
                  <div className="home-page__video-image">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} loading="lazy" />
                    ) : (
                      <div className="home-page__no-poster">Sin imagen</div>
                    )}
                    <div className="home-page__video-overlay">
                      <svg className="home-page__play-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="home-page__video-id">{movie.title}</p>
                </div>
              ))}
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

        {/* Sección de Películas Destacadas */}
        <section className="home-page__featured">
          <h2 className="home-page__featured-title">Destacados</h2>
          
          {error ? (
            <div className="home-page__error"><p>{error}</p></div>
          ) : (
            <div className="home-page__featured-grid">
              {peliculasDestacadas.length > 0 ? (
                peliculasDestacadas.map((movie) => (
                  <div key={movie.id} className="home-page__video-card" onClick={() => navigate(`/peliculas`)}>
                    <div className="home-page__video-image">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} loading="lazy" />
                      ) : (
                        <div className="home-page__no-poster">Sin imagen</div>
                      )}
                      <div className="home-page__video-overlay">
                        <svg className="home-page__play-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="home-page__video-id">{movie.title}</p>
                  </div>
                ))
              ) : (
                <p className="home-page__no-videos">No hay películas disponibles</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;