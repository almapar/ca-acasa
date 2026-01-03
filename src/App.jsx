import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import PropertyPage from './components/PropertyPage';
import propertiesData from './data/properties.json';

function App() {
  const [favorites, setFavorites] = useState([]);

  // Function to add a property to favorites (prevents duplicates)
  const addFavorite = (propertyId) => {
    // Check if already exists
    if (!favorites.some(fav => fav.id === propertyId)) {
      const propertyToAdd = propertiesData.properties.find(p => p.id === propertyId);
      if (propertyToAdd) {
        setFavorites([...favorites, propertyToAdd]);
      }
    }
  };

  // Function to remove a single property
  const removeFavorite = (propertyId) => {
    setFavorites(favorites.filter(fav => fav.id !== propertyId));
  };

  // Function to clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '1rem', background: '#333', color: '#fff', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Estate Agent</Link>
          <Link to="/search" style={{ color: '#fff', textDecoration: 'none' }}>Search Properties</Link>
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
    </Router>
  );
}

export default App;