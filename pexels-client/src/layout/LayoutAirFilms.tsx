import React from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import "./LayoutAirFilms.scss";

interface PropiedadesLayoutAirFilms {
  children: React.ReactNode;
}

const LayoutAirFilms: React.FC<PropiedadesLayoutAirFilms> = ({ children }) => {
  return (
    <div className="layout-airfilms">
      <Navbar />
      <main className="layout-airfilms__content">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutAirFilms;