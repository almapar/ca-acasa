import React, { useState, useEffect } from 'react';
import propertiesData from '../data/properties.json';
import { FaSearch, FaTimes, FaTrash, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Receive props from App.jsx
const SearchPage = ({ favorites, addFavorite, removeFavorite, clearFavorites }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  // Search States
  const [type, setType] = useState('Any');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [minBeds, setMinBeds] = useState(0);
  const [maxBeds, setMaxBeds] = useState(10);
  const [postcode, setPostcode] = useState('');
  const [dateAddedStart, setDateAddedStart] = useState('');
  const [dateAddedEnd, setDateAddedEnd] = useState('');

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

  // --- DRAG AND DROP HANDLERS ---
  
  const handleDragStart = (e, propertyId) => {
    // Store the ID of the item being dragged
    e.dataTransfer.setData("text/plain", propertyId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const propertyId = e.dataTransfer.getData("text/plain");
    // Logic: If we drop here, we ADD to favorites
    addFavorite(propertyId);
  };

  const handleDragOver = (e) => {
    // Necessary to allow dropping
    e.preventDefault();
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px', flexDirection: 'column' }}>
      
      {/* Container for Search + Favourites Sidebar */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN: Search Form */}
        <div style={{ flex: 3 }}>
           <h2>Property Search</h2>
           <form onSubmit={handleSearch} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '10px', 
            background: '#f4f4f4', 
            padding: '15px', 
            borderRadius: '8px'
          }}>
            {/* ... (Existing Inputs - keeping them brief for copy/paste safety) ... */}
            <div><label>Type</label><select value={type} onChange={e => setType(e.target.value)} style={{width:'100%'}}><option>Any</option><option>House</option><option>Flat</option></select></div>
            <div><label>Min Price</label><input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{width:'100%'}}/></div>
            <div><label>Max Price</label><input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{width:'100%'}}/></div>
            <div><label>Min Beds</label><input type="number" value={minBeds} onChange={e => setMinBeds(e.target.value)} style={{width:'100%'}}/></div>
            <div><label>Max Beds</label><input type="number" value={maxBeds} onChange={e => setMaxBeds(e.target.value)} style={{width:'100%'}}/></div>
            <div><label>Postcode</label><input value={postcode} onChange={e => setPostcode(e.target.value)} style={{width:'100%'}}/></div>
            <div><label>After</label><input type="date" value={dateAddedStart} onChange={e => setDateAddedStart(e.target.value)} style={{width:'100%'}}/></div>
            <div><label>Before</label><input type="date" value={dateAddedEnd} onChange={e => setDateAddedEnd(e.target.value)} style={{width:'100%'}}/></div>
            
            <div style={{ gridColumn: '1 / -1', marginTop:'10px' }}>
              <button type="submit" style={{ marginRight:'10px', padding:'8px 16px', background:'#007bff', color:'white', border:'none', borderRadius:'4px' }}>Search</button>
              <button type="button" onClick={handleClear} style={{ padding:'8px 16px', background:'#6c757d', color:'white', border:'none', borderRadius:'4px' }}>Clear</button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Favourites Drop Zone */}
        <div 
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
          style={{ 
            flex: 1, 
            minWidth: '250px', 
            background: '#e9ecef', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '2px dashed #6c757d'
          }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <FaHeart color="red" /> Favourites
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Drag properties here to save</p>
          
          {favorites.length === 0 && <p>No favorites yet.</p>}
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {favorites.map(fav => (
              <li key={fav.id} style={{ background: 'white', marginBottom: '10px', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>{fav.location}</span>
                <button onClick={() => removeFavorite(fav.id)} style={{ border:'none', background:'transparent', color:'red', cursor:'pointer' }}>
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
          
          {favorites.length > 0 && (
            <button onClick={clearFavorites} style={{ width: '100%', padding: '5px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* RESULTS GRID */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredProperties.map(property => {
          const isFav = favorites.some(f => f.id === property.id);
          return (
            <div 
              key={property.id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, property.id)}
              style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: 'white' }}
            >
              <img src={property.picture} alt="prop" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3>£{property.price.toLocaleString()}</h3>
                <p>{property.type} - {property.bedrooms} Beds</p>
                <p>{property.location}</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <Link to={`/property/${property.id}`} style={{ textDecoration:'none', color:'#007bff' }}>View Details</Link>
                  
                  {/* Heart Button Logic */}
                  {isFav ? (
                     <button disabled style={{ border:'none', background:'transparent', color:'red' }}><FaHeart /></button>
                  ) : (
                     <button onClick={() => addFavorite(property.id)} style={{ border:'none', background:'transparent', color:'#ccc', cursor:'pointer' }}><FaHeart /></button>
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