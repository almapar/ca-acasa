import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const StarterPage = () => {
  return (
    <div className="starter-page">
      <div className="starter-overlay"></div>

      <div className="starter-content">
        <div className="starter-logo">
          <svg 
            xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="logo-icon"
          >
            <path d="M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35"/>
            <path d="M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8"/>
            <path d="M15 18h6"/>
            <path d="M18 15v6"/>
          </svg>
          <h1>ca acasă</h1>
        </div>

        <h2 className="starter-motto">
          Nowhere else <span className="pink-text">like home</span>.
        </h2>
        <p className="starter-subtext">Luxury properties at your fingertips.</p>

        <Link to="/search" className="starter-btn">
          <FaSearch /> Start Searching
        </Link>
      </div>
    </div>
  );
};

export default StarterPage;