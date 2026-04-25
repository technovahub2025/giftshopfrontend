import React from "react";
import "../../style/header.css";

const Header = () => {
  return (
    <div className="header">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">
          <span className="gift">GIFT</span>
          <span className="shop">SHOP</span>
        </div>

        <ul className="nav-links">
          <li className="active">Home</li>
          <li>About Us</li>
          <li>Products</li>
          <li>Testimonial</li>
          <li>Contact Us</li>
        </ul>

        <div className="right-section">
          <div className="cart">
            🛒
            <span className="badge">3</span>
          </div>

          <button className="signin-btn">Sign In</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <button className="explore-btn">Explore All</button>

        <img
          src="/images/gift1.png"
          alt="gift"
          className="img1"
        />

        <img
          src="/images/gift2.png"
          alt="gift"
          className="img2"
        />
      </div>
    </div>
  );
};

export default Header;