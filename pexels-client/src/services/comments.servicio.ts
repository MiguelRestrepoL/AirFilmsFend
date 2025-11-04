/**
 * Comments Service
 * 
 * Service for managing movie comments with backend API.
 * Handles creating, fetching, and deleting user comments.
 * 
 * @module services/comments.servicio
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://airfilms-server.onrender.com/api";

/**
 * Comment data structure
 */
export interface MovieComment {
  id: string;
  userId: string;
  users: Array<{ name: string; lastName: string }>;
  comment: string;
  createdAt: string;
}

/**
 * Paginated comments response
 */
export interface PaginatedComments {
  data: MovieComment[];
  count: number;
}

/**
 * Response from GET /movies/get-comments/:movieId endpoint
 */
interface GetCommentsResponse {
  success: boolean;
  comments: PaginatedComments;
  message?: string;
}

/**
 * Response from POST /movies/add-comment endpoint
 */
interface CreateCommentResponse {
  success: boolean;
  commentCreated?: any;
  message?: string;
}

/**
 * Response from DELETE /movies/delete-comment endpoint
 */
interface DeleteCommentResponse {
  success: boolean;
  commentDeleted?: boolean;
  message?: string;
}

/**
 * Comments Service Class
 * 
 * Provides methods for interacting with the movie comments API.
 * Authentication required for creating and deleting comments.
 * 
 * @class CommentsService
 */
class CommentsService {
  /**
   * Gets authentication token from localStorage
   * 
   * @private
   * @returns {string | null} JWT token or null if not authenticated
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * Fetches comments for a specific movie
   * 
   * @async
   * @param {number} movieId - TMDB movie ID
   * @param {number} [page=1] - Page number for pagination
   * @param {number} [limit=20] - Comments per page
   * @returns {Promise<PaginatedComments>} Paginated list of comments
   * @throws {Error} If request fails or response is invalid
   * 
   * @example
   * const comments = await servicioComentarios.obtenerComentarios(550, 1, 10);
   * console.log(comments.count); // Total comments
   * console.log(comments.data); // Array of comments
   */
  async obtenerComentarios(
    movieId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedComments> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movies/get-comments/${movieId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener comentarios");
      }

      const data: GetCommentsResponse = await response.json();

      if (!data.success) {
        throw new Error("Error al obtener comentarios");
      }

      return data.comments;
    } catch (error) {
      console.error("Error en obtenerComentarios:", error);
      throw error;
    }
  }

  /**
   * Creates a new comment for a movie
   * 
   * @async
   * @param {number} movieId - TMDB movie ID
   * @param {string} comment - User's comment text
   * @returns {Promise<void>}
   * @throws {Error} If user is not authenticated or request fails
   * 
   * @example
   * await servicioComentarios.crearComentario(550, "¡Excelente película!");
   * 
   * @accessibility
   * - Show loading state while request is in progress
   * - Announce success/failure to screen readers
   * - Validate comment text before submitting
   */
  async crearComentario(movieId: number, comment: string): Promise<void> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("Debes iniciar sesión para comentar");
    }

    if (!comment || comment.trim().length === 0) {
      throw new Error("El comentario no puede estar vacío");
    }

    if (comment.trim().length > 500) {
      throw new Error("El comentario no puede exceder 500 caracteres");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/movies/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, comment: comment.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        throw new Error(errorData.message || "Error al crear comentario");
      }

      const data: CreateCommentResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al crear comentario");
      }
    } catch (error) {
      console.error("Error en crearComentario:", error);
      throw error;
    }
  }

  /**
   * Deletes a user's comment
   * 
   * @async
   * @param {string} commentId - Comment UUID
   * @param {number} movieId - TMDB movie ID
   * @returns {Promise<void>}
   * @throws {Error} If user is not authenticated or request fails
   * 
   * @example
   * await servicioComentarios.eliminarComentario("uuid-here", 550);
   * 
   * @accessibility
   * - Show loading state while request is in progress
   * - Announce success/failure to screen readers
   * - Provide confirmation dialog before deletion
   */
async eliminarComentario(commentId: string | number, movieId: number): Promise<void> {
  const token = this.getAuthToken();

  if (!token) {
    throw new Error("Debes iniciar sesión para eliminar comentarios");
  }

  // ✅ Convertir a string
  const commentIdStr = String(commentId);

  // Validate commentId format
  if (!commentIdStr || commentIdStr.trim().length === 0) {
    throw new Error("ID de comentario inválido");
  }

  // Validate movieId
  if (!movieId || !Number.isFinite(movieId) || movieId < 1) {
    throw new Error("ID de película inválido");
  }

  console.log("🗑️ Eliminando comentario:", { commentId: commentIdStr, movieId, type: typeof commentIdStr });

  try {
    const response = await fetch(`${API_BASE_URL}/movies/delete-comment`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: commentIdStr, movieId }),
    });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error del servidor:", errorData);
        
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (response.status === 404) {
          throw new Error("Comentario no encontrado");
        }
        if (response.status === 400) {
          throw new Error(errorData.message || "Datos inválidos para eliminar comentario");
        }
        throw new Error(errorData.message || "Error al eliminar comentario");
      }

      const data: DeleteCommentResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al eliminar comentario");
      }

      console.log("✅ Comentario eliminado exitosamente");
    } catch (error) {
      console.error("Error en eliminarComentario:", error);
      throw error;
    }
  }

  /**
   * Formats a relative time string (e.g., "hace 2 horas")
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted relative time
   * 
   * @example
   * servicioComentarios.formatearTiempoRelativo("2024-01-15T10:00:00Z");
   * // "hace 2 días"
   */
  formatearTiempoRelativo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "hace un momento";
    if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
    if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    if (diffDays < 30) return `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    
    return date.toLocaleDateString("es-ES", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  }
}

export const servicioComentarios = new CommentsService();