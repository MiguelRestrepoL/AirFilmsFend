import axios from "axios";
import type { Movie, MovieListResponse, MovieDetails, PexelsVideo } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Servicio para manejar operaciones con películas.
 * Conecta con el backend que consume TMDB y Pexels.
 */
export const servicioPeliculas = {
  /**
   * Obtiene películas populares con paginación.
   * GET /api/movies/popular?page={page}
   */
  obtenerPopulares: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/movies/popular`, {
        params: { page }
      });
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al obtener películas populares:", error);
      throw new Error(
        error.response?.data?.error || "Error al cargar películas populares"
      );
    }
  },

  /**
   * Busca películas por nombre.
   * GET /api/movies/search?name={query}
   */
  buscarPorNombre: async (query: string): Promise<MovieListResponse> => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/movies/search`, {
        params: { name: query }
      });
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al buscar películas:", error);
      throw new Error(
        error.response?.data?.error || "Error al buscar películas"
      );
    }
  },

  /**
   * Busca películas por género.
   * GET /api/movies/genre?genre={genreId}
   */
  buscarPorGenero: async (genreId: string): Promise<MovieListResponse> => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/movies/genre`, {
        params: { genre: genreId }
      });
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al buscar películas por género:", error);
      throw new Error(
        error.response?.data?.error || "Error al buscar películas por género"
      );
    }
  },

  /**
   * Obtiene detalles completos de una película.
   * GET /api/movies/details?id={movieId}
   * Incluye información del video de Pexels relacionado.
   */
  obtenerDetalles: async (movieId: number): Promise<MovieDetails> => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/movies/details`, {
        params: { id: movieId }
      });
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al obtener detalles de película:", error);
      throw new Error(
        error.response?.data?.error || "Error al cargar detalles de la película"
      );
    }
  },

  /**
   * Obtiene el video completo de Pexels.
   * GET /api/movies/get-video?id={videoId}
   */
  obtenerVideo: async (videoId: number): Promise<PexelsVideo> => {
    try {
      const respuesta = await axios.get(`${API_BASE_URL}/movies/get-video`, {
        params: { id: videoId }
      });
      
      const data = respuesta.data;
      return {
        id: data.id,
        width: data.width,
        height: data.height,
        duration: data.duration,
        image: data.image,
        url: data.url,
        videoFiles: data.video_files?.map((file: any) => ({
          id: file.id,
          quality: file.quality,
          fileType: file.file_type,
          width: file.width,
          height: file.height,
          link: file.link
        })) || []
      };
    } catch (error: any) {
      console.error("Error al obtener video:", error);
      
      // Si es 404, el video no existe (no es error crítico)
      if (error.response?.status === 404) {
        throw new Error("Video no encontrado");
      }
      
      throw new Error(
        error.response?.data?.error || "Error al cargar el video"
      );
    }
  }
};

export default servicioPeliculas;