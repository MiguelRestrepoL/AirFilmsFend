import axios from "axios";
import type { MovieFavorite } from "../types/movies.types";

/**
 * @fileoverview Favorites Service for AirFilms
 * 
 * Handles all favorite movies operations including adding, removing, and fetching
 * user's favorite movies. Requires JWT authentication for all operations.
 * 
 * Security:
 * - All endpoints require JWT authentication via Bearer token
 * - Token is stored in localStorage with key 'authToken'
 * - Automatic session expiration handling (401/403 responses)
 * 
 * Error Handling:
 * - Network errors: Returns empty array for non-critical operations
 * - 401/403: Throws session expired error
 * - 404: Logs warning and returns empty array (backend may be offline)
 * - Other errors: Throws descriptive error messages
 */

/**
 * Base URL for the AirFilms API backend
 * @constant {string}
 */
const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Data required to add a movie to favorites
 * Matches MovieFavInsert interface from backend
 * 
 * @interface AddFavoriteData
 * @property {number} movieId - TMDB movie ID
 * @property {string} movieName - Movie title/name
 * @property {string} posterURL - URL to movie poster image
 */
interface AddFavoriteData {
  movieId: number;
  movieName: string;
  posterURL: string;
}

/**
 * Response structure when adding a favorite
 * 
 * @interface AddFavoriteResponse
 * @property {boolean} success - Operation success status
 * @property {MovieFavorite} favorite - Created favorite object
 * @property {string} [message] - Optional success/error message
 */
interface AddFavoriteResponse {
  success: boolean;
  favorite: MovieFavorite;
  message?: string;
}

/**
 * Response structure when deleting a favorite
 * 
 * @interface DeleteFavoriteResponse
 * @property {boolean} success - Operation success status
 * @property {string} [message] - Optional success/error message
 */
interface DeleteFavoriteResponse {
  success: boolean;
  message?: string;
}

/**
 * Response structure when fetching favorites list
 * 
 * @interface GetFavoritesResponse
 * @property {boolean} success - Operation success status
 * @property {MovieFavorite[]} favorites - Array of user's favorite movies
 */
interface GetFavoritesResponse {
  success: boolean;
  favorites: MovieFavorite[];
}

/**
 * Favorites Service
 * 
 * Provides methods to manage user's favorite movies with authentication.
 * All methods require a valid JWT token stored in localStorage.
 * 
 * @namespace servicioFavoritos
 * 
 * @example
 * ```typescript
 * // Add a movie to favorites
 * const favorite = await servicioFavoritos.agregarFavorito({
 *   movieId: 12345,
 *   movieName: "Inception",
 *   posterURL: "https://example.com/poster.jpg"
 * });
 * 
 * // Get all favorites
 * const favorites = await servicioFavoritos.obtenerFavoritos();
 * 
 * // Remove from favorites
 * await servicioFavoritos.eliminarFavorito(12345);
 * ```
 */
