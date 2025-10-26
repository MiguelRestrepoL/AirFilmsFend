import axios from "axios";
import type { MovieFavorite } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

interface AddFavoriteResponse {
  success: boolean;
  favorite: MovieFavorite;
  message: string;
}

interface DeleteFavoriteResponse {
  success: boolean;
  message: string;
}

interface GetFavoritesResponse {
  success: boolean;
  favorites: MovieFavorite[];
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

  agregarFavorito: async (movieId: number): Promise<MovieFavorite> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const response = await axios.post<AddFavoriteResponse>(
        `${API_BASE_URL}/movies/add-favorite`,
        { movieId },
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

  eliminarFavorito: async (movieId: number): Promise<void> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const response = await axios.delete<DeleteFavoriteResponse>(
        `${API_BASE_URL}/movies/delete-favorite`,
        {
          params: { movieId },
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

      return [];
    } catch (error: any) {
      console.error("Error al obtener favoritos:", error);
      
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