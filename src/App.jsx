import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import PropertyPage from './components/PropertyPage';
import propertiesData from './data/properties.json';
import './index.css';

function App() {
  const [favorites, setFavorites] = useState([]);

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
              <Link to="/" style={{ fontSize:'1.2rem', fontWeight:'bold', color:'#1e293b' }}>ESTATE AGENT</Link>
              <Link to="/search">Search Properties</Link>
            </nav>

            <Routes>
              <Route path="/" element={
                <SearchPage 
                  favorites={favorites} 
                  addFavorite={addFavorite} 
                  removeFavorite={removeFavorite} 
                  clearFavorites={clearFavorites} 
                />
              } />
              <Route path="/search" element={
                <SearchPage 
                  favorites={favorites} 
                  addFavorite={addFavorite} 
                  removeFavorite={removeFavorite} 
                  clearFavorites={clearFavorites} 
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