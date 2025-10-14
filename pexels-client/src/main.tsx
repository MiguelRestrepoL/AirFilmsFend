import React from "react";
import ReactDOM from "react-dom/client";
import RoutesAirFilms from "./routes/RoutesAirFilms";
import "./index.scss";

/**
 * Punto de entrada de la aplicación AirFilms.
 * Renderiza el componente de rutas en el elemento root del DOM.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RoutesAirFilms />
  </React.StrictMode>
);