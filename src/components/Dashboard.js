import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Stats from './Stats';
import WhatWeDo from './WhatWeDo';
import PopularGifts from './PopularGifts';
import AboutUs from './AboutUs';
import Testimonials from './Testimonials';
import Footer from './Footer';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, markAsExistingUser, isNewUser } = useAuth();

  const handleContinueToDashboard = () => {
    markAsExistingUser();
  };

  if (isNewUser) {
    return (
      <div className="welcome-overlay">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="logo">
              <span className="logo-gift">GIFT</span>
              <span className="logo-shop">SHOP</span>
            </div>
            <h2>Welcome to Gift Shop, {user?.name}!</h2>
            <p>
              Thank you for joining us! We're excited to help you celebrate every special moment 
              with thoughtful gifts. Let's get you started on your gifting journey.
            </p>
          </div>
          
          <div className="welcome-features">
            <div className="feature-item">
              <div className="feature-icon"> personalize </div>
              <h3>Personalized Gifts</h3>
              <p>Find the perfect gift tailored to your needs</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"> delivery </div>
              <h3>Fast Delivery</h3>
              <p>24-hour delivery to your doorstep</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"> support </div>
              <h3>Expert Support</h3>
              <p>Our team is here to help you anytime</p>
            </div>
          </div>
          
          <button 
            className="continue-btn"
            onClick={handleContinueToDashboard}
          >
            Continue to Dashboard
          </button>
          
          <button 
            className="logout-btn"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      <Stats />
      <WhatWeDo />
      <PopularGifts />
      <AboutUs />
      <Testimonials />
     
      <Footer />
    </div>
  );
};

export default Dashboard;
