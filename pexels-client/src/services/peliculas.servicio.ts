import axios from "axios";
import type { Movie, MovieListResponse, MovieDetails, PexelsVideo } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Servicio para manejar operaciones con películas de TMDB.
 */
export const servicioPeliculas = {
  obtenerPopulares: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
        params: { page }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al obtener películas populares:", error);
      throw new Error(
        error.response?.data?.message || "Error al cargar películas populares"
      );
    }
  },

  buscarPorGenero: async (genreId: string, page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/genre`, {
        params: { genreId, page }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al buscar por género:", error);
      throw new Error(
        error.response?.data?.message || "Error al buscar películas por género"
      );
    }
  },

  obtenerDetalles: async (movieId: number): Promise<MovieDetails> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/details`, {
        params: { movieId }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al obtener detalles de película:", error);
      throw new Error(
        error.response?.data?.message || "Error al cargar detalles de la película"
      );
    }
  },

  buscarPorNombre: async (query: string, page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/search`, {
        params: { query, page }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al buscar películas:", error);
      throw new Error(
        error.response?.data?.message || "Error al buscar películas"
      );
    }
  },

  obtenerVideo: async (videoId: number): Promise<PexelsVideo> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/get-video`, {
        params: { videoId }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error al obtener video:", error);
      throw new Error(
        error.response?.data?.message || "Error al cargar video"
      );
    }
  },
};

export default servicioPeliculas;