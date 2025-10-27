import React from "react";
import type { Movie } from "../../types/movies.types";
import "./movie-card.scss";

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  onClick: () => void;
  showFavoriteButton?: boolean;
}

/**
 * Movie card component with poster and favorite button.
 * 
 * Features:
 * - Displays TMDB movie poster and information
 * - Favorite toggle functionality (authenticated users only)
 * - Keyboard accessible
 * - Full WCAG 2.1 AA compliance
 * 
 * @component
 * @param {MovieCardProps} props - Component props
 * @returns {JSX.Element} Movie card with interactive elements
 */
const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  isFavorite = false,
  onToggleFavorite,
  onClick,
  showFavoriteButton = false
}) => {
  /**
   * Handles favorite button click and prevents event propagation
   * 
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie.id);
    }
  };

  /**
   * Handles keyboard interaction for card activation
   * 
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article 
      className="movie-card" 
      onClick={onClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${movie.title}${movie.releaseDate ? `, ${new Date(movie.releaseDate).getFullYear()}` : ''}`}
    >
      {/* Favorite button (authenticated users only) */}
      {showFavoriteButton && onToggleFavorite && (
        <button
          className={`movie-card__favorite ${isFavorite ? "movie-card__favorite--active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Quitar ${movie.title} de favoritos` : `Agregar ${movie.title} a favoritos`}
          aria-pressed={isFavorite}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}

      <div className="movie-card__image-container">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`Póster de ${movie.title}`}
            className="movie-card__image"
            loading="lazy"
          />
        ) : (
          <div 
            className="movie-card__no-poster"
            role="img"
            aria-label="Imagen no disponible"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Sin póster</span>
          </div>
        )}
        
        <div 
          className="movie-card__overlay"
          aria-hidden="true"
        >
          <svg 
            className="movie-card__play-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            focusable="false"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        {movie.releaseDate && !isNaN(new Date(movie.releaseDate).getTime()) && (
          <p className="movie-card__year">
            {new Date(movie.releaseDate).getFullYear()}
          </p>
        )}
      </div>
    </article>
  );
};

export default MovieCard;