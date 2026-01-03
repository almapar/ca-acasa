import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import propertiesData from './data/properties.json'; // Importing your data
import SearchPage from './components/SearchPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/search">Search Properties</Link>
        </nav>

        {/* Routes define which component shows up */}
        <Routes>
        <Route path="/" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;