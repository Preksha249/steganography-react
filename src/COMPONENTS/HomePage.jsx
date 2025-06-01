import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Steganography Tool</h1>
        <p>Hide and reveal messages within images</p>
      </div>
      
      <div className="nav-buttons">
        <Link to="/encode" className="nav-button">
          <div className="button-content">
            <i className="fas fa-lock"></i>
            <h2>Encode</h2>
            <p>Hide messages in images</p>
          </div>
        </Link>
        
        <Link to="/decode" className="nav-button">
          <div className="button-content">
            <i className="fas fa-unlock"></i>
            <h2>Decode</h2>
            <p>Reveal hidden messages</p>
          </div>
        </Link>
      </div>
      
      <div className="info-section">
        <p>Steganography is the practice of hiding secret data within an ordinary, non-secret file or message to avoid detection.</p>
      </div>
    </div>
  );
};

export default HomePage;
