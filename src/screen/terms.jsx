import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/info.css";

const TermsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="infoPage">
      <Header showHero={false} />

      <main className="infoMain">
        <div className="container">
          <div className="infoHeader">
            <h2 className="infoTitle">Terms & Conditions</h2>
            <div className="infoSubtitle">Please read before placing an order.</div>
          </div>

          <div className="infoCard">
            <h3>Orders</h3>
            <ul>
              <li>Prices and availability may change without notice.</li>
              <li>Orders may be cancelled if an item is out of stock.</li>
              <li>Please provide accurate delivery details to avoid delays.</li>
            </ul>
          </div>

          <div className="infoCard">
            <h3>Delivery</h3>
            <ul>
              <li>Delivery timelines vary by location and availability.</li>
              <li>Delivery fees (if any) are shown in the cart/checkout summary.</li>
            </ul>
          </div>

          <div className="infoCard">
            <h3>Support</h3>
            <p>For any issues with your order, reach out through our Contact page and include your order ID if available.</p>
            <div className="infoLinkRow">
              <button className="infoBtn" type="button" onClick={() => navigate("/contact")}>
                Contact support
              </button>
              <button className="infoBtn is-secondary" type="button" onClick={() => navigate("/privacy")}>
                Privacy policy
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
