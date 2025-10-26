import React from "react";
import type { Movie } from "../../types/movies.types";
import "./movie-card.scss";

/**
 * Propiedades para el componente MovieCard.
 */
interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  showFavoriteButton?: boolean;
}

/**
 * Tarjeta que muestra el póster de una película.
 * Al hacer clic, ejecuta la función proporcionada para mostrar los detalles completos.
 * 
 * @component
 * @param {MovieCardProps} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta clickeable con póster de la película
 */
const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick, 
  isFavorite = false,
  onToggleFavorite,
  showFavoriteButton = false
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal
    if (onToggleFavorite) {
      onToggleFavorite(movie.id);
    }
  };

  return (
    <article className="movie-card" onClick={onClick}>
      <div className="movie-card__image-container">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-card__image"
            loading="lazy"
          />
        ) : (
          <div className="movie-card__no-image">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
            </svg>
            <span>Sin imagen</span>
          </div>
        )}
        
        <div className="movie-card__overlay">
          <svg 
            className="movie-card__play-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Botón de favorito */}
        {showFavoriteButton && onToggleFavorite && (
          <button
            className={`movie-card__favorite ${isFavorite ? "movie-card__favorite--active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        {movie.releaseDate && (
          <p className="movie-card__year">
            {new Date(movie.releaseDate).getFullYear()}
          </p>
        )}
      </div>
    </article>
  );
};

export default MovieCard;