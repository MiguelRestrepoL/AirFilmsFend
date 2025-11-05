import React, { useEffect, useState } from "react";
import { servicioRatings } from "../../services/ratings.servicio";
import { servicioComentarios, type MovieComment } from "../../services/comments.servicio";
import type { MovieRatingStats } from "../../types/movies.types";
import "./rating-modal.scss";

/**
 * Props for the RatingModal component
 * @interface RatingModalProps
 * @property {number} movieId - Unique identifier for the movie
 * @property {string} movieTitle - Title of the movie to display
 * @property {Function} onClose - Callback function to close the modal
 * @property {Function} [onRatingChange] - Optional callback triggered when rating changes
 */
interface RatingModalProps {
  movieId: number;
  movieTitle: string;
  onClose: () => void;
  onRatingChange?: () => void;
}

/**
 * Rating Modal Component with Comments
 * 
 * Interactive modal for rating movies and viewing/posting comments.
 * Shows rating distribution, comments section with pagination.
 * 
 * Features:
 * - Interactive 5-star rating system
 * - Real-time rating statistics
 * - Distribution visualization (bar chart)
 * - Comments section with CRUD operations
 * - Pagination for comments
 * - Full WCAG 2.1 AA compliance
 * 
 * @component
 * @param {RatingModalProps} props - Component props
 * @returns {JSX.Element} Rating modal overlay
 * 
 * @example
 * ```tsx
 * <RatingModal
 *   movieId={123}
 *   movieTitle="The Matrix"
 *   onClose={() => setShowModal(false)}
 *   onRatingChange={() => refreshMovieData()}
 * />
 * ```
 */
const RatingModal: React.FC<RatingModalProps> = ({
  movieId,
  movieTitle,
  onClose,
  onRatingChange,
}) => {
  // Statistics and comments state
  const [stats, setStats] = useState<MovieRatingStats | null>(null);
  const [comments, setComments] = useState<MovieComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Rating interaction state
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  // Comment form state
  const [newComment, setNewComment] = useState("");
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  /** Number of comments to display per page */
  const COMMENTS_PER_PAGE = 5;

  /**
   * Fetches rating statistics, comments, and current user ID on component mount
   * Runs once when the component is first rendered
   * 
   * @effect
   * @dependencies [movieId]
   */
  useEffect(() => {
    loadStats();
    loadComments();
    loadCurrentUserId();
  }, [movieId]);

  /**
   * Reloads comments when the current page changes
   * Ensures the correct page of comments is displayed
   * 
   * @effect
   * @dependencies [currentPage]
   */
  useEffect(() => {
    loadComments();
  }, [currentPage]);

  /**
   * Handles ESC key press to close modal and manages body scroll lock
   * Prevents background scrolling when modal is open
   * Cleans up event listeners and restores scroll on unmount
   * 
   * @effect
   * @dependencies [onClose]
   */
  useEffect(() => {
    /**
     * Handles keyboard events for modal accessibility
     * @param {KeyboardEvent} e - Keyboard event object
     */
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
   * Loads current user ID from JWT authentication token
   * Decodes the JWT payload to extract user identification
   * Handles missing or invalid tokens gracefully
   * 
   * @function
   * @returns {void}
   */
  const loadCurrentUserId = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("❌ No hay token de autenticación");
        return;
      }

      // Decode JWT (payload is in the second part)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId || payload.sub || payload.id;
      
      console.log("👤 Usuario actual:", userId);
      setCurrentUserId(userId);
    } catch (error) {
      console.error("Error al obtener userId del token:", error);
    }
  };

  /**
   * Loads rating statistics from the backend API
   * Fetches aggregate rating data including distribution and averages
   * Updates component state with loading and error handling
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   * @throws {Error} When the API request fails
   */
  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await servicioRatings.obtenerEstadisticas(movieId);
      setStats(data);
    } catch (err: any) {
      console.error("Error al cargar estadísticas:", err);
      setError(err.message || "Error al cargar estadísticas de calificación");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Loads comments from the backend API with pagination
   * Fetches a paginated list of user comments for the movie
   * Updates comments list and total count
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   * @throws {Error} When the API request fails
   */
  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const data = await servicioComentarios.obtenerComentarios(
        movieId,
        currentPage,
        COMMENTS_PER_PAGE
      );
      console.log("📝 Comentarios cargados:", data.data.map(c => ({ 
        id: c.id, 
        userId: c.userId,
        type: typeof c.id, 
        author: c.users[0]?.name 
      })));
      setComments(data.data);
      setCommentsCount(data.count);
    } catch (err: any) {
      console.error("Error al cargar comentarios:", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  /**
   * Submits user rating to the backend API
   * Validates that a rating has been selected before submitting
   * Reloads statistics and closes modal on success
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   * @throws {Error} When the rating submission fails
   */
  const handleSubmit = async () => {
    if (selectedRating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await servicioRatings.calificar(movieId, selectedRating);
      
      await loadStats();
      
      if (onRatingChange) {
        onRatingChange();
      }

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Error al guardar calificación:", err);
      setError(err.message || "Error al guardar calificación");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Deletes the user's existing rating
   * Prompts for confirmation before deletion
   * Reloads statistics and resets rating selection on success
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   * @throws {Error} When the rating deletion fails
   */
  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu calificación?")) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await servicioRatings.eliminarCalificacion(movieId);
      
      await loadStats();
      setSelectedRating(0);
      
      if (onRatingChange) {
        onRatingChange();
      }

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Error al eliminar calificación:", err);
      setError(err.message || "Error al eliminar calificación");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Submits a new comment to the backend API
   * Validates that comment text is not empty before submission
   * Resets form and reloads comments on success
   * 
   * @async
   * @function
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>}
   * @throws {Error} When the comment submission fails
   */
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await servicioComentarios.crearComentario(movieId, newComment);
      
      setNewComment("");
      setCurrentPage(1);
      await loadComments();
    } catch (err: any) {
      console.error("Error al crear comentario:", err);
      setError(err.message || "Error al crear comentario");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Deletes a specific comment from the backend
   * Only allows deletion if the current user is the comment owner
   * Prompts for confirmation before deletion
   * 
   * @async
   * @function
   * @param {string | number} commentId - Unique identifier of the comment to delete
   * @returns {Promise<void>}
   * @throws {Error} When the comment deletion fails
   */
  const handleCommentDelete = async (commentId: string | number) => {
    // Convert to string regardless of type
    const commentIdStr = String(commentId);
    
    console.log("🔍 Intentando eliminar comentario:", {
      commentId: commentIdStr,
      movieId,
      type: typeof commentIdStr,
      length: commentIdStr.length
    });

    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await servicioComentarios.eliminarComentario(commentIdStr, movieId);
      await loadComments();
    } catch (err: any) {
      console.error("Error al eliminar comentario:", err);
      setError(err.message || "Error al eliminar comentario");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Calculates percentage for rating distribution bar chart
   * Returns 0 if no ratings exist to prevent division by zero
   * 
   * @function
   * @param {number} count - Number of ratings for a specific star value
   * @returns {number} Percentage rounded to nearest integer (0-100)
   * 
   * @example
   * ```typescript
   * getPercentage(15) // Returns 30 if totalCount is 50
   * ```
   */
  const getPercentage = (count: number): number => {
    if (!stats || stats.totalCount === 0) return 0;
    return Math.round((count / stats.totalCount) * 100);
  };

  /** Calculated average rating from statistics */
  const averageRating = stats ? servicioRatings.calcularPromedio(stats) : 0;
  
  /** Total number of pages for comment pagination */
  const totalPages = Math.ceil(commentsCount / COMMENTS_PER_PAGE);

  return (
    <div
      className="rating-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div
        className="rating-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="rating-modal__close"
          onClick={onClose}
          aria-label="Cerrar modal de calificación"
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

        <div className="rating-modal__header">
          <h2 id="rating-modal-title" className="rating-modal__title">
            Calificar Película
          </h2>
          <p className="rating-modal__movie-title">{movieTitle}</p>
        </div>

        {isLoading ? (
          <div className="rating-modal__loading" role="status" aria-live="polite">
            <div className="rating-modal__spinner" aria-hidden="true"></div>
            <p>Cargando estadísticas...</p>
          </div>
        ) : error && !stats ? (
          <div className="rating-modal__error" role="alert">
            <p>{error}</p>
            <button onClick={loadStats} className="rating-modal__retry-btn">
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {/* Current Statistics */}
            {stats && stats.totalCount > 0 && (
              <div className="rating-modal__stats">
                <div className="rating-modal__average">
                  <span className="rating-modal__average-number">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="rating-modal__average-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        viewBox="0 0 24 24"
                        fill={star <= Math.round(averageRating) ? "#ffc107" : "none"}
                        stroke="#ffc107"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="rating-modal__total">
                    {stats.totalCount} {stats.totalCount === 1 ? "calificación" : "calificaciones"}
                  </span>
                </div>

                {/* Distribution Bars */}
                <div className="rating-modal__distribution">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="rating-modal__bar-row">
                      <span className="rating-modal__bar-label">{star}★</span>
                      <div className="rating-modal__bar-container">
                        <div
                          className="rating-modal__bar-fill"
                          style={{ width: `${getPercentage(stats.distribution[star - 1])}%` }}
                          role="progressbar"
                          aria-valuenow={stats.distribution[star - 1]}
                          aria-valuemin={0}
                          aria-valuemax={stats.totalCount}
                          aria-label={`${star} estrellas: ${stats.distribution[star - 1]} calificaciones`}
                        ></div>
                      </div>
                      <span className="rating-modal__bar-count">
                        {stats.distribution[star - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats && stats.totalCount === 0 && (
              <div className="rating-modal__no-ratings">
                <p>Sé el primero en calificar esta película</p>
              </div>
            )}

            {/* Comments Section */}
            <div className="rating-modal__comments-section">
              <h3 className="rating-modal__comments-title">
                Comentarios ({commentsCount})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="rating-modal__comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario sobre esta película..."
                  className="rating-modal__comment-textarea"
                  rows={3}
                  maxLength={500}
                  disabled={isSaving}
                  aria-label="Escribe tu comentario"
                />
                <div className="rating-modal__comment-form-footer">
                  <span className="rating-modal__char-count">
                    {newComment.length}/500
                  </span>
                  <button
                    type="submit"
                    className="rating-modal__btn rating-modal__btn--comment"
                    disabled={isSaving || !newComment.trim()}
                  >
                    {isSaving ? "Publicando..." : "Publicar Comentario"}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="rating-modal__comments-list">
                {isLoadingComments ? (
                  <div className="rating-modal__loading-comments">
                    <div className="rating-modal__spinner" aria-hidden="true"></div>
                    <p>Cargando comentarios...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="rating-modal__no-comments">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="rating-modal__comment">
                      <div className="rating-modal__comment-header">
                        <span className="rating-modal__comment-author">
                          {comment.users[0]?.name} {comment.users[0]?.lastName}
                        </span>
                        <span className="rating-modal__comment-date">
                          {servicioComentarios.formatearTiempoRelativo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="rating-modal__comment-text">{comment.comment}</p>
                      
                      {/* Only show delete button if current user owns the comment */}
                      {currentUserId && currentUserId === comment.userId && (
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="rating-modal__comment-delete"
                          aria-label="Eliminar comentario"
                          disabled={isSaving}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="rating-modal__pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoadingComments}
                    className="rating-modal__pagination-btn"
                    aria-label="Página anterior"
                  >
                    ← Anterior
                  </button>
                  <span className="rating-modal__pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoadingComments}
                    className="rating-modal__pagination-btn"
                    aria-label="Página siguiente"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </div>

            {/* Rating Selector */}
            <div className="rating-modal__selector">
              <p className="rating-modal__selector-label">Tu calificación</p>
              <div
                className="rating-modal__stars"
                role="radiogroup"
                aria-label="Selecciona tu calificación de 1 a 5 estrellas"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`rating-modal__star ${
                      star <= (hoverRating || selectedRating) ? "rating-modal__star--active" : ""
                    }`}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Calificar con ${star} ${star === 1 ? "estrella" : "estrellas"}`}
                    aria-pressed={selectedRating === star}
                    role="radio"
                    aria-checked={selectedRating === star}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={star <= (hoverRating || selectedRating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="rating-modal__selected-text">
                  {selectedRating} {selectedRating === 1 ? "estrella" : "estrellas"}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rating-modal__error-inline" role="alert" aria-live="assertive">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="rating-modal__actions">
              <button
                className="rating-modal__btn rating-modal__btn--submit"
                onClick={handleSubmit}
                disabled={isSaving || selectedRating === 0}
                aria-busy={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar Calificación"}
              </button>
              <button
                className="rating-modal__btn rating-modal__btn--delete"
                onClick={handleDelete}
                disabled={isSaving}
                aria-busy={isSaving}
              >
                Eliminar mi Calificación
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingModal;