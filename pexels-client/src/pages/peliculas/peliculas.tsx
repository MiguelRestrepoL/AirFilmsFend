import React, { useEffect, useState } from "react";
import SearchBar from "../../components/search-bar/search-bar";
import MovieCard from "../../components/movie-card/movie-card";
import MovieModal from "../../components/movie-modal/movie-modal";
import servicioPeliculas from "../../services/peliculas.servicio";
import servicioFavoritos from "../../services/favoritos.servicio.ts";
import type { Movie, MovieFavorite, Genre } from "../../types/movies.types";
import "./peliculas.scss";

/**
 * Géneros de TMDB para filtrado
 */
const GENRES: Genre[] = [
  { id: "28", name: "Acción", tmdbId: "28" },
  { id: "35", name: "Comedia", tmdbId: "35" },
  { id: "18", name: "Drama", tmdbId: "18" },
  { id: "878", name: "Ciencia Ficción", tmdbId: "878" },
  { id: "27", name: "Terror", tmdbId: "27" },
  { id: "10749", name: "Romance", tmdbId: "10749" },
  { id: "16", name: "Animación", tmdbId: "16" },
];

/**
 * Página principal de películas con TMDB.
 * Funcionalidades:
 * - Búsqueda por nombre
 * - Filtrado por género
 * - Películas populares
 * - Sistema de favoritos (solo usuarios autenticados)
 */
const PeliculasPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("popular");
  const [favorites, setFavorites] = useState<MovieFavorite[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem("airfilms_token");
    setIsAuthenticated(!!token);

    if (token) {
      loadFavorites();
    }
  }, []);

  /**
   * Carga los favoritos del usuario autenticado
   */
  const loadFavorites = async () => {
    try {
      const data = await servicioFavoritos.obtenerFavoritos();
      setFavorites(data);
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
    }
  };

  /**
   * Carga películas populares al iniciar
   */
  useEffect(() => {
    loadPopularMovies();
  }, []);

  /**
   * Busca películas por nombre
   */
  const searchMovies = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await servicioPeliculas.buscarPorNombre(query);
      setMovies(response.results);
      setActiveFilter(query);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga películas populares
   */
  const loadPopularMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
   * Filtra películas por género
   */
  const filterByGenre = async (genreId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
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
   * Alterna el estado de favorito de una película
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
      } else {
        const newFavorite = await servicioFavoritos.agregarFavorito(movieId);
        setFavorites([...favorites, newFavorite]);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  /**
   * Verifica si una película está en favoritos
   */
  const isFavorite = (movieId: number): boolean => {
    return servicioFavoritos.esFavorito(movieId, favorites);
  };

  return (
    <div className="movie-page">
      <div className="movie-page__header">
        <h1 className="movie-page__title">Películas</h1>
        <SearchBar alBuscar={searchMovies} marcadorPosicion="Buscar películas..." />
      </div>

      <div className="movie-page__container">
        {/* Filtros de género */}
        <div className="movie-page__filters">
          <button
            className={`movie-page__filter ${activeFilter === "popular" ? "movie-page__filter--active" : ""}`}
            onClick={loadPopularMovies}
          >
            Populares
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              className={`movie-page__filter ${activeFilter === genre.tmdbId ? "movie-page__filter--active" : ""}`}
              onClick={() => filterByGenre(genre.tmdbId)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="movie-page__error">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="movie-page__loading">
            <div className="movie-page__spinner"></div>
            <p>Cargando películas...</p>
          </div>
        ) : (
          <div className="movie-page__grid">
            {movies.length === 0 ? (
              <div className="movie-page__empty">
                <p>No se encontraron películas.</p>
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