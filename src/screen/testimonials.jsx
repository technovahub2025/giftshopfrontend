import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import "../style/info.css";

const TestimonialsPage = () => {
  return (
    <div className="infoPage">
      <Header showHero={false} />

      <main className="infoMain">
        <div className="container">
          <div className="infoHeader">
            <h2 className="infoTitle">Testimonials</h2>
            <div className="infoSubtitle">What customers say about us.</div>
          </div>

          <div className="infoCard">
            <Testimonials />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;

