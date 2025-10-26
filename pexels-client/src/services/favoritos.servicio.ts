import axios from "axios";
import type { MovieFavorite } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Servicio para manejar favoritos de películas.
 * Requiere autenticación (token JWT).
 */
export const servicioFavoritos = {
  /**
   * Obtiene el token del localStorage
   */
  obtenerToken: (): string | null => {
    return localStorage.getItem("airfilms_token");
  },

  /**
   * Obtiene headers con autenticación
   */
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
   * Obtiene todos los favoritos del usuario autenticado.
   * GET /api/movies/get-favorites
   * Requiere: Authorization Bearer token
   */
  obtenerFavoritos: async (): Promise<MovieFavorite[]> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const respuesta = await axios.get(`${API_BASE_URL}/movies/get-favorites`, {
        headers
      });
      
      // Tu backend devuelve un array directo
      return Array.isArray(respuesta.data) ? respuesta.data : [];
    } catch (error: any) {
      console.error("Error al obtener favoritos:", error);
      
      // Si es 404, no hay favoritos (no es error)
      if (error.response?.status === 404) {
        return [];
      }
      
      // Si es 401, sesión expirada
      if (error.response?.status === 401) {
        localStorage.removeItem("airfilms_token");
        localStorage.removeItem("airfilms_usuario");
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.error || "Error al cargar favoritos"
      );
    }
  },

  /**
   * Agrega una película a favoritos.
   * POST /api/movies/add-favorite
   * Body: { movieId: number }
   * Requiere: Authorization Bearer token
   */
  agregarFavorito: async (movieId: number): Promise<MovieFavorite> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      const respuesta = await axios.post(
        `${API_BASE_URL}/movies/add-favorite`,
        { movieId }, // ✅ Solo enviar movieId según tu backend
        { headers }
      );
      
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al agregar favorito:", error);
      
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      // Manejar error de duplicado (si ya existe)
      if (error.response?.status === 409) {
        throw new Error("Esta película ya está en tus favoritos");
      }
      
      throw new Error(
        error.response?.data?.error || "Error al agregar a favoritos"
      );
    }
  },

  /**
   * Elimina una película de favoritos.
   * DELETE /api/movies/delete-favorite?movieId={movieId}
   * Requiere: Authorization Bearer token
   */
  eliminarFavorito: async (movieId: number): Promise<boolean> => {
    try {
      const headers = servicioFavoritos.obtenerHeaders();
      
      // ✅ CORRECCIÓN: Usar query params según tu backend
      await axios.delete(`${API_BASE_URL}/movies/delete-favorite`, {
        params: { movieId },
        headers
      });
      
      return true;
    } catch (error: any) {
      console.error("Error al eliminar favorito:", error);
      
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
      }
      
      throw new Error(
        error.response?.data?.error || "Error al eliminar de favoritos"
      );
    }
  },

  /**
   * Verifica si una película está en favoritos.
   * (Método helper del cliente)
   */
  esFavorito: (movieId: number, favoritos: MovieFavorite[]): boolean => {
    return favoritos.some(fav => fav.movieId === movieId);
  }
};

export default servicioFavoritos;