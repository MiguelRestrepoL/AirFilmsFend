/**
 * Movie Types
 * 
 * Type definitions for movie-related data structures used throughout the AirFilms application.
 * Includes types for TMDB movies, Pexels videos, user favorites, ratings, and genre information.
 * 
 * @module types/movies.types
 */

/**
 * Simplified Movie Interface
 * 
 * Represents basic movie information used in search results and popular movie lists.
 * This is a lightweight version optimized for list views and search responses.
 * 
 * @interface Movie
 * @property {number} id - Unique TMDB movie identifier
 * @property {string} title - Movie title in original or localized language
 * @property {string} [releaseDate] - Movie release date in ISO format (YYYY-MM-DD), optional for unreleased movies
 * @property {string | null} poster - URL to movie poster image, null if unavailable
 * 
 * @example
 * const movie: Movie = {
 *   id: 550,
 *   title: "Fight Club",
 *   releaseDate: "1999-10-15",
 *   poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
 * };
 * 
 * @accessibility
 * - Title should be used as primary label for screen readers
 * - Poster URL should have descriptive alt text when rendered
 * - Release date should be formatted for locale when displayed
 */
export interface Movie {
  id: number;
  title: string;
  releaseDate?: string;
  poster: string | null;
}

/**
 * Paginated Movie List Response
 * 
 * Standard response structure for paginated movie queries.
 * Used by popular movies, genre searches, and name searches.
 * 
 * @interface MovieListResponse
 * @property {number} page - Current page number (1-indexed)
 * @property {Movie[]} results - Array of movies for the current page
 * @property {number} totalPages - Total number of available pages
 * @property {number} totalResults - Total number of movies matching the query
 * 
 * @example
 * const response: MovieListResponse = {
 *   page: 1,
 *   results: [...movies],
 *   totalPages: 500,
 *   totalResults: 10000
 * };
 * 
 * // Check if there are more pages
 * const hasNextPage = response.page < response.totalPages;
 * 
 * @accessibility
 * - Use totalResults to announce search results count to screen readers
 * - Implement proper pagination controls with ARIA labels
 * - Announce page changes to assistive technologies
 */
export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

/**
 * Complete Movie Details
 * 
 * Comprehensive movie information including metadata, ratings, runtime,
 * genres, and associated video content from Pexels.
 * 
 * @interface MovieDetails
 * @property {number} id - Unique TMDB movie identifier
 * @property {string} title - Full movie title
 * @property {string} overview - Movie plot summary/synopsis
 * @property {string} releaseDate - Release date in ISO format (YYYY-MM-DD)
 * @property {string | null} poster - URL to movie poster image, null if unavailable
 * @property {string | null} backdrop - URL to backdrop/hero image, null if unavailable
 * @property {number} voteAverage - Average user rating (0-10 scale)
 * @property {number} voteCount - Total number of user votes/ratings
 * @property {number} runtime - Movie duration in minutes
 * @property {Array<{id: number, name: string}>} genres - Array of genre objects
 * @property {string} status - Release status (e.g., "Released", "Post Production")
 * @property {string} originalLanguage - ISO 639-1 language code (e.g., "en", "es")
 * @property {number} [videoId] - Optional Pexels video ID for movie trailer/clip
 * @property {string} [videoThumbnail] - Optional Pexels video thumbnail URL
 * 
 * @example
 * const movieDetails: MovieDetails = {
 *   id: 550,
 *   title: "Fight Club",
 *   overview: "A ticking-time-bomb insomniac...",
 *   releaseDate: "1999-10-15",
 *   poster: "https://image.tmdb.org/t/p/w500/poster.jpg",
 *   backdrop: "https://image.tmdb.org/t/p/original/backdrop.jpg",
 *   voteAverage: 8.4,
 *   voteCount: 28567,
 *   runtime: 139,
 *   genres: [
 *     { id: 18, name: "Drama" },
 *     { id: 53, name: "Thriller" }
 *   ],
 *   status: "Released",
 *   originalLanguage: "en",
 *   videoId: 123456,
 *   videoThumbnail: "https://images.pexels.com/videos/123456/preview.jpg"
 * };
 * 
 * @accessibility
 * - Overview should be exposed to screen readers for movie descriptions
 * - Rating (voteAverage) should be announced with context (e.g., "8.4 out of 10")
 * - Runtime should be formatted as hours and minutes for better comprehension
 * - Genres should be listed as comma-separated text for screen readers
 * - Language code should be converted to human-readable language name
 * 
 * @note
 * - Backend may return voteAverage and voteCount as 0 if unavailable
 * - Backdrop may fallback to poster URL if not provided
 * - videoId and videoThumbnail are only present for movies with associated videos
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
  videoId?: number;
  videoThumbnail?: string;
}

/**
 * Pexels Video Data
 * 
 * Video information from Pexels API including multiple quality options.
 * Used for movie trailers, clips, or background videos.
 * 
 * @interface PexelsVideo
 * @property {number} id - Unique Pexels video identifier
 * @property {number} width - Original video width in pixels
 * @property {number} height - Original video height in pixels
 * @property {number} duration - Video duration in seconds
 * @property {string} image - URL to video preview/thumbnail image
 * @property {string} url - Pexels page URL for the video
 * @property {Array<VideoFile>} videoFiles - Array of video files in different qualities and formats
 * 
 * @typedef {Object} VideoFile
 * @property {number} id - Unique video file identifier
 * @property {string} quality - Quality label (e.g., "hd", "sd", "4k")
 * @property {string} fileType - MIME type (e.g., "video/mp4")
 * @property {number} width - Video width in pixels for this quality
 * @property {number} height - Video height in pixels for this quality
 * @property {string} link - Direct download/stream URL for this video file
 * 
 * @example
 * const video: PexelsVideo = {
 *   id: 123456,
 *   width: 1920,
 *   height: 1080,
 *   duration: 45,
 *   image: "https://images.pexels.com/videos/123456/preview.jpg",
 *   url: "https://www.pexels.com/video/123456",
 *   videoFiles: [
 *     {
 *       id: 1,
 *       quality: "hd",
 *       fileType: "video/mp4",
 *       width: 1920,
 *       height: 1080,
 *       link: "https://player.vimeo.com/external/..."
 *     },
 *     {
 *       id: 2,
 *       quality: "sd",
 *       fileType: "video/mp4",
 *       width: 640,
 *       height: 360,
 *       link: "https://player.vimeo.com/external/..."
 *     }
 *   ]
 * };
 * 
 * // Select appropriate quality based on user preferences or bandwidth
 * const preferredQuality = video.videoFiles.find(f => f.quality === "hd") || video.videoFiles[0];
 * 
 * @accessibility
 * - Video players must include captions/subtitles when available
 * - Duration should be announced to screen readers before playback
 * - Provide controls for play/pause, volume, and fullscreen with keyboard support
 * - Include descriptive labels for quality options
 * - Ensure video thumbnail has descriptive alt text
 * - Consider autoplay policies and user preferences
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
 * User's Favorite Movie
 * 
 * Represents a movie saved to user's favorites list.
 * Stored in Supabase 'moviesFav' table with user relationship.
 * Matches MovieFavRow structure from backend.
 * 
 * @interface MovieFavorite
 * @property {string} userId - Supabase user UUID (foreign key)
 * @property {number} movieId - TMDB movie ID
 * @property {string} movieName - Movie title (required for quick display)
 * @property {string} posterURL - Poster image URL (required for grid display)
 * @property {Date | string} [createdAt] - Timestamp when favorite was added
 * @property {Date | string} [updatedAt] - Timestamp of last update
 * @property {boolean} [isDeleted] - Soft delete flag (true if removed)
 * 
 * @example
 * const favorite: MovieFavorite = {
 *   userId: "550e8400-e29b-41d4-a716-446655440000",
 *   movieId: 550,
 *   movieName: "Fight Club",
 *   posterURL: "https://image.tmdb.org/t/p/w500/poster.jpg",
 *   createdAt: "2025-01-15T10:30:00Z",
 *   updatedAt: "2025-01-15T10:30:00Z",
 *   isDeleted: false
 * };
 * 
 * // Filter active favorites
 * const activeFavorites = favorites.filter(f => !f.isDeleted);
 * 
 * @accessibility
 * - Favorite status should be clearly announced to screen readers
 * - Use ARIA live regions to announce when favorites are added/removed
 * - Provide keyboard shortcuts for managing favorites
 * - Include clear visual and auditory feedback for favorite actions
 * 
 * @note
 * - movieName and posterURL are required (non-optional) for performance
 * - Denormalized data reduces need for joins when displaying favorites
 * - Soft delete (isDeleted) allows for undo functionality and data recovery
 * - Timestamps use ISO 8601 format when stored as strings
 */
export interface MovieFavorite {
  userId: string;
  movieId: number;
  movieName: string;
  posterURL: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
}

/**
 * Movie Rating Statistics
 * 
 * Aggregate rating data for a specific movie from backend.
 * Contains total count and distribution across 1-5 stars.
 * 
 * @interface MovieRatingStats
 * @property {number} totalCount - Total number of ratings for this movie
 * @property {number[]} distribution - Array with count for each star rating [1★, 2★, 3★, 4★, 5★]
 * 
 * @example
 * const stats: MovieRatingStats = {
 *   totalCount: 250,
 *   distribution: [5, 10, 30, 80, 125] // [1★, 2★, 3★, 4★, 5★]
 * };
 * 
 * // Calculate average rating
 * const average = stats.distribution.reduce((acc, count, index) => 
 *   acc + (count * (index + 1)), 0
 * ) / stats.totalCount;
 * // Result: 4.28 stars
 * 
 * @accessibility
 * - Announce total count and average rating to screen readers
 * - Use ARIA labels for rating distribution visualization
 * - Provide text alternatives for star ratings
 * 
 * @note
 * - Distribution array always has exactly 5 elements (indices 0-4 represent 1-5 stars)
 * - If totalCount is 0, distribution will be [0, 0, 0, 0, 0]
 */
export interface MovieRatingStats {
  totalCount: number;
  distribution: number[]; // [1★, 2★, 3★, 4★, 5★]
}

/**
 * User's Rating for a Movie
 * 
 * Represents a single user's rating for a specific movie.
 * Stored in Supabase 'movieRatings' table with composite primary key (userId, movieId).
 * 
 * @interface MovieRating
 * @property {string} userId - Supabase user UUID (foreign key)
 * @property {number} movieId - TMDB movie ID
 * @property {number} rating - User's rating (1-5 stars)
 * @property {Date | string} [createdAt] - Timestamp when rating was created
 * @property {Date | string} [updatedAt] - Timestamp of last update
 * 
 * @example
 * const userRating: MovieRating = {
 *   userId: "550e8400-e29b-41d4-a716-446655440000",
 *   movieId: 550,
 *   rating: 5,
 *   createdAt: "2025-01-15T14:30:00Z",
 *   updatedAt: "2025-01-15T14:30:00Z"
 * };
 * 
 * @accessibility
 * - Rating should be announced as "X out of 5 stars"
 * - Use ARIA live regions to announce rating changes
 * - Provide keyboard navigation for rating inputs
 * - Include visual and auditory feedback when rating is saved
 * 
 * @note
 * - Backend enforces rating range (0-5) via enum validation
 * - One user can only have one rating per movie (upsert on conflict)
 * - Rating of 0 is technically allowed but typically means "unrated"
 */
export interface MovieRating {
  userId: string;
  movieId: number;
  rating: number; // 1-5
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * TMDB Genre
 * 
 * Represents a movie genre from The Movie Database (TMDB).
 * Used for filtering and categorizing movies.
 * 
 * @interface Genre
 * @property {string} id - Internal genre identifier
 * @property {string} name - Human-readable genre name (e.g., "Action", "Comedy")
 * @property {string} tmdbId - TMDB's official genre ID
 * 
 * @example
 * const genre: Genre = {
 *   id: "1",
 *   name: "Action",
 *   tmdbId: "28"
 * };
 * 
 * // Common TMDB Genre IDs:
 * // 28 - Action, 12 - Adventure, 16 - Animation,
 * // 35 - Comedy, 80 - Crime, 18 - Drama,
 * // 27 - Horror, 10749 - Romance, 878 - Science Fiction
 * 
 * @accessibility
 * - Genre names should be used as filter button labels
 * - Implement ARIA labels for genre navigation
 * - Announce current genre filter to screen readers
 * - Ensure genre buttons are keyboard accessible
 * - Use clear, consistent genre terminology
 */
export interface Genre {
  id: string;
  name: string;
  tmdbId: string;
}