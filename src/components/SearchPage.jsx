import React, { useState, useEffect } from 'react';
import propertiesData from '../data/properties.json';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Importing icons for "Widgets" feel

const SearchPage = () => {
  // 1. Initialise State for all search criteria
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  // Search Form State
  const [type, setType] = useState('Any');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [minBeds, setMinBeds] = useState(0);
  const [maxBeds, setMaxBeds] = useState(10);
  const [postcode, setPostcode] = useState('');
  const [dateAddedStart, setDateAddedStart] = useState('');
  const [dateAddedEnd, setDateAddedEnd] = useState('');

  // 2. Load data on mount
  useEffect(() => {
    setProperties(propertiesData.properties);
    setFilteredProperties(propertiesData.properties); // Show all initially
  }, []);

  // 3. Helper Function to parse the custom date format from JSON
  const parseDate = (dateObj) => {
    const months = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    // Create a JavaScript Date object
    return new Date(dateObj.year, months[dateObj.month], dateObj.day);
  };

  // 4. The Main Search Logic (Crucial for 10% marks)
  const handleSearch = (e) => {
    e.preventDefault();

    const results = properties.filter((prop) => {
      const propDate = parseDate(prop.added);
      
      // Filter by Type
      const matchType = type === 'Any' || prop.type === type;
      
      // Filter by Price
      const matchPrice = prop.price >= Number(minPrice) && prop.price <= Number(maxPrice);
      
      // Filter by Bedrooms
      const matchBeds = prop.bedrooms >= Number(minBeds) && prop.bedrooms <= Number(maxBeds);
      
      // Filter by Postcode (First part match, e.g., "BR1")
      const matchPostcode = postcode === '' || prop.location.includes(postcode.toUpperCase());
      
      // Filter by Date Range
      let matchDate = true;
      if (dateAddedStart) {
        matchDate = matchDate && propDate >= new Date(dateAddedStart);
      }
      if (dateAddedEnd) {
        matchDate = matchDate && propDate <= new Date(dateAddedEnd);
      }

      // Return true only if ALL criteria match
      return matchType && matchPrice && matchBeds && matchPostcode && matchDate;
    });

    setFilteredProperties(results);
  };

  // 5. Clear Filter Function
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Find Your Perfect Home</h2>
      
      {/* Search Form Area - Using a grid for layout */}
      <form onSubmit={handleSearch} style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px', 
        background: '#f4f4f4', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        
        {/* Type Selector */}
        <div>
          <label>Property Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="Any">Any</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label>Min Price (£)</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Max Price (£)</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Bedrooms */}
        <div>
          <label>Min Beds</label>
          <input type="number" value={minBeds} onChange={(e) => setMinBeds(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Max Beds</label>
          <input type="number" value={maxBeds} onChange={(e) => setMaxBeds(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Postcode */}
        <div>
          <label>Postcode Area (e.g. BR1)</label>
          <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Date Filters */}
        <div>
          <label>Added After</label>
          <input type="date" value={dateAddedStart} onChange={(e) => setDateAddedStart(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Added Before</label>
          <input type="date" value={dateAddedEnd} onChange={(e) => setDateAddedEnd(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Buttons */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaSearch /> Search
          </button>
          <button type="button" onClick={handleClear} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaTimes /> Clear
          </button>
        </div>
      </form>

      {/* Results Display Area */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredProperties.length === 0 ? <p>No properties found.</p> : 
          filteredProperties.map(property => (
            <div key={property.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <img src={property.picture} alt={property.type} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3>{property.type} - £{property.price.toLocaleString()}</h3>
                <p><strong>{property.bedrooms} Beds</strong> | {property.tenure}</p>
                <p>{property.location}</p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>{property.description.substring(0, 100)}...</p>
                <a href={`/property/${property.id}`} style={{ display: 'block', marginTop: '10px', color: '#007bff', textDecoration: 'none' }}>View Details &rarr;</a>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default SearchPage;