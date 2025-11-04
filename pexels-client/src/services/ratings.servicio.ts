
/**
 * Ratings Service
 * 
 * Service for managing movie ratings with backend API.
 * Handles creating, fetching, and deleting user ratings.
 * 
 * @module services/ratings.servicio
 */

import type { MovieRatingStats } from "../types/movies.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Response from GET /get-ratings/:movieId endpoint
 */
interface GetRatingsResponse {
  success: boolean;
  ratings: { totalCount: number };
  ratingNumbers: { data: number[] }; // [count_1★, count_2★, count_3★, count_4★, count_5★]
}

/**
 * Response from POST /add-rating endpoint
 */
interface CreateRatingResponse {
  success: boolean;
  ratingCreated?: any;
  message?: string;
}

/**
 * Response from DELETE /delete-rating endpoint
 */
interface DeleteRatingResponse {
  success: boolean;
  ratingDeleted?: boolean;
  message?: string;
}

/**
 * Ratings Service Class
 * 
 * Provides methods for interacting with the movie ratings API.
 * All methods require authentication via authToken in localStorage.
 * 
 * @class RatingsService
 */
class RatingsService {
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
   * Fetches rating statistics for a specific movie
   * 
   * @async
   * @param {number} movieId - TMDB movie ID
   * @returns {Promise<MovieRatingStats>} Rating statistics with count and distribution
   * @throws {Error} If request fails or response is invalid
   * 
   * @example
   * const stats = await servicioRatings.obtenerEstadisticas(550);
   * console.log(stats.totalCount); // 250
   * console.log(stats.distribution); // [5, 10, 30, 80, 125]
   */
  async obtenerEstadisticas(movieId: number): Promise<MovieRatingStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/get-ratings/${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener estadísticas de ratings");
      }

      const data: GetRatingsResponse = await response.json();

      if (!data.success) {
        throw new Error("Error al obtener estadísticas de ratings");
      }

      return {
        totalCount: data.ratings.totalCount,
        distribution: data.ratingNumbers.data,
      };
    } catch (error) {
      console.error("Error en obtenerEstadisticas:", error);
      throw error;
    }
  }

  /**
   * Creates or updates a user's rating for a movie
   * Uses upsert logic - if rating exists, it will be updated
   * 
   * @async
   * @param {number} movieId - TMDB movie ID
   * @param {number} rating - User's rating (1-5 stars)
   * @returns {Promise<void>}
   * @throws {Error} If user is not authenticated or request fails
   * 
   * @example
   * await servicioRatings.calificar(550, 5);
   * // User's rating for movie 550 is now 5 stars
   * 
   * @accessibility
   * - Show loading state while request is in progress
   * - Announce success/failure to screen readers
   * - Provide clear error messages
   */
  async calificar(movieId: number, rating: number): Promise<void> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("Debes iniciar sesión para calificar películas");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("La calificación debe estar entre 1 y 5 estrellas");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        throw new Error(errorData.message || "Error al guardar calificación");
      }

      const data: CreateRatingResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al guardar calificación");
      }
    } catch (error) {
      console.error("Error en calificar:", error);
      throw error;
    }
  }

  /**
   * Deletes a user's rating for a movie
   * 
   * @async
   * @param {number} movieId - TMDB movie ID
   * @returns {Promise<void>}
   * @throws {Error} If user is not authenticated or request fails
   * 
   * @example
   * await servicioRatings.eliminarCalificacion(550);
   * // User's rating for movie 550 has been removed
   * 
   * @accessibility
   * - Show loading state while request is in progress
   * - Announce success/failure to screen readers
   * - Provide confirmation dialog before deletion
   */
  async eliminarCalificacion(movieId: number): Promise<void> {
    const token = this.getAuthToken();

    if (!token) {
      throw new Error("Debes iniciar sesión para eliminar calificaciones");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/delete-rating`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (response.status === 404) {
          throw new Error("No tienes una calificación para esta película");
        }
        throw new Error(errorData.message || "Error al eliminar calificación");
      }

      const data: DeleteRatingResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al eliminar calificación");
      }
    } catch (error) {
      console.error("Error en eliminarCalificacion:", error);
      throw error;
    }
  }

  /**
   * Calculates average rating from distribution data
   * 
   * @param {MovieRatingStats} stats - Rating statistics
   * @returns {number} Average rating (0-5, rounded to 1 decimal)
   * 
   * @example
   * const stats = { totalCount: 250, distribution: [5, 10, 30, 80, 125] };
   * const avg = servicioRatings.calcularPromedio(stats);
   * console.log(avg); // 4.3
   */
  calcularPromedio(stats: MovieRatingStats): number {
    if (stats.totalCount === 0) return 0;

    const sum = stats.distribution.reduce(
      (acc, count, index) => acc + count * (index + 1),
      0
    );

    return Math.round((sum / stats.totalCount) * 10) / 10;
  }
}

export const servicioRatings = new RatingsService();