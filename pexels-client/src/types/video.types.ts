/**
 * Representa una variante de archivo de video con calidad y dimensiones específicas.
 */
export interface ArchivoVideo {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

/**
 * Representa una miniatura/imagen del video.
 */
export interface ImagenVideo {
  id: number;
  picture: string;
  nr: number;
}

/**
 * Objeto completo de video de la API de Pexels.
 */
export interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  url: string;
  video_files: ArchivoVideo[];
  video_pictures: ImagenVideo[];
}

/**
 * Respuesta simplificada del endpoint de búsqueda del backend.
 * El backend devuelve solo id y thumbnail para búsquedas.
 */
export interface ResultadoBusquedaVideo {
  id: number;
  thumbnail: string;
}

/**
 * Categoría para filtrado de videos.
 */
export interface Categoria {
  id: string;
  nombre: string;
  consulta: string;
}