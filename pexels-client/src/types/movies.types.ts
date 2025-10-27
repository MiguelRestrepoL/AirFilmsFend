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
 * Detalles completos de una película
 */
export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  poster: string | null;
  backdrop: string | null;
  voteAverage: number;
  voteCount: number;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  status: string;
  originalLanguage: string;
  videoId?: number;  // ID del video de Pexels
  videoThumbnail?: string;  // Thumbnail del video
}

/**
 * Video de Pexels
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
 * Favorito de película (estructura de Supabase - tabla moviesFav)
 * Coincide exactamente con MovieFavRow del backend
 */
export interface MovieFavorite {
  userId: string;
  movieId: number;
  movieName: string;        // ✅ Requerido (no opcional)
  posterURL: string;        // ✅ Requerido (no opcional)
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
}

/**
 * Género de TMDB
 */
export interface Genre {
  id: string;
  name: string;
  tmdbId: string;
}