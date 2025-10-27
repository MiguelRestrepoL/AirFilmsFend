import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import servicioPeliculas from "../../services/peliculas.servicio";
import type { Movie } from "../../types/movies.types";
import "./home.scss";

/**
 * Home page component that displays different views based on authentication status.
 * 
 * Features:
 * - Unauthenticated users: Public basic view with limited content
 * - Authenticated users: Personalized view with recommendations
 * - Dynamic content loading based on user state
 * - Responsive design for all screen sizes
 * 
 * @component
 * @returns {JSX.Element} Conditional home view based on authentication
 * 
 * @example
 * ```tsx
 * <HomePage />
 * ```
 * 
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
   * Verifies user authentication and loads user data.
   * Checks for valid JWT token and fetches user profile.
   * Listens for storage changes to sync authentication across tabs.
   * 
   * @async
   */
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        console.log("🔍 Verificando token:", token ? "✅ Token encontrado" : "❌ No hay token");
        
        if (token) {
          setEstaAutenticado(true);
          
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
   * Loads movies based on user type.
   * Authenticated users get more content and recommendations.
   * Unauthenticated users get limited featured content.
   * 
   * @async
   */
  useEffect(() => {
    if (estaCargando) return;

    const cargarPeliculas = async () => {
      try {
        setError(null);

        if (estaAutenticado) {
          try {
            const respuestaPopulares = await servicioPeliculas.obtenerPopulares(1);
            setPeliculasRecomendadas(respuestaPopulares.results.slice(0, 6));
          } catch (err) {
            console.error("Error al cargar recomendadas:", err);
          }

          try {
            const respuestaAccion = await servicioPeliculas.buscarPorGenero("28");
            setPeliculasDestacadas(respuestaAccion.results.slice(0, 4));
          } catch (err) {
            console.error("Error al cargar destacadas:", err);
          }
        } else {
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
   * Navigates to movies page with category filter.
   * 
   * @param {string} category - Category name to filter by
   */
  const handleCategoryClick = (category: string) => {
    navigate(`/peliculas?categoria=${encodeURIComponent(category)}`);
  };

  if (estaCargando) {
    return (
      <div 
        className="home-page__loading-screen"
        role="status"
        aria-live="polite"
        aria-label="Loading content"
      >
        <div 
          className="home-page__spinner"
          aria-hidden="true"
        ></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // ============================================
  // AUTHENTICATED USER VIEW
  // ============================================
  if (estaAutenticado && usuario) {
    return (
      <div className="home-page home-page--protected">
        <section 
          className="home-page__hero home-page__hero--protected"
          aria-labelledby="welcome-heading"
        >
          <div className="home-page__hero-content">
            <div className="home-page__welcome">
              <h1 
                id="welcome-heading"
                className="home-page__hero-title"
              >
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
                aria-label="Explore all available movies"
              >
                Explorar Películas
              </button>
            </div>
          </div>
        </section>

        <main className="home-page__content">
          <section 
            className="home-page__quick-categories"
            aria-labelledby="categories-heading"
          >
            <h2 
              id="categories-heading"
              className="home-page__section-title"
            >
              Explorar por Categoría
            </h2>
            <div 
              className="home-page__categories-scroll"
              role="list"
              aria-label="Movie categories"
            >
              <button 
                className="home-page__category-card"
                onClick={() => handleCategoryClick("action")}
                aria-label="Browse action movies"
                role="listitem"
              >
                <div className="home-page__category-icon" aria-hidden="true"></div>
                <span>Acción</span>
              </button>
              <button 
                className="home-page__category-card"
                onClick={() => handleCategoryClick("comedy")}
                aria-label="Browse comedy movies"
                role="listitem"
              >
                <div className="home-page__category-icon" aria-hidden="true"></div>
                <span>Comedia</span>
              </button>
              <button 
                className="home-page__category-card"
                onClick={() => handleCategoryClick("drama")}
                aria-label="Browse drama movies"
                role="listitem"
              >
                <div className="home-page__category-icon" aria-hidden="true"></div>
                <span>Drama</span>
              </button>
              <button 
                className="home-page__category-card"
                onClick={() => handleCategoryClick("science fiction")}
                aria-label="Browse science fiction movies"
                role="listitem"
              >
                <div className="home-page__category-icon" aria-hidden="true"></div>
                <span>Sci-Fi</span>
              </button>
              <button 
                className="home-page__category-card"
                onClick={() => handleCategoryClick("documentary")}
                aria-label="Browse documentary movies"
                role="listitem"
              >
                <div className="home-page__category-icon" aria-hidden="true"></div>
                <span>Documentales</span>
              </button>
              <button 
                className="home-page__category-card"
                onClick={() => handleCategoryClick("nature")}
                aria-label="Browse nature movies"
                role="listitem"
              >
                <div className="home-page__category-icon" aria-hidden="true"></div>
                <span>Naturaleza</span>
              </button>
            </div>
          </section>

          <section 
            className="home-page__section"
            aria-labelledby="recommended-heading"
          >
            <div className="home-page__section-header">
              <h2 
                id="recommended-heading"
                className="home-page__section-title"
              >
                Recomendados para Ti
              </h2>
              <button 
                className="home-page__see-all"
                onClick={() => navigate("/peliculas")}
                aria-label="View all recommended movies"
              >
                Ver todos →
              </button>
            </div>
            
            {error ? (
              <div 
                className="home-page__error"
                role="alert"
                aria-live="assertive"
              >
                <p>{error}</p>
              </div>
            ) : (
              <div 
                className="home-page__videos-grid"
                role="list"
                aria-label="Recommended movies"
              >
                {peliculasRecomendadas.length > 0 ? (
                  peliculasRecomendadas.map((movie) => (
                    <article 
                      key={movie.id}
                      className="home-page__video-card"
                      onClick={() => navigate(`/peliculas`)}
                      role="listitem"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/peliculas`);
                        }
                      }}
                      aria-label={`View ${movie.title}`}
                    >
                      <div className="home-page__video-image">
                        {movie.poster ? (
                          <img 
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            loading="lazy"
                          />
                        ) : (
                          <div 
                            className="home-page__no-poster"
                            role="img"
                            aria-label="No poster available"
                          >
                            Sin imagen
                          </div>
                        )}
                        <div 
                          className="home-page__video-overlay"
                          aria-hidden="true"
                        >
                          <svg 
                            className="home-page__play-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="home-page__video-id">{movie.title}</p>
                    </article>
                  ))
                ) : (
                  <p className="home-page__no-videos">No hay películas disponibles</p>
                )}
              </div>
            )}
          </section>

          <section 
            className="home-page__section"
            aria-labelledby="recent-heading"
          >
            <div className="home-page__section-header">
              <h2 
                id="recent-heading"
                className="home-page__section-title"
              >
                Agregados Recientemente
              </h2>
            </div>
            <div 
              className="home-page__videos-grid home-page__videos-grid--compact"
              role="list"
              aria-label="Recently added movies"
            >
              {peliculasDestacadas.map((movie) => (
                <article 
                  key={movie.id}
                  className="home-page__video-card"
                  onClick={() => navigate(`/peliculas`)}
                  role="listitem"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/peliculas`);
                    }
                  }}
                  aria-label={`View ${movie.title}`}
                >
                  <div className="home-page__video-image">
                    {movie.poster ? (
                      <img 
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        loading="lazy"
                      />
                    ) : (
                      <div 
                        className="home-page__no-poster"
                        role="img"
                        aria-label="No poster available"
                      >
                        Sin imagen
                      </div>
                    )}
                    <div 
                      className="home-page__video-overlay"
                      aria-hidden="true"
                    >
                      <svg 
                        className="home-page__play-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="home-page__video-id">{movie.title}</p>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ============================================
  // UNAUTHENTICATED USER VIEW
  // ============================================
  return (
    <div className="home-page">
      <section 
        className="home-page__hero"
        aria-labelledby="hero-heading"
      >
        <div className="home-page__hero-content">
          <h1 
            id="hero-heading"
            className="home-page__hero-title"
          >
            AirFilms
          </h1>
          <p className="home-page__hero-subtitle">
            Descubre películas y videos increíbles
          </p>
          <button 
            className="home-page__hero-cta"
            onClick={() => navigate("/peliculas")}
            aria-label="Start exploring movies now"
          >
            Explorar Ahora
          </button>
        </div>
      </section>

      <main className="home-page__content">
        <section 
          className="home-page__categories-section"
          aria-labelledby="categories-public-heading"
        >
          <h2 
            id="categories-public-heading"
            className="home-page__categories-title"
          >
            Categorías
          </h2>
          <nav 
            className="home-page__categories-grid"
            aria-label="Movie categories"
          >
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("action")}
              aria-label="Browse action movies"
            >
              Acción
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("comedy")}
              aria-label="Browse comedy movies"
            >
              Comedia
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("drama")}
              aria-label="Browse drama movies"
            >
              Drama
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("science fiction")}
              aria-label="Browse science fiction movies"
            >
              Ciencia Ficción
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("documentary")}
              aria-label="Browse documentary movies"
            >
              Documentales
            </button>
            <button 
              className="home-page__category-btn"
              onClick={() => handleCategoryClick("nature")}
              aria-label="Browse nature movies"
            >
              Naturaleza
            </button>
          </nav>
        </section>

        <section 
          className="home-page__featured"
          aria-labelledby="featured-heading"
        >
          <h2 
            id="featured-heading"
            className="home-page__featured-title"
          >
            Destacados
          </h2>
          
          {error ? (
            <div 
              className="home-page__error"
              role="alert"
              aria-live="assertive"
            >
              <p>{error}</p>
            </div>
          ) : (
            <div 
              className="home-page__featured-grid"
              role="list"
              aria-label="Featured movies"
            >
              {peliculasDestacadas.length > 0 ? (
                peliculasDestacadas.map((movie) => (
                  <article 
                    key={movie.id}
                    className="home-page__video-card"
                    onClick={() => navigate(`/peliculas`)}
                    role="listitem"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/peliculas`);
                      }
                    }}
                    aria-label={`View ${movie.title}`}
                  >
                    <div className="home-page__video-image">
                      {movie.poster ? (
                        <img 
                          src={movie.poster}
                          alt={`${movie.title} poster`}
                          loading="lazy"
                        />
                      ) : (
                        <div 
                          className="home-page__no-poster"
                          role="img"
                          aria-label="No poster available"
                        >
                          Sin imagen
                        </div>
                      )}
                      <div 
                        className="home-page__video-overlay"
                        aria-hidden="true"
                      >
                        <svg 
                          className="home-page__play-icon"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <p className="home-page__video-id">{movie.title}</p>
                  </article>
                ))
              ) : (
                <p className="home-page__no-videos">No hay películas disponibles</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;