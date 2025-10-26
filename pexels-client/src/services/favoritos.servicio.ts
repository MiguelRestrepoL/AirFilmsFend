import axios from "axios";
import type { MovieFavorite } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

interface AddFavoriteResponse {
  success: boolean;
  favorite: MovieFavorite;
  message?: string;
}

interface DeleteFavoriteResponse {
  success: boolean;
  message?: string;
}

interface GetFavoritesResponse {
  success: boolean;
  favorites: MovieFavorite[];
  message?: string;
}

/**
 * Servicio para manejar favoritos de películas.
 */
export const servicioFavoritos = {
  obtenerToken: (): string | null => {
    return localStorage.getItem("airfilms_token");
  },

  obtenerHeaders: () => {
    const token = servicioFavoritos.obtenerToken();
    if (!token) {
      throw new Error("No hay sesión activa. Por favor inicia sesión.");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },

  /**
   * Agrega una película a favoritos.
   * POST /api/movies/add-favorite
   * Body: { movieId, movieName, movieURL }
   */
  agregarFavorito: async (movieId: number, movieName?: string, movieURL?: string): Promise<MovieFavorite> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const response = await axios.post<AddFavoriteResponse>(
        `${API_BASE_URL}/movies/add-favorite`,
        { 
          movieId,
          movieName: movieName || `Película ${movieId}`,
          movieURL: movieURL || ""
        },
        { headers }
      );

      if (response.data.success && response.data.favorite) {
        return response.data.favorite;
      }

      throw new Error(response.data.message || "Error al agregar favorito");
    } catch (error: any) {
      console.error("Error al agregar favorito:", error);
      
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.message || "Error al agregar película a favoritos"
      );
    }
  },

  /**
   * Elimina una película de favoritos.
   * DELETE /api/movies/delete-favorite
   * Body: { movieId }
   */
  eliminarFavorito: async (movieId: number): Promise<void> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const response = await axios.delete<DeleteFavoriteResponse>(
        `${API_BASE_URL}/movies/delete-favorite`,
        {
          data: { movieId },  // ✅ Enviar en el body, no query params
          headers,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al eliminar favorito");
      }
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error);
      
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.message || "Error al eliminar película de favoritos"
      );
    }
  },

  /**
   * Obtiene todos los favoritos del usuario autenticado.
   * GET /api/movies/get-favorites
   */
  obtenerFavoritos: async (): Promise<MovieFavorite[]> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const response = await axios.get<GetFavoritesResponse>(
        `${API_BASE_URL}/movies/get-favorites`,
        { headers }
      );

      if (response.data.success) {
        return response.data.favorites || [];
      }

      // Si no hay favoritos, devolver array vacío (no error)
      if (response.status === 404) {
        return [];
      }

      return [];
    } catch (error: any) {
      console.error("Error al obtener favoritos:", error);
      
      // Si es 404, no hay favoritos (no es error)
      if (error.response?.status === 404) {
        return [];
      }
      
      if (error.response?.status === 401) {
        localStorage.removeItem("airfilms_token");
        localStorage.removeItem("airfilms_usuario");
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.message || "Error al cargar favoritos"
      );
    }
  },

  esFavorito: (movieId: number, favorites: MovieFavorite[]): boolean => {
    return favorites.some((fav) => fav.movieId === movieId);
  },
};

export default servicioFavoritos;