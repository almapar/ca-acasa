import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import propertiesData from './data/properties.json'; // Importing your data

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
          <Route path="/" element={<h1>Welcome to Estate Agent App</h1>} />
          <Route path="/search" element={<h1>Search Page (Coming Soon)</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;