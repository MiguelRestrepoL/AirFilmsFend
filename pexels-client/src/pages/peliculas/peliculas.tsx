import React, { useEffect, useState } from "react";
import SearchBar from "../../components/search-bar/search-bar";
import CategoryFilter from "../../components/category-filter/category-filter";
import VideoCard from "../../components/video-card/video-card";
import VideoModal from "../../components/video-modal/video-modal";
import type { ResultadoBusquedaVideo, Categoria } from "../../types/video.types";
import "./peliculas.scss";

/**
 * Lista de categorías predefinidas para filtrado rápido.
 */
const CATEGORIAS: Categoria[] = [
  { id: "1", nombre: "Acción", consulta: "action" },
  { id: "2", nombre: "Comedia", consulta: "comedy" },
  { id: "3", nombre: "Drama", consulta: "drama" },
  { id: "4", nombre: "Ciencia Ficción", consulta: "science fiction" },
  { id: "5", nombre: "Documentales", consulta: "documentary" },
  { id: "6", nombre: "Naturaleza", consulta: "nature" },
];

/**
 * Página principal de películas.
 * Permite buscar videos por término, filtrar por categoría y ver detalles.
 * 
 * @component
 * @returns {JSX.Element} Vista de películas con búsqueda y filtros
 * 
 * @remarks
 * Implementa las dos funcionalidades principales del reto:
 * 1. Search Videos - Búsqueda por término
 * 2. Get Video by ID - Obtener video específico al hacer clic
 */
const MoviePage: React.FC = () => {
  const [videos, setVideos] = useState<ResultadoBusquedaVideo[]>([]);
  const [videoSeleccionado, setVideoSeleccionado] = useState<number | null>(null);
  const [estaCargando, setEstaCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("");

  /**
   * Busca videos en el backend por término de búsqueda.
   * Consume el endpoint: GET /videos/search?query={consulta}
   * 
   * @param {string} consulta - Término a buscar (ej: "naturaleza", "ocean")
   */
  const buscarVideos = async (consulta: string) => {
    try {
      setEstaCargando(true);
      setError(null);
      
      const url = `${import.meta.env.VITE_API_LOCAL_URL}/videos/search?query=${encodeURIComponent(consulta)}`;
      const respuesta = await fetch(url);
      
      if (!respuesta.ok) {
        throw new Error(`Estado de respuesta: ${respuesta.status}`);
      }
      
      const datos = await respuesta.json();
      setVideos(datos);
      setCategoriaActiva(consulta);
    } catch (err: any) {
      console.error(err);
      setError("Error al buscar videos. Intenta nuevamente.");
    } finally {
      setEstaCargando(false);
    }
  };

  /**
   * Maneja el cambio de categoría.
   * 
   * @param {string} consultaCategoria - Consulta de la categoría seleccionada
   */
  const manejarCambioCategoria = (consultaCategoria: string) => {
    buscarVideos(consultaCategoria);
  };

  /**
   * Abre el modal con el video seleccionado.
   * El modal internamente consumirá: GET /videos/get?id={videoId}
   * 
   * @param {number} videoId - ID del video a mostrar
   */
  const abrirModal = (videoId: number) => {
    setVideoSeleccionado(videoId);
  };

  /**
   * Cierra el modal de video.
   */
  const cerrarModal = () => {
    setVideoSeleccionado(null);
  };

  // Cargar videos populares al montar el componente
  useEffect(() => {
    buscarVideos("popular");
  }, []);

  return (
    <div className="movie-page">
      <div className="movie-page__header">
        <h1 className="movie-page__title">Películas</h1>
        <SearchBar alBuscar={buscarVideos} />
      </div>

      <div className="movie-page__container">
        <CategoryFilter
          categorias={CATEGORIAS}
          categoriaActiva={categoriaActiva}
          alCambiarCategoria={manejarCambioCategoria}
        />

        {error && (
          <div className="movie-page__error">
            <p>{error}</p>
          </div>
        )}

        {estaCargando ? (
          <div className="movie-page__loading">
            <div className="movie-page__spinner"></div>
            <p>Cargando videos...</p>
          </div>
        ) : (
          <div className="movie-page__grid">
            {videos.length === 0 ? (
              <div className="movie-page__empty">
                <p>No se encontraron videos. Intenta otra búsqueda.</p>
              </div>
            ) : (
              videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  alHacerClick={() => abrirModal(video.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {videoSeleccionado && (
        <VideoModal
          videoId={videoSeleccionado}
          alCerrar={cerrarModal}
        />
      )}
    </div>
  );
};

export default MoviePage;