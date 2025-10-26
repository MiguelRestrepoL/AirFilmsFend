import axios from "axios";
import type { Movie, MovieListResponse, MovieDetails, PexelsVideo } from "../types/movies.types";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Servicio para manejar operaciones con películas de TMDB.
 */
export const servicioPeliculas = {
  /**
   * Obtiene películas populares de TMDB.
   * GET /api/movies/popular?page={page}
   */
  obtenerPopulares: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
        params: { page }
      });
      return {
        page: response.data.page,
        results: response.data.results,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results || 0
      };
    } catch (error: any) {
      console.error("Error al obtener películas populares:", error);
      throw new Error(
        error.response?.data?.error || "Error al cargar películas populares"
      );
    }
  },

  /**
   * Busca películas por género de TMDB.
   * GET /api/movies/genre?genre={genre}&page={page}
   */
  buscarPorGenero: async (genreId: string, page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/genre`, {
        params: { 
          genre: genreId,
          page 
        }
      });
      return {
        page: response.data.page,
        results: response.data.results,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results || 0
      };
    } catch (error: any) {
      console.error("Error al buscar por género:", error);
      throw new Error(
        error.response?.data?.error || "Error al buscar películas por género"
      );
    }
  },

  /**
   * Obtiene detalles completos de una película.
   * GET /api/movies/details?id={id}
   */
  obtenerDetalles: async (movieId: number): Promise<MovieDetails> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/details`, {
        params: { id: movieId }
      });
      
      const data = response.data;
      
      // ✅ MAPEAR CORRECTAMENTE los datos del backend
      return {
        id: data.id,
        title: data.title,
        overview: data.overview,
        releaseDate: data.releaseDate,
        poster: data.poster,
        backdrop: data.poster, // Usar poster como backdrop
        voteAverage: 0, // Tu backend no devuelve esto
        voteCount: 0, // Tu backend no devuelve esto
        runtime: data.runtime,
        // ✅ MAPEAR géneros correctamente
        genres: data.genres.map((name: string, index: number) => ({ 
          id: index, 
          name 
        })),
        status: data.status,
        // ✅ CUIDADO: Tu backend devuelve "original_language"
        originalLanguage: data.original_language || "en",
        videoId: data.videoId,
        videoThumbnail: data.videoThumbnail
      };
    } catch (error: any) {
      console.error("Error al obtener detalles de película:", error);
      throw new Error(
        error.response?.data?.error || "Error al cargar detalles de la película"
      );
    }
  },

  /**
   * Busca películas por nombre.
   * GET /api/movies/search?name={name}&page={page}
   */
  buscarPorNombre: async (query: string, page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/search`, {
        params: { 
          name: query,
          page 
        }
      });
      return {
        page: response.data.page,
        results: response.data.results,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results || 0
      };
    } catch (error: any) {
      console.error("Error al buscar películas:", error);
      throw new Error(
        error.response?.data?.error || "Error al buscar películas"
      );
    }
  },

  /**
   * Obtiene un video de Pexels por ID.
   * GET /api/movies/get-video?id={id}
   */
  obtenerVideo: async (videoId: string | number): Promise<PexelsVideo> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/get-video`, {
        params: { id: videoId }
      });
      
      const data = response.data;
      
      // ✅ MAPEAR correctamente la respuesta de Pexels
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
        error.response?.data?.error || "Error al cargar video"
      );
    }
  },
};

export default servicioPeliculas;