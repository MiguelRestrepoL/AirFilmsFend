/**
 * Película simplificada (búsqueda y populares)
 */
export interface Movie {
  id: number;
  title: string;
  releaseDate?: string;
  poster: string | null;
}

/**
 * Respuesta paginada de películas
 */
export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

/**
 * Detalles completos de una película (respuesta de /api/movies/details)
 */
export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  poster: string | null;
  backdrop?: string | null;
  voteAverage: number;
  voteCount: number;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  status: string;
  originalLanguage: string;
  videoId?: number;  // ID del video de Pexels (si existe)
  videoThumbnail?: string;  // Thumbnail del video de Pexels
}

/**
 * Video de Pexels (respuesta de /api/movies/get-video)
 */
export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  url: string;
  videoFiles: Array<{
    id: number;
    quality: string;
    fileType: string;
    width: number;
    height: number;
    link: string;
  }>;
}

/**
 * Favorito de película (estructura de Supabase)
 * Respuesta del backend: { id, userId, movieId, createdAt }
 */
export interface MovieFavorite {
  id?: string;
  userId: string;
  movieId: number;
  createdAt?: string;
}

/**
 * Género de TMDB
 */
export interface Genre {
  id: string;
  name: string;
  tmdbId: string;
}