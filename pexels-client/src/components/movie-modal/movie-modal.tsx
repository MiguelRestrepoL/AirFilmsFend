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
 * Modal que muestra detalles completos de una película.
 * Incluye información de TMDB + video de Pexels si está disponible.
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setError(null);
        
        const data = await servicioPeliculas.obtenerDetalles(movieId);
        setDetails(data);

        // ✅ CORRECCIÓN: Usar videoId de los detalles, NO el movieId
        if (data.videoId) {
          setIsLoadingVideo(true);
          try {
            const videoData = await servicioPeliculas.obtenerVideo(data.videoId);
            setVideo(videoData);
          } catch (err) {
            console.warn("No se pudo cargar el video de Pexels:", err);
            // No es un error crítico, simplemente no hay video
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

  // Cerrar con Escape y bloquear scroll
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
   * Obtiene el archivo de video de mejor calidad disponible
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

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(movieId);
    }
  };

  return (
    <div className="movie-modal" onClick={onClose}>
      <div className="movie-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="movie-modal__close" onClick={onClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
          </svg>
        </button>

        {isLoadingDetails && (
          <div className="movie-modal__loading">
            <div className="movie-modal__spinner"></div>
            <p>Cargando detalles...</p>
          </div>
        )}

        {error && (
          <div className="movie-modal__error">
            <p>{error}</p>
            <button onClick={onClose} className="movie-modal__error-btn">
              Cerrar
            </button>
          </div>
        )}

        {details && (
          <>
            {/* Video o Poster Section */}
            {video && videoFile ? (
              <div className="movie-modal__video-section">
                <video
                  controls
                  autoPlay
                  poster={video.image}
                  className="movie-modal__video"
                >
                  <source src={videoFile.link} type={videoFile.fileType} />
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            ) : isLoadingVideo ? (
              <div className="movie-modal__video-loading">
                <div className="movie-modal__spinner"></div>
                <p>Cargando video...</p>
              </div>
            ) : details.poster ? (
              <div className="movie-modal__poster-section">
                <img 
                  src={details.poster} 
                  alt={details.title}
                  className="movie-modal__poster" 
                />
              </div>
            ) : null}

            {/* Details Section */}
            <div className="movie-modal__details">
              <div className="movie-modal__header">
                <h2 className="movie-modal__title">{details.title}</h2>
                {showFavoriteButton && onToggleFavorite && (
                  <button
                    className={`movie-modal__favorite ${isFavorite ? "movie-modal__favorite--active" : ""}`}
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

              <div className="movie-modal__meta">
                {details.voteAverage > 0 && (
                  <>
                    <span className="movie-modal__rating">
                      ⭐ {details.voteAverage.toFixed(1)}
                    </span>
                    <span className="movie-modal__divider">•</span>
                  </>
                )}
                <span className="movie-modal__year">
                  {new Date(details.releaseDate).getFullYear()}
                </span>
                <span className="movie-modal__divider">•</span>
                <span className="movie-modal__runtime">{details.runtime} min</span>
                <span className="movie-modal__divider">•</span>
                <span className="movie-modal__language">
                  {(details.originalLanguage || "en").toUpperCase()}
                </span>
              </div>

              {details.genres && details.genres.length > 0 && (
                <div className="movie-modal__genres">
                  {details.genres.map((genre) => (
                    <span key={genre.id} className="movie-modal__genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="movie-modal__overview">
                <h3>Sinopsis</h3>
                <p>{details.overview || "No hay sinopsis disponible."}</p>
              </div>

              <div className="movie-modal__info-grid">
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
                    <span className="movie-modal__value">{details.voteCount.toLocaleString()}</span>
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