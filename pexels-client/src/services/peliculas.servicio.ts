import axios from "axios";
import type { Movie, MovieListResponse, MovieDetails, PexelsVideo } from "../types/movies.types";

/**
 * Base URL for the AirFilms API server.
 * @constant {string}
 */
const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Movie Service (Spanish API)
 * 
 * Service layer for handling movie-related operations with TMDB and Pexels APIs.
 * Provides methods for fetching popular movies, searching by genre/name, 
 * retrieving movie details, and accessing video content.
 * 
 * @namespace servicioPeliculas
 * 
 * @example
 * // Get popular movies
 * const movies = await servicioPeliculas.obtenerPopulares(1);
 * 
 * @example
 * // Search movies by genre
 * const actionMovies = await servicioPeliculas.buscarPorGenero("28", 1);
 */
export const servicioPeliculas = {
  /**
   * Fetches popular movies from TMDB.
   * 
   * Makes a GET request to /api/movies/popular with pagination support.
   * 
   * @async
   * @function obtenerPopulares
   * @param {number} [page=1] - The page number to fetch (default: 1)
   * @returns {Promise<MovieListResponse>} Promise resolving to paginated movie list
   * @throws {Error} When API request fails or returns an error response
   * 
   * @example
   * try {
   *   const response = await servicioPeliculas.obtenerPopulares(2);
   *   console.log(`Page ${response.page} of ${response.totalPages}`);
   *   console.log(`Movies:`, response.results);
   * } catch (error) {
   *   console.error('Failed to load popular movies:', error.message);
   * }
   * 
   * @accessibility
   * - Error messages are user-friendly and suitable for screen readers
   * - Consistent error structure for predictable error handling
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
   * Searches movies by genre from TMDB.
   * 
   * Makes a GET request to /api/movies/genre with genre ID and pagination.
   * 
   * @async
   * @function buscarPorGenero
   * @param {string} genreId - The TMDB genre ID to filter by (e.g., "28" for Action)
   * @param {number} [page=1] - The page number to fetch (default: 1)
   * @returns {Promise<MovieListResponse>} Promise resolving to paginated movie list filtered by genre
   * @throws {Error} When API request fails or returns an error response
   * 
   * @example
   * // Search for action movies (genre ID: 28)
   * try {
   *   const actionMovies = await servicioPeliculas.buscarPorGenero("28", 1);
   *   console.log(`Found ${actionMovies.totalResults} action movies`);
   * } catch (error) {
   *   console.error('Genre search failed:', error.message);
   * }
   * 
   * @accessibility
   * - Genre-based filtering helps users find content matching their preferences
   * - Clear error messages for failed searches
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
   * Fetches complete details for a specific movie.
   * 
   * Makes a GET request to /api/movies/details and maps backend data to frontend structure.
   * Handles missing fields with sensible defaults.
   * 
   * @async
   * @function obtenerDetalles
   * @param {number} movieId - The TMDB movie ID
   * @returns {Promise<MovieDetails>} Promise resolving to complete movie details
   * @throws {Error} When API request fails or movie is not found
   * 
   * @example
   * try {
   *   const movie = await servicioPeliculas.obtenerDetalles(550); // Fight Club
   *   console.log(`Title: ${movie.title}`);
   *   console.log(`Runtime: ${movie.runtime} minutes`);
   *   console.log(`Genres: ${movie.genres.map(g => g.name).join(', ')}`);
   * } catch (error) {
   *   console.error('Failed to load movie details:', error.message);
   * }
   * 
   * @accessibility
   * - Provides comprehensive movie information for assistive technologies
   * - Includes structured genre data for better navigation
   * - Falls back to "en" for original language if not provided
   * 
   * @note
   * - Backend does not return voteAverage and voteCount (set to 0)
   * - Backdrop uses poster image as fallback
   * - Genres are mapped from string array to object array with IDs
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
   * Searches movies by name/title.
   * 
   * Makes a GET request to /api/movies/search with query string and pagination.
   * 
   * @async
   * @function buscarPorNombre
   * @param {string} query - The search query (movie title or keywords)
   * @param {number} [page=1] - The page number to fetch (default: 1)
   * @returns {Promise<MovieListResponse>} Promise resolving to paginated search results
   * @throws {Error} When API request fails or returns an error response
   * 
   * @example
   * try {
   *   const results = await servicioPeliculas.buscarPorNombre("inception", 1);
   *   console.log(`Found ${results.totalResults} movies matching "inception"`);
   *   results.results.forEach(movie => {
   *     console.log(`- ${movie.title} (${movie.releaseDate})`);
   *   });
   * } catch (error) {
   *   console.error('Search failed:', error.message);
   * }
   * 
   * @accessibility
   * - Enables keyboard-friendly search functionality
   * - Returns structured data suitable for screen reader announcements
   * - Clear error messaging for failed searches
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
   * Fetches video data from Pexels by video ID.
   * 
   * Makes a GET request to /api/movies/get-video and maps Pexels API response
   * to frontend structure with video files in different qualities.
   * 
   * @async
   * @function obtenerVideo
   * @param {string | number} videoId - The Pexels video ID
   * @returns {Promise<PexelsVideo>} Promise resolving to video data with multiple quality options
   * @throws {Error} When API request fails, video not found (404), or other errors occur
   * 
   * @example
   * try {
   *   const video = await servicioPeliculas.obtenerVideo(123456);
   *   console.log(`Video duration: ${video.duration}s`);
   *   console.log(`Available qualities:`);
   *   video.videoFiles.forEach(file => {
   *     console.log(`- ${file.quality}: ${file.width}x${file.height}`);
   *   });
   * } catch (error) {
   *   if (error.message === "Video no encontrado") {
   *     console.log("This video is no longer available");
   *   } else {
   *     console.error("Failed to load video:", error.message);
   *   }
   * }
   * 
   * @accessibility
   * - Provides video metadata for accessible media players
   * - Returns multiple quality options for bandwidth considerations
   * - Distinguishes between "not found" and other errors for better UX
   * 
   * @note
   * - 404 errors throw "Video no encontrado" specifically (not critical error)
   * - Maps snake_case Pexels API response to camelCase
   * - Returns empty array for videoFiles if none available
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