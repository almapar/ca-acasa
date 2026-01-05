import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import PropertyPage from './components/PropertyPage';
import propertiesData from './data/properties.json';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import './index.css';

function App() {
  const [favorites, setFavorites] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const addFavorite = (propertyId) => {
    if (!favorites.some(fav => fav.id === propertyId)) {
      const propertyToAdd = propertiesData.properties.find(p => p.id === propertyId);
      if (propertyToAdd) {
        setFavorites([...favorites, propertyToAdd]);
      }
    }
  };

  const removeFavorite = (propertyId) => {
    setFavorites(favorites.filter(fav => fav.id !== propertyId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <Router>
      <div className="App">
        <div className="app-container">
            <nav className="navbar">
              <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="lucide lucide-house-plus"
                >
                  <path d="M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35"/>
                  <path d="M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8"/>
                  <path d="M15 18h6"/>
                  <path d="M18 15v6"/>
                </svg>
                <span>ca acasă</span>
              </Link>

              <div className="nav-search">
                 <FaSearch className="search-icon" />
                 <input 
                    type="text" 
                    placeholder="Quick Search (Location, Description)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 {isMenuOpen ? <FaTimes /> : <FaBars />}
              </div>

              <div className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
                <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/search" className="nav-item" onClick={() => setIsMenuOpen(false)}>Properties</Link>
                <Link to="#" className="nav-item" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="#" className="nav-item" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={
                <SearchPage 
                  favorites={favorites} 
                  addFavorite={addFavorite} 
                  removeFavorite={removeFavorite} 
                  clearFavorites={clearFavorites}
                  searchTerm={searchTerm} 
                />
              } />
              <Route path="/search" element={
                <SearchPage 
                  favorites={favorites} 
                  addFavorite={addFavorite} 
                  removeFavorite={removeFavorite} 
                  clearFavorites={clearFavorites}
                  searchTerm={searchTerm}
                />
              } />
              <Route path="/property/:id" element={
                <PropertyPage 
                  favorites={favorites}
                  addFavorite={addFavorite}
                  removeFavorite={removeFavorite} 
                />
              } />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;