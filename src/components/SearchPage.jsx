import React, { useState, useEffect } from 'react';
import propertiesData from '../data/properties.json';
import { FaSearch, FaTimes, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SearchPage = ({ favorites, addFavorite, removeFavorite, clearFavorites }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  const [type, setType] = useState('Any');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [minBeds, setMinBeds] = useState(0);
  const [maxBeds, setMaxBeds] = useState(10);
  const [postcode, setPostcode] = useState('');
  const [dateAddedStart, setDateAddedStart] = useState('');
  const [dateAddedEnd, setDateAddedEnd] = useState('');
  
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setProperties(propertiesData.properties);
    setFilteredProperties(propertiesData.properties);
  }, []);

  const parseDate = (dateObj) => {
    const months = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    return new Date(dateObj.year, months[dateObj.month], dateObj.day);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const results = properties.filter((prop) => {
      const propDate = parseDate(prop.added);
      const matchType = type === 'Any' || prop.type === type;
      const matchPrice = prop.price >= Number(minPrice) && prop.price <= Number(maxPrice);
      const matchBeds = prop.bedrooms >= Number(minBeds) && prop.bedrooms <= Number(maxBeds);
      const matchPostcode = postcode === '' || prop.location.includes(postcode.toUpperCase());
      let matchDate = true;
      if (dateAddedStart) matchDate = matchDate && propDate >= new Date(dateAddedStart);
      if (dateAddedEnd) matchDate = matchDate && propDate <= new Date(dateAddedEnd);
      return matchType && matchPrice && matchBeds && matchPostcode && matchDate;
    });
    setFilteredProperties(results);
  };

  const handleClear = () => {
    setType('Any');
    setMinPrice(0);
    setMaxPrice(2000000);
    setMinBeds(0);
    setMaxBeds(10);
    setPostcode('');
    setDateAddedStart('');
    setDateAddedEnd('');
    setFilteredProperties(properties);
  };

  const handleDragStart = (e, propertyId) => {
    e.dataTransfer.setData("text/plain", propertyId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const propertyId = e.dataTransfer.getData("text/plain");
    addFavorite(propertyId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="search-container">
      <div className="search-form-panel">
         <h2 style={{ marginBottom: '20px' }}>Property Search</h2>
         <form onSubmit={handleSearch} className="search-grid">
          
          <div className="form-group">
              <label>Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                  <option>Any</option><option>House</option><option>Flat</option>
              </select>
          </div>
          
          <div className="form-group">
              <label>Min Price</label>
              <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
          </div>
          
          <div className="form-group">
              <label>Max Price</label>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
          </div>
          
          <div className="form-group">
              <label>Min Beds</label>
              <input type="number" value={minBeds} onChange={e => setMinBeds(e.target.value)}/>
          </div>
          
          <div className="form-group">
              <label>Max Beds</label>
              <input type="number" value={maxBeds} onChange={e => setMaxBeds(e.target.value)}/>
          </div>
          
          <div className="form-group">
              <label>Postcode</label>
              <input value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="e.g. BR1"/>
          </div>
          
          <div className="form-group">
              <label>After</label>
              <input type="date" value={dateAddedStart} onChange={e => setDateAddedStart(e.target.value)}/>
          </div>
          
          <div className="form-group">
              <label>Before</label>
              <input type="date" value={dateAddedEnd} onChange={e => setDateAddedEnd(e.target.value)}/>
          </div>
          
          <div className="btn-group">
            <button type="submit" className="btn-primary"><FaSearch /> Search</button>
            <button type="button" onClick={handleClear} className="btn-secondary"><FaTimes /> Clear</button>
          </div>
        </form>
      </div>

      <div 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`favorites-panel ${isDragOver ? 'drag-over' : ''}`}
      >
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
           <FaHeart color="#ef4444" /> Favourites
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
          Drag properties here to save
        </p>
        
        {favorites.length === 0 && <p style={{fontStyle:'italic', color:'#94a3b8'}}>No favorites yet.</p>}
        
        <div className="fav-list">
          {favorites.map(fav => (
            <div key={fav.id} className="fav-item">
              <span>{fav.location}</span>
              <button onClick={() => removeFavorite(fav.id)} style={{ border:'none', background:'transparent', color:'#ef4444', cursor:'pointer' }}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        
        {favorites.length > 0 && (
          <button onClick={clearFavorites} style={{ width: '100%', marginTop:'10px', padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor:'pointer' }}>
            Clear All
          </button>
        )}
      </div>

      <div className="results-container" style={{ gridColumn: '1 / -1', width: '100%' }}>
        {filteredProperties.map(property => {
          const isFav = favorites.some(f => f.id === property.id);
          return (
            <div 
              key={property.id} 
              className="property-card"
              draggable 
              onDragStart={(e) => handleDragStart(e, property.id)}
            >
              <img src={property.picture} alt="prop" />
              <div className="card-content">
                <h3 className="card-price">£{property.price.toLocaleString()}</h3>
                <p className="card-details">
                    <strong>{property.type}</strong> • {property.bedrooms} Beds
                </p>
                <p className="card-details">{property.location}</p>
                
                <div className="card-actions">
                  <Link to={`/property/${property.id}`} style={{ textDecoration:'none', color:'#2563eb', fontWeight:'600' }}>
                    View Details
                  </Link>
                  
                  {isFav ? (
                     <button disabled style={{ border:'none', background:'transparent', color:'#ef4444' }}><FaHeart size={20}/></button>
                  ) : (
                     <button onClick={() => addFavorite(property.id)} style={{ border:'none', background:'transparent', color:'#cbd5e1', cursor:'pointer' }}><FaHeart size={20}/></button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;