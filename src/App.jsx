import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import PropertyPage from './components/PropertyPage';
import StarterPage from './components/StarterPage';
import propertiesData from './data/properties.json';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import './index.css';


const Layout = ({ children, searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="App">
        <div className="app-container">
            <nav className="navbar">
              <Link to="/search" className="nav-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35"/><path d="M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8"/><path d="M15 18h6"/><path d="M18 15v6"/></svg>
                <span>ca acasă</span>
              </Link>

              <div className="nav-search">
                 <FaSearch className="search-icon" />
                 <input 
                    type="text" 
                    placeholder="Quick Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 {isMenuOpen ? <FaTimes /> : <FaBars />}
              </div>

              <div className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
                <Link to="/search" className="nav-item">Properties</Link>
              </div>
            </nav>
            {children}
        </div>
      </div>
  );
}

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('my-estate-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('my-estate-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (propertyId) => {
    if (!favorites.some(fav => fav.id === propertyId)) {
      const propertyToAdd = propertiesData.properties.find(p => p.id === propertyId);
      if (propertyToAdd) { setFavorites([...favorites, propertyToAdd]); }
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
      <Routes>
        <Route path="/" element={<StarterPage />} />

        <Route path="/search" element={
          <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
              <SearchPage 
                favorites={favorites} 
                addFavorite={addFavorite} 
                removeFavorite={removeFavorite} 
                clearFavorites={clearFavorites}
                searchTerm={searchTerm}
              />
          </Layout>
        } />

        <Route path="/property/:id" element={
          <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
              <PropertyPage 
                favorites={favorites}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite} 
              />
          </Layout>
        } />

      </Routes>
    </Router>
  );
}

export default App;