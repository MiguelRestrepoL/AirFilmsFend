import React, { useEffect, useState } from "react";
import servicioPeliculas from "../../services/peliculas.servicio";
import type { MovieDetails, PexelsVideo } from "../../types/movies.types";
import "./movie-modal.scss";

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movieId: number) => void;
  showFavoriteButton?: boolean;
}

/**
 * Modal component displaying complete movie details.
 * 
 * Features:
 * - TMDB movie information
 * - Pexels video integration (if available)
 * - Favorites toggle functionality
 * - Keyboard navigation (ESC to close)
 * - Full WCAG 2.1 AA compliance
 * 
 * @component
 * @param {MovieModalProps} props - Component props
 * @returns {JSX.Element} Movie details modal
 */
const MovieModal: React.FC<MovieModalProps> = ({ 
  movieId, 
  onClose,
  isFavorite = false,
  onToggleFavorite,
  showFavoriteButton = false
}) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [video, setVideo] = useState<PexelsVideo | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches movie details and associated video on mount
   */
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setError(null);
        
        const data = await servicioPeliculas.obtenerDetalles(movieId);
        setDetails(data);

        if (data.videoId) {
          setIsLoadingVideo(true);
          try {
            const videoData = await servicioPeliculas.obtenerVideo(data.videoId);
            setVideo(videoData);
          } catch (err) {
            console.warn("No se pudo cargar el video de Pexels:", err);
          } finally {
            setIsLoadingVideo(false);
          }
        }
      } catch (err: any) {
        console.error("Error al cargar detalles:", err);
        setError(err.message || "Error al cargar la película");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  /**
   * Handles ESC key press and body scroll lock
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  /**
   * Returns the best quality video file available
   * 
   * @function getBestVideoQuality
   * @returns {Object|null} Video file object or null
   */
  const getBestVideoQuality = () => {
    if (!video?.videoFiles || video.videoFiles.length === 0) return null;
    
    const qualities = ["hd", "sd", "hls"];
    for (const quality of qualities) {
      const file = video.videoFiles.find(f => f.quality === quality);
      if (file) return file;
    }
    
    return video.videoFiles[0];
  };

  const videoFile = video ? getBestVideoQuality() : null;

  /**
   * Handles favorite toggle button click
   * 
   * @function handleFavoriteClick
   */
  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(movieId);
    }
  };

  return (
    <div 
      className="movie-modal" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={details ? "modal-title" : undefined}
      aria-describedby={details ? "modal-description" : undefined}
    >
      <div 
        className="movie-modal__content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="movie-modal__close" 
          onClick={onClose} 
          aria-label="Cerrar modal de detalles de película"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
          </svg>
        </button>

        {isLoadingDetails && (
          <div 
            className="movie-modal__loading"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div 
              className="movie-modal__spinner"
              aria-hidden="true"
            ></div>
            <p>Cargando detalles...</p>
          </div>
        )}

        {error && (
          <div 
            className="movie-modal__error"
            role="alert"
            aria-live="assertive"
          >
            <p>{error}</p>
            <button 
              onClick={onClose} 
              className="movie-modal__error-btn"
              aria-label="Cerrar y volver a películas"
            >
              Cerrar
            </button>
          </div>
        )}

        {details && (
          <>
            {/* Video or Poster Section */}
            {video && videoFile ? (
              <div className="movie-modal__video-section">
                <video
                  controls
                  autoPlay
                  poster={video.image}
                  className="movie-modal__video"
                  aria-label={`Video de ${details.title}`}
                >
                  <source src={videoFile.link} type={videoFile.fileType} />
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            ) : isLoadingVideo ? (
              <div 
                className="movie-modal__video-loading"
                role="status"
                aria-live="polite"
              >
                <div 
                  className="movie-modal__spinner"
                  aria-hidden="true"
                ></div>
                <p className="sr-only">Cargando video...</p>
              </div>
            ) : details.poster ? (
              <div className="movie-modal__poster-section">
                <img 
                  src={details.poster} 
                  alt={`Póster de ${details.title}`}
                  className="movie-modal__poster" 
                />
              </div>
            ) : null}

            {/* Details Section */}
            <div className="movie-modal__details">
              <div className="movie-modal__header">
                <h2 
                  className="movie-modal__title"
                  id="modal-title"
                >
                  {details.title}
                </h2>
                {showFavoriteButton && onToggleFavorite && (
                  <button
                    className={`movie-modal__favorite ${isFavorite ? "movie-modal__favorite--active" : ""}`}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    aria-pressed={isFavorite}
                    title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill={isFavorite ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      strokeWidth="2"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                )}
              </div>

              <div 
                className="movie-modal__meta"
                aria-label="Información de la película"
              >
                {details.voteAverage > 0 && (
                  <>
                    <span className="movie-modal__rating">
                      <span aria-hidden="true">⭐</span>
                      <span className="sr-only">Calificación:</span>
                      {details.voteAverage.toFixed(1)}
                    </span>
                    <span className="movie-modal__divider" aria-hidden="true">•</span>
                  </>
                )}
                <span className="movie-modal__year">
                  <span className="sr-only">Año:</span>
                  {new Date(details.releaseDate).getFullYear()}
                </span>
                <span className="movie-modal__divider" aria-hidden="true">•</span>
                <span className="movie-modal__runtime">
                  <span className="sr-only">Duración:</span>
                  {details.runtime} min
                </span>
                <span className="movie-modal__divider" aria-hidden="true">•</span>
                <span className="movie-modal__language">
                  <span className="sr-only">Idioma original:</span>
                  {(details.originalLanguage || "en").toUpperCase()}
                </span>
              </div>

              {details.genres && details.genres.length > 0 && (
                <div 
                  className="movie-modal__genres"
                  role="list"
                  aria-label="Géneros de la película"
                >
                  {details.genres.map((genre) => (
                    <span 
                      key={genre.id} 
                      className="movie-modal__genre"
                      role="listitem"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="movie-modal__overview">
                <h3>Sinopsis</h3>
                <p id="modal-description">
                  {details.overview || "No hay sinopsis disponible."}
                </p>
              </div>

              <div 
                className="movie-modal__info-grid"
                role="region"
                aria-label="Información adicional"
              >
                <div className="movie-modal__info-item">
                  <span className="movie-modal__label">Estado</span>
                  <span className="movie-modal__value">{details.status}</span>
                </div>
                <div className="movie-modal__info-item">
                  <span className="movie-modal__label">Fecha de estreno</span>
                  <span className="movie-modal__value">
                    {new Date(details.releaseDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {details.voteCount > 0 && (
                  <div className="movie-modal__info-item">
                    <span className="movie-modal__label">Votos</span>
                    <span className="movie-modal__value">
                      {details.voteCount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;