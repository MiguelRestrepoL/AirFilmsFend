import React, { useEffect, useState } from "react";
import type { Video } from "../../types/video.types";
import "./video-modal.scss";

/**
 * Propiedades para el componente VideoModal.
 */
interface PropiedadesVideoModal {
  videoId: number;
  alCerrar: () => void;
}

/**
 * Modal que muestra los detalles completos de un video.
 * Obtiene la información completa del video desde el backend.
 * 
 * @component
 * @param {PropiedadesVideoModal} props - Propiedades del componente
 * @returns {JSX.Element} Modal con reproductor de video y detalles
 */
const VideoModal: React.FC<PropiedadesVideoModal> = ({ videoId, alCerrar }) => {
  const [video, setVideo] = useState<Video | null>(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerVideo = async () => {
      try {
        setEstaCargando(true);
        const url = `${import.meta.env.VITE_API_LOCAL_URL}/videos/get?id=${videoId}`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
          throw new Error(`Estado de respuesta: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        setVideo(datos);
      } catch (err: any) {
        console.error(err);
        setError("Error al cargar el video");
      } finally {
        setEstaCargando(false);
      }
    };

    obtenerVideo();
  }, [videoId]);

  // Cerrar modal al presionar Escape
  useEffect(() => {
    const manejarEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        alCerrar();
      }
    };

    document.addEventListener("keydown", manejarEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", manejarEscape);
      document.body.style.overflow = "unset";
    };
  }, [alCerrar]);

  // Obtener el archivo de video de mejor calidad
  const obtenerVideoMejorCalidad = () => {
    if (!video?.video_files) return null;
    
    const calidades = ["hd", "sd", "hls"];
    for (const calidad of calidades) {
      const archivo = video.video_files.find(f => f.quality === calidad);
      if (archivo) return archivo;
    }
    
    return video.video_files[0];
  };

  const archivoVideo = video ? obtenerVideoMejorCalidad() : null;

  return (
    <div className="video-modal" onClick={alCerrar}>
      <div className="video-modal__content" onClick={(e) => e.stopPropagation()}>
        <button
          className="video-modal__close"
          onClick={alCerrar}
          aria-label="Cerrar modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
          </svg>
        </button>

        {estaCargando && (
          <div className="video-modal__loading">
            <div className="video-modal__spinner"></div>
            <p>Cargando video...</p>
          </div>
        )}

        {error && (
          <div className="video-modal__error">
            <p>{error}</p>
          </div>
        )}

        {video && archivoVideo && (
          <>
            <div className="video-modal__player">
              <video
                controls
                autoPlay
                poster={video.image}
                className="video-modal__video"
              >
                <source src={archivoVideo.link} type={archivoVideo.file_type} />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

            <div className="video-modal__info">
              <h2 className="video-modal__title">Video ID: {video.id}</h2>
              
              <div className="video-modal__details">
                <div className="video-modal__detail">
                  <span className="video-modal__label">Duración:</span>
                  <span className="video-modal__value">{video.duration}s</span>
                </div>
                
                <div className="video-modal__detail">
                  <span className="video-modal__label">Resolución:</span>
                  <span className="video-modal__value">
                    {video.width} x {video.height}
                  </span>
                </div>
                
                <div className="video-modal__detail">
                  <span className="video-modal__label">Calidad:</span>
                  <span className="video-modal__value">
                    {archivoVideo.quality.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="video-modal__formats">
                <h3>Formatos disponibles:</h3>
                <ul>
                  {video.video_files.map((archivo) => (
                    <li key={archivo.id}>
                      {archivo.quality.toUpperCase()} - {archivo.width}x{archivo.height} 
                      ({archivo.file_type})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoModal;