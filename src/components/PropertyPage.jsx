import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; 
import propertiesData from '../data/properties.json';
import { FaArrowLeft, FaHeart } from 'react-icons/fa'; 

const PropertyPage = () => {
  const { id } = useParams();
  const property = propertiesData.properties.find(p => p.id === id);

  // State for the currently selected main image
  const [mainImage, setMainImage] = useState('');
  
  // State for the list of all images for this property
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (property) {
      // 1. Load the first image as the main one
      const initialImage = `/images/${property.id}_1.jpg`;
      setMainImage(initialImage);

      const imageList = [
        `/images/${property.id}_1.jpg`,
        `/images/${property.id}_2.jpg`,
        `/images/${property.id}_3.jpg`,
        `/images/${property.id}_4.jpg`,
        `/images/${property.id}_5.jpg`,
        `/images/${property.id}_6.jpg`
      ];
      setImages(imageList);
    }
  }, [property]); // Re-run this if the property changes

  if (!property) {
    return <div style={{ padding: '20px' }}>Property not found! <Link to="/">Return Home</Link></div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', textDecoration: 'none', color: '#333' }}>
            <FaArrowLeft /> Back to Search
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
                <h1>{property.location}</h1>
                <h2 style={{ color: '#007bff' }}>£{property.price.toLocaleString()}</h2>
            </div>
            <button style={{ padding: '10px 15px', background: 'white', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
                <FaHeart color="red" /> Save
            </button>
        </div>

        {/* GALLERY SECTION */}
        <div className="gallery-container">
            {/* Main Large Image */}
            <div style={{ marginBottom: '10px' }}>
                <img 
                  src={mainImage} 
                  alt="Main Property View" 
                  // Add an onError to fallback if an image is missing
                  onError={(e) => { e.target.src = '/images/prop1_1.jpg'; }} 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px' }} 
                />
            </div>

            {/* Thumbnails Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                {images.map((img, index) => (
                    <img 
                        key={index} 
                        src={img} 
                        alt={`View ${index + 1}`} 
                        onClick={() => setMainImage(img)}
                        onError={(e) => { e.target.style.display = 'none'; }} // Hide thumbnail if file missing
                        style={{ 
                            width: '100%', 
                            height: '80px', 
                            objectFit: 'cover', 
                            cursor: 'pointer', 
                            borderRadius: '4px',
                            border: mainImage === img ? '2px solid #007bff' : '2px solid transparent',
                            opacity: mainImage === img ? 1 : 0.7
                        }} 
                    />
                ))}
            </div>
        </div>

        {/* TABS SECTION */}
        <div style={{ marginTop: '30px' }}>
            <Tabs>
                <TabList>
                    <Tab>Description</Tab>
                    <Tab>Floor Plan</Tab>
                    <Tab>Google Map</Tab>
                </TabList>

                <TabPanel>
                    <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '5px' }}>
                        <h3>Property Description</h3>
                        <p>{property.description}</p>
                        <p><strong>Type:</strong> {property.type}</p>
                        <p><strong>Tenure:</strong> {property.tenure}</p>
                        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                        <p><strong>Date Added:</strong> {property.added.day} {property.added.month} {property.added.year}</p>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div style={{ padding: '20px', textAlign: 'center', background: '#f9f9f9' }}>
                        <p>Floor Plan Layout</p>
                        <div style={{ width: '100%', height: '300px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           Floor Plan Placeholder
                        </div>
                    </div>
                </TabPanel>

                <TabPanel>
                    <div style={{ padding: '20px', background: '#f9f9f9' }}>
                        <iframe 
                            width="100%" 
                            height="350" 
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            title="Property Map"
                            src={`https://maps.google.com/maps?q=${property.location}&t=&z=13&ie=UTF8&iwloc=&output=embed`}>
                        </iframe>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    </div>
  );
};

export default PropertyPage;