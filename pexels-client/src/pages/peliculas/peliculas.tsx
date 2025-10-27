import React, { useEffect, useState } from "react";
import SearchBar from "../../components/search-bar/search-bar";
import MovieCard from "../../components/movie-card/movie-card";
import MovieModal from "../../components/movie-modal/movie-modal";
import servicioPeliculas from "../../services/peliculas.servicio";
import { servicioFavoritos } from "../../services/favoritos.servicio";
import type { Movie, MovieFavorite, Genre } from "../../types/movies.types";
import "./peliculas.scss";

/**
 * TMDB genres for filtering
 */
const GENRES: Genre[] = [
  { id: "28", name: "Acción", tmdbId: "28" },
  { id: "35", name: "Comedia", tmdbId: "35" },
  { id: "18", name: "Drama", tmdbId: "18" },
  { id: "878", name: "Ciencia Ficción", tmdbId: "878" },
  { id: "27", name: "Terror", tmdbId: "27" },
  { id: "10749", name: "Romance", tmdbId: "10749" },
  { id: "16", name: "Animación", tmdbId: "16" },
  { id: "53", name: "Thriller", tmdbId: "53" },
  { id: "12", name: "Aventura", tmdbId: "12" },
  { id: "14", name: "Fantasía", tmdbId: "14" },
];

/**
 * Main movies page component with TMDB integration.
 * 
 * Features:
 * - Search movies by name
 * - Filter by genre
 * - Display popular movies
 * - Favorites system (authenticated users only)
 * - Full WCAG 2.1 AA compliance
 * 
 * @component
 * @returns {JSX.Element} The movies page component
 */
const PeliculasPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("popular");
  const [favorites, setFavorites] = useState<MovieFavorite[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showingFavorites, setShowingFavorites] = useState(false);

  /**
   * Verifies user authentication on component mount
   * Listens to authentication changes across browser tabs
   */
  useEffect(() => {
    const verificarAuth = () => {
      const token = localStorage.getItem("authToken");
      console.log("🔍 [PELÍCULAS] Verificando auth:", token ? `✅ Token encontrado: ${token.substring(0, 20)}...` : "❌ Sin token");
      setIsAuthenticated(!!token);
    };

    verificarAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        console.log("🔄 [PELÍCULAS] Token cambió en localStorage");
        verificarAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Loads user favorites when authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  /**
   * Loads popular movies on initial render
   */
  useEffect(() => {
    loadPopularMovies();
  }, []);

  /**
   * Fetches the authenticated user's favorite movies
   * 
   * @async
   * @function loadFavorites
   * @returns {Promise<void>}
   */
  const loadFavorites = async () => {
    try {
      const data = await servicioFavoritos.obtenerFavoritos();
      setFavorites(data);
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      setIsAuthenticated(false);
      setFavorites([]);
    }
  };

  /**
   * Searches for movies by name
   * 
   * @async
   * @function searchMovies
   * @param {string} query - The search query
   * @returns {Promise<void>}
   */
  const searchMovies = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowingFavorites(false);
      
      const response = await servicioPeliculas.buscarPorNombre(query);
      setMovies(response.results);
      setActiveFilter(`search:${query}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches popular movies from TMDB
   * 
   * @async
   * @function loadPopularMovies
   * @returns {Promise<void>}
   */
  const loadPopularMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowingFavorites(false);
      
      const response = await servicioPeliculas.obtenerPopulares(1);
      setMovies(response.results);
      setActiveFilter("popular");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filters movies by genre
   * 
   * @async
   * @function filterByGenre
   * @param {string} genreId - The TMDB genre ID
   * @returns {Promise<void>}
   */
  const filterByGenre = async (genreId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setShowingFavorites(false);
      
      const response = await servicioPeliculas.buscarPorGenero(genreId);
      setMovies(response.results);
      setActiveFilter(genreId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Displays the user's favorite movies with full details
   * Fetches complete movie information for each favorite
   * 
   * @async
   * @function showFavorites
   * @returns {Promise<void>}
   */
  const showFavorites = async () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para ver tus favoritos");
      return;
    }

    setShowingFavorites(true);
    setActiveFilter("favorites");
    setIsLoading(true);
    
    try {
      const favMoviesPromises = favorites.map(async (fav) => {
        try {
          const details = await servicioPeliculas.obtenerDetalles(fav.movieId);
          return {
            id: details.id,
            title: details.title,
            poster: details.poster,
            releaseDate: details.releaseDate
          };
        } catch (error) {
          console.error(`Error cargando detalles de película ${fav.movieId}:`, error);
          return {
            id: fav.movieId,
            title: fav.movieName,
            poster: fav.posterURL || null,
            releaseDate: undefined
          };
        }
      });
      
      const favMovies = await Promise.all(favMoviesPromises);
      setMovies(favMovies);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      alert("Error al cargar los detalles de tus favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles a movie's favorite status
   * Adds or removes a movie from the user's favorites list
   * 
   * @async
   * @function toggleFavorite
   * @param {number} movieId - The TMDB movie ID
   * @returns {Promise<void>}
   */
  const toggleFavorite = async (movieId: number) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    try {
      const isFav = servicioFavoritos.esFavorito(movieId, favorites);

      if (isFav) {
        await servicioFavoritos.eliminarFavorito(movieId);
        setFavorites(favorites.filter(fav => fav.movieId !== movieId));
        
        if (showingFavorites) {
          setMovies(movies.filter(m => m.id !== movieId));
        }
      } else {
        const movie = movies.find(m => m.id === movieId);
        
        if (!movie) {
          console.error("Película no encontrada en la lista actual");
          return;
        }

        const newFavorite = await servicioFavoritos.agregarFavorito({
          movieId: movie.id,
          movieName: movie.title,
          posterURL: movie.poster || ""
        });
        
        setFavorites([...favorites, newFavorite]);
      }
    } catch (err: any) {
      console.error("Error al manejar favorito:", err);
      alert(err.message || "Error al actualizar favoritos");
      
      if (err.message.includes("Sesión expirada") || err.message.includes("Token")) {
        setIsAuthenticated(false);
        setFavorites([]);
      }
    }
  };

  /**
   * Checks if a movie is in the user's favorites
   * 
   * @function isFavorite
   * @param {number} movieId - The TMDB movie ID
   * @returns {boolean} True if the movie is favorited
   */
  const isFavorite = (movieId: number): boolean => {
    return servicioFavoritos.esFavorito(movieId, favorites);
  };

  return (
    <div className="movie-page">
      <div className="movie-page__header">
        <h1 className="movie-page__title">Películas</h1>
        <SearchBar 
          alBuscar={searchMovies} 
          marcadorPosicion="Buscar películas..." 
        />
        
        {/* Authentication notice for non-authenticated users */}
        {!isAuthenticated && (
          <div 
            className="movie-page__auth-notice"
            role="status"
            aria-live="polite"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>Inicia sesión para guardar tus películas favoritas</span>
          </div>
        )}
      </div>

      <div className="movie-page__container">
        {/* Genre filters */}
        <nav 
          className="movie-page__filters" 
          role="navigation" 
          aria-label="Filtros de películas"
        >
          <button
            className={`movie-page__filter ${activeFilter === "popular" ? "movie-page__filter--active" : ""}`}
            onClick={loadPopularMovies}
            aria-pressed={activeFilter === "popular"}
            aria-label="Mostrar películas populares"
          >
            Populares
          </button>
          
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              className={`movie-page__filter ${activeFilter === genre.tmdbId ? "movie-page__filter--active" : ""}`}
              onClick={() => filterByGenre(genre.tmdbId)}
              aria-pressed={activeFilter === genre.tmdbId}
              aria-label={`Filtrar por género ${genre.name}`}
            >
              {genre.name}
            </button>
          ))}

          {/* Favorites button - visible only when authenticated */}
          {isAuthenticated && (
            <button
              className={`movie-page__filter movie-page__filter--favorites ${activeFilter === "favorites" ? "movie-page__filter--active" : ""}`}
              onClick={showFavorites}
              aria-pressed={activeFilter === "favorites"}
              aria-label={`Mostrar mis favoritos${favorites.length > 0 ? `, ${favorites.length} películas` : ''}`}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill={activeFilter === "favorites" ? "currentColor" : "none"} 
                stroke="currentColor"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
                aria-hidden="true"
                focusable="false"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>
                Mis Favoritos {favorites.length > 0 && `(${favorites.length})`}
              </span>
            </button>
          )}
        </nav>

        {/* Error message */}
        {error && (
          <div 
            className="movie-page__error" 
            role="alert"
            aria-live="assertive"
          >
            <p>{error}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div 
            className="movie-page__loading"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div 
              className="movie-page__spinner"
              aria-hidden="true"
            ></div>
            <p>Cargando películas...</p>
          </div>
        ) : (
          <div 
            className="movie-page__grid"
            role="region"
            aria-label="Resultados de películas"
          >
            {movies.length === 0 ? (
              <div 
                className="movie-page__empty"
                role="status"
                aria-live="polite"
              >
                {showingFavorites ? (
                  <p>No tienes películas favoritas aún. ¡Agrega algunas con la estrella! ⭐</p>
                ) : (
                  <p>No se encontraron películas.</p>
                )}
              </div>
            ) : (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => setSelectedMovieId(movie.id)}
                  showFavoriteButton={isAuthenticated}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Movie details modal */}
      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          isFavorite={isFavorite(selectedMovieId)}
          onToggleFavorite={toggleFavorite}
          showFavoriteButton={isAuthenticated}
        />
      )}
    </div>
  );
};

export default PeliculasPage;