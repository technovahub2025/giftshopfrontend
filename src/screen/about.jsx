import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/info.css";

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="infoPage">
      <Header showHero={false} />

      <main className="infoMain">
        <div className="container">
          <div className="infoHeader">
            <h2 className="infoTitle">About us</h2>
            <div className="infoSubtitle">Gifts that feel personal—delivered fast.</div>
          </div>

          <div className="infoCard">
            <h3>What we do</h3>
            <p>
              GiftShop is a curated gifting store focused on quality, quick delivery, and a smooth shopping experience.
              From birthdays to anniversaries, we help you find something meaningful without the hassle.
            </p>
            <ul>
              <li>Curated gifts for every occasion</li>
              <li>Simple checkout with cash-on-delivery option</li>
              <li>Fast and safe delivery experience</li>
            </ul>

            <div className="infoLinkRow">
              <button className="infoBtn" type="button" onClick={() => navigate("/products")}>
                Browse products
              </button>
              <button className="infoBtn is-secondary" type="button" onClick={() => navigate("/contact")}>
                Contact us
              </button>
            </div>
          </div>

          <div className="infoGrid">
            <div className="infoCard">
              <h3>Our promise</h3>
              <p>Clear pricing, clean packaging, and helpful support if anything goes wrong.</p>
            </div>
            <div className="infoCard">
              <h3>Where we deliver</h3>
              <p>Currently serving select locations in India (starting with Chennai). We are expanding soon.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
