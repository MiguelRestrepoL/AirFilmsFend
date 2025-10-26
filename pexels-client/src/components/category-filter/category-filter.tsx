import React from "react";
import type { Categoria } from "../../types/movies.types";
import "./category-filter.scss";

/**
 * Propiedades para el componente CategoryFilter.
 */
interface PropiedadesCategoryFilter {
  categorias: Categoria[];
  categoriaActiva: string;
  alCambiarCategoria: (consultaCategoria: string) => void;
}

/**
 * Filtro de categorías con botones para navegar entre diferentes tipos de videos.
 * 
 * @component
 * @param {PropiedadesCategoryFilter} props - Propiedades del componente
 * @returns {JSX.Element} Lista horizontal de botones de categoría
 */
const CategoryFilter: React.FC<PropiedadesCategoryFilter> = ({
  categorias,
  categoriaActiva,
  alCambiarCategoria,
}) => {
  return (
    <div className="category-filter">
      <h2 className="category-filter__title">Categorías</h2>
      <div className="category-filter__list">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            className={`category-filter__button ${
              categoriaActiva === categoria.consulta ? "category-filter__button--active" : ""
            }`}
            onClick={() => alCambiarCategoria(categoria.consulta)}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;