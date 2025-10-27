import axios from "axios";
import type { MovieFavorite } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Datos para agregar un favorito (coincide con MovieFavInsert del backend)
 */
interface AddFavoriteData {
  movieId: number;
  movieName: string;
  posterURL: string;
}

/**
 * Respuesta al agregar favorito
 */
interface AddFavoriteResponse {
  success: boolean;
  favorite: MovieFavorite;
  message?: string;
}

/**
 * Respuesta al eliminar favorito
 */
interface DeleteFavoriteResponse {
  success: boolean;
  message?: string;
}

/**
 * Respuesta al obtener favoritos
 */
interface GetFavoritesResponse {
  success: boolean;
  favorites: MovieFavorite[];
}

/**
 * Servicio para manejar operaciones con favoritos.
 * Requiere autenticación (token JWT).
 */
export const servicioFavoritos = {
  /**
   * Obtiene el token de autenticación del localStorage
   */
  obtenerToken(): string | null {
    return localStorage.getItem("authToken");
  },

  /**
   * Obtiene los headers con autenticación
   */
  obtenerHeaders() {
    const token = this.obtenerToken();
    if (!token) {
      throw new Error("No hay sesión activa. Inicia sesión para continuar.");
    }
    
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  },

  /**
   * Agrega una película a favoritos
   * POST /api/movies/add-favorite
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
   * Elimina una película de favoritos
   * DELETE /api/movies/delete-favorite
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
   * Obtiene todos los favoritos del usuario
   * GET /api/movies/get-favorites
   */
  async obtenerFavoritos(): Promise<MovieFavorite[]> {
    try {
      const response = await axios.get<GetFavoritesResponse>(
        `${API_BASE_URL}/movies/get-favorites`,
        {
          headers: this.obtenerHeaders()
        }
      );

      if (!response.data.success) {
        throw new Error("Error al obtener favoritos");
      }

      return response.data.favorites || [];
    } catch (error: any) {
      console.error("Error al obtener favoritos:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        "Error al cargar favoritos"
      );
    }
  },

  /**
   * Verifica si una película está en favoritos
   */
  esFavorito(movieId: number, favorites: MovieFavorite[]): boolean {
    return favorites.some(fav => fav.movieId === movieId);
  }
};

export default servicioFavoritos;