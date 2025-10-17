import React from "react";
import type { ResultadoBusquedaVideo } from "../../types/video.types";
import "./video-card.scss";

/**
 * Propiedades para el componente VideoCard.
 */
interface PropiedadesVideoCard {
  video: ResultadoBusquedaVideo;
  alHacerClick: () => void;
}

/**
 * Tarjeta que muestra la miniatura de un video.
 * Al hacer clic, ejecuta la función proporcionada para mostrar el video completo.
 * 
 * @component
 * @param {PropiedadesVideoCard} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta clickeable con miniatura del video
 */
const VideoCard: React.FC<PropiedadesVideoCard> = ({ video, alHacerClick }) => {
  return (
    <article className="video-card" onClick={alHacerClick}>
      <div className="video-card__image-container">
        <img
          src={video.thumbnail}
          alt={`Video ${video.id}`}
          className="video-card__image"
          loading="lazy"
        />
        <div className="video-card__overlay">
          <svg 
            className="video-card__play-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="video-card__info">
        <p className="video-card__id">ID: {video.id}</p>
      </div>
    </article>
  );
};

export default VideoCard;