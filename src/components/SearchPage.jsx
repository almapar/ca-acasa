import React, { useState, useEffect } from 'react';
import propertiesData from '../data/properties.json';
import { FaSearch, FaTimes, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { DropdownList, NumberPicker, DatePicker, Combobox } from 'react-widgets';

const SearchPage = ({ favorites, addFavorite, removeFavorite, clearFavorites, searchTerm }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  const [type, setType] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minBeds, setMinBeds] = useState(null);
  const [maxBeds, setMaxBeds] = useState(null);
  const [postcode, setPostcode] = useState('');
  
  const [dateAddedStart, setDateAddedStart] = useState(null);
  const [dateAddedEnd, setDateAddedEnd] = useState(null);
  
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setProperties(propertiesData.properties);
    setFilteredProperties(propertiesData.properties);
  }, []);

  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
        const lowerTerm = searchTerm.toLowerCase();
        const results = properties.filter(p => 
            p.location.toLowerCase().includes(lowerTerm) || 
            p.description.toLowerCase().includes(lowerTerm) ||
            p.type.toLowerCase().includes(lowerTerm)
        );
        setFilteredProperties(results);
    } else {
        setFilteredProperties(properties);
    }
  }, [searchTerm, properties]);

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
      
      const matchType = !type || type === 'Any' || prop.type === type;
      
      const currentMinPrice = minPrice || 0;
      const currentMaxPrice = maxPrice || 100000000; 
      const matchPrice = prop.price >= currentMinPrice && prop.price <= currentMaxPrice;
      
      const currentMinBeds = minBeds || 0;
      const currentMaxBeds = maxBeds || 50;
      const matchBeds = prop.bedrooms >= currentMinBeds && prop.bedrooms <= currentMaxBeds;
      
      const safePostcode = postcode || ''; 
      const matchPostcode = safePostcode === '' || prop.location.toUpperCase().includes(safePostcode.toUpperCase());
      
      let matchDate = true;
      if (dateAddedStart) matchDate = matchDate && propDate >= dateAddedStart;
      if (dateAddedEnd) matchDate = matchDate && propDate <= dateAddedEnd;

      let matchGlobal = true;
      if (searchTerm && searchTerm.trim() !== '') {
          const lowerTerm = searchTerm.toLowerCase();
          matchGlobal = prop.location.toLowerCase().includes(lowerTerm) || 
                        prop.description.toLowerCase().includes(lowerTerm) ||
                        prop.type.toLowerCase().includes(lowerTerm);
      }

      return matchType && matchPrice && matchBeds && matchPostcode && matchDate && matchGlobal;
    });
    
    setFilteredProperties(results);
  };

  const handleClear = () => {
    setType(null);
    setMinPrice(null);
    setMaxPrice(null);
    setMinBeds(null);
    setMaxBeds(null);
    setPostcode('');
    setDateAddedStart(null);
    setDateAddedEnd(null);
    
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
          
          <div className="form-group widget-group">
              <label>Type</label>
              <DropdownList 
                data={['Any', 'House', 'Flat']}
                value={type}
                onChange={(value) => setType(value)}
                placeholder="Select Type..."
              />
          </div>
          
          <div className="form-group widget-group">
              <label>Min Price</label>
              <NumberPicker 
                value={minPrice} 
                onChange={value => setMinPrice(value)}
                min={0}
                step={10000}
                format="£ #,###"
                placeholder="e.g. 50,000"
              />
          </div>
          
          <div className="form-group widget-group">
              <label>Max Price</label>
              <NumberPicker 
                value={maxPrice} 
                onChange={value => setMaxPrice(value)}
                min={0}
                step={10000}
                format="£ #,###"
                placeholder="e.g. 700,000"
              />
          </div>
          
          <div className="form-group widget-group">
              <label>Min Beds</label>
              <NumberPicker 
                value={minBeds} 
                onChange={value => setMinBeds(value)}
                min={0}
                max={10}
                placeholder="e.g. 1"
              />
          </div>
          
          <div className="form-group widget-group">
              <label>Max Beds</label>
              <NumberPicker 
                value={maxBeds} 
                onChange={value => setMaxBeds(value)}
                min={0}
                max={10}
                placeholder="e.g. 5"
              />
          </div>
          
          <div className="form-group widget-group">
            <label>Postcode</label>
            <Combobox 
              data={[...new Set(properties.map(p => p.location.split(' ').pop()))]} 
              value={postcode}
              onChange={value => setPostcode(value)}
              placeholder="e.g. BR5"
              suggest={true}
            />
          </div>
          
          <div className="form-group widget-group">
              <label>Added After</label>
              <DatePicker 
                value={dateAddedStart}
                onChange={value => setDateAddedStart(value)}
                placeholder="Select date..."
              />
          </div>
          
          <div className="form-group widget-group">
              <label>Added Before</label>
              <DatePicker 
                value={dateAddedEnd}
                onChange={value => setDateAddedEnd(value)}
                placeholder="Select date..."
              />
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

      <div className="results-container">
        {filteredProperties.length === 0 ? <p>No results found.</p> :
        filteredProperties.map(property => {
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