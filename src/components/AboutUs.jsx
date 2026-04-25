import React from 'react';
import aboutImage from '../assets/about.png'; // adjust path if needed

const AboutUs = () => {
  return (
    <section className="about-us">
      <div className="container">
        <h2 className="section-title-left">About us</h2>
        <div className="about-content">
          <div className="about-image">
            <img src={aboutImage} alt="About Us" />
          </div>
          <div className="about-text">
            <p>
              Our goal is to make gifting simple, meaningful, and hassle-free. Whether you're celebrating 
              a birthday, anniversary, or any special moment, we help you find the perfect gift that 
              expresses your emotions effortlessly. With reliable service and a passion for spreading 
              happiness, we turn your special moments into unforgettable memories.
            </p>
            <button className="about-btn">About us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;