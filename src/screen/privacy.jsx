import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style/info.css";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="infoPage">
      <Header showHero={false} />

      <main className="infoMain">
        <div className="container">
          <div className="infoHeader">
            <h2 className="infoTitle">Privacy Policy</h2>
            <div className="infoSubtitle">How we collect and use your data.</div>
          </div>

          <div className="infoCard">
            <h3>Information we collect</h3>
            <ul>
              <li>Account details (name, email)</li>
              <li>Checkout details (phone, address)</li>
              <li>Order and cart details</li>
              <li>Basic device/usage information for improving the app</li>
            </ul>
          </div>

          <div className="infoCard">
            <h3>How we use it</h3>
            <ul>
              <li>To process orders and delivery</li>
              <li>To provide customer support</li>
              <li>To improve product and user experience</li>
            </ul>
          </div>

          <div className="infoCard">
            <h3>Your choices</h3>
            <p>
              You can log out anytime to remove local session data in your browser. For account deletion or data requests,
              contact us from the Contact page.
            </p>
            <div className="infoLinkRow">
              <button className="infoBtn" type="button" onClick={() => navigate("/contact")}>
                Contact us
              </button>
              <button className="infoBtn is-secondary" type="button" onClick={() => navigate("/terms")}>
                Terms & conditions
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