export const servicioFavoritos = {
  /**
   * Retrieves authentication token from localStorage
   * 
   * @function obtenerToken
   * @returns {string | null} JWT token if exists, null otherwise
   * 
   * @example
   * ```typescript
   * const token = servicioFavoritos.obtenerToken();
   * if (!token) {
   *   // Redirect to login
   * }
   * ```
   */
  obtenerToken(): string | null {
    return localStorage.getItem("authToken");
  },

  /**
   * Generates HTTP headers with JWT authentication
   * 
   * @function obtenerHeaders
   * @returns {Object} Headers object with Content-Type and Authorization
   * @throws {Error} If no authentication token is found
   * 
   * @example
   * ```typescript
   * const headers = servicioFavoritos.obtenerHeaders();
   * // { "Content-Type": "application/json", "Authorization": "Bearer <token>" }
   * ```
   */
  obtenerHeaders() {
    const token = this.obtenerToken();
    console.log("🔑 Token para favoritos:", token ? `${token.substring(0, 20)}...` : "❌ NO HAY TOKEN");
    
    if (!token) {
      throw new Error("No hay sesión activa. Inicia sesión para continuar.");
    }
    
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  },

  /**
   * Adds a movie to user's favorites
   * 
   * Endpoint: POST /api/movies/add-favorite
   * Requires: Authentication
   * 
   * @async
   * @function agregarFavorito
   * @param {AddFavoriteData} data - Movie data to add as favorite
   * @returns {Promise<MovieFavorite>} Created favorite object with timestamps
   * @throws {Error} If not authenticated (401/403)
   * @throws {Error} If movie already exists in favorites
   * @throws {Error} If network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   const favorite = await servicioFavoritos.agregarFavorito({
   *     movieId: 550,
   *     movieName: "Fight Club",
   *     posterURL: "https://image.tmdb.org/t/p/w500/poster.jpg"
   *   });
   *   console.log("Added to favorites:", favorite);
   * } catch (error) {
   *   console.error("Failed to add favorite:", error.message);
   * }
   * ```
   */
  async agregarFavorito(data: AddFavoriteData): Promise<MovieFavorite> {
    try {
      const response = await axios.post<AddFavoriteResponse>(
        `${API_BASE_URL}/movies/add-favorite`,
        {
          movieId: data.movieId,
          movieName: data.movieName,
          posterURL: data.posterURL
        },
        {
          headers: this.obtenerHeaders()
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al agregar favorito");
      }

      return response.data.favorite;
    } catch (error: any) {
      console.error("Error al agregar favorito:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al agregar a favoritos"
      );
    }
  },

  /**
   * Removes a movie from user's favorites
   * 
   * Endpoint: DELETE /api/movies/delete-favorite
   * Requires: Authentication
   * 
   * @async
   * @function eliminarFavorito
   * @param {number} movieId - TMDB movie ID to remove
   * @returns {Promise<void>} Resolves when successfully deleted
   * @throws {Error} If not authenticated (401/403)
   * @throws {Error} If movie not found in favorites
   * @throws {Error} If network request fails
   * 
   * @example
   * ```typescript
   * try {
   *   await servicioFavoritos.eliminarFavorito(550);
   *   console.log("Removed from favorites");
   * } catch (error) {
   *   console.error("Failed to remove favorite:", error.message);
   * }
   * ```
   */
  async eliminarFavorito(movieId: number): Promise<void> {
    try {
      const response = await axios.delete<DeleteFavoriteResponse>(
        `${API_BASE_URL}/movies/delete-favorite`,
        {
          headers: this.obtenerHeaders(),
          data: { movieId }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al eliminar favorito");
      }
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al eliminar de favoritos"
      );
    }
  },

  /**
   * Fetches all favorite movies for the authenticated user
   * 
   * Endpoint: GET /api/movies/get-favorites
   * Requires: Authentication
   * 
   * Graceful degradation:
   * - Returns empty array if backend is offline (404/no response)
   * - Logs detailed error information for debugging
   * 
   * @async
   * @function obtenerFavoritos
   * @returns {Promise<MovieFavorite[]>} Array of user's favorite movies, empty if none
   * @throws {Error} If not authenticated (401/403)
   * @throws {Error} If backend returns error (except 404)
   * 
   * @example
   * ```typescript
   * try {
   *   const favorites = await servicioFavoritos.obtenerFavoritos();
   *   console.log(`User has ${favorites.length} favorites`);
   *   favorites.forEach(fav => {
   *     console.log(`- ${fav.movieName} (ID: ${fav.movieId})`);
   *   });
   * } catch (error) {
   *   console.error("Failed to fetch favorites:", error.message);
   * }
   * ```
   */
  async obtenerFavoritos(): Promise<MovieFavorite[]> {
    try {
      console.log("📡 Llamando a:", `${API_BASE_URL}/movies/get-favorites`);
      
      const response = await axios.get<GetFavoritesResponse>(
        `${API_BASE_URL}/movies/get-favorites`,
        {
          headers: this.obtenerHeaders()
        }
      );

      console.log("✅ Respuesta favoritos:", response.status, response.data);

      if (!response.data.success) {
        throw new Error("Error al obtener favoritos");
      }

      return response.data.favorites || [];
    } catch (error: any) {
      console.error("❌ Error completo:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // If 404, route doesn't exist or server is down
      if (error.response?.status === 404) {
        console.error("❌ RUTA NO ENCONTRADA (404): Verifica que el backend esté corriendo");
        return []; // Return empty array instead of throwing error
      }
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      // If no server response
      if (!error.response) {
        console.error("❌ SIN RESPUESTA DEL SERVIDOR: El backend puede estar apagado");
        return [];
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al cargar favoritos"
      );
    }
  },

  /**
   * Checks if a specific movie is in the favorites list
   * 
   * Utility function for UI state management (heart icon toggle, etc.)
   * 
   * @function esFavorito
   * @param {number} movieId - TMDB movie ID to check
   * @param {MovieFavorite[]} favorites - Array of favorite movies to search
   * @returns {boolean} True if movie is in favorites, false otherwise
   * 
   * @example
   * ```typescript
   * const favorites = await servicioFavoritos.obtenerFavoritos();
   * const isFavorited = servicioFavoritos.esFavorito(550, favorites);
   * 
   * // Use in React component
   * <button className={isFavorited ? "favorited" : ""}>
   *   {isFavorited ? "❤️" : "🤍"}
   * </button>
   * ```
   */
  esFavorito(movieId: number, favorites: MovieFavorite[]): boolean {
    return favorites.some(fav => fav.movieId === movieId);
  }
};

export default servicioFavoritos;