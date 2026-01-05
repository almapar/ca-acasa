import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import propertiesData from '../data/properties.json';
import { 
  FaBed, FaMapMarkerAlt, FaRulerCombined, FaArrowLeft, 
  FaCamera, FaMap, FaChevronLeft, FaChevronRight, FaSearchPlus, FaHeart 
} from 'react-icons/fa';
import ImageViewer from './ImageViewer';
import '../index.css';

const PropertyPage = ({ favorites, addFavorite, removeFavorite }) => {
  const { id } = useParams();
  const property = propertiesData.properties.find(p => p.id === id);
  
  const [activeTab, setActiveTab] = useState('description');
  const [selectedMainImage, setSelectedMainImage] = useState(property ? property.picture : '');
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (property) {
      setSelectedMainImage(property.picture);
      setCurrentGalleryIndex(0);
    }
  }, [property?.id]);

  if (!property) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Property not found</h2>
        <Link to="/" className="back-link">Back to Search</Link>
      </div>
    );
  }

  const isFav = favorites.some(fav => fav.id === property.id);

  const fullGalleryImages = [property.picture];
  if (property.images && property.images.length > 0) {
    fullGalleryImages.push(...property.images);
  }
  if (property.floorplan) {
    fullGalleryImages.push(property.floorplan);
  }

  const thumbnailImages = [property.picture, ...(property.images || [])];

  // Handlers
  const handleThumbnailClick = (imgUrl, index) => {
    setSelectedMainImage(imgUrl);
    setCurrentGalleryIndex(index);
  };

  const openViewer = (index) => {
    setCurrentGalleryIndex(index); 
    setIsViewerOpen(true);
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); 
    const nextIndex = (currentGalleryIndex + 1) % thumbnailImages.length;
    setCurrentGalleryIndex(nextIndex);
    setSelectedMainImage(thumbnailImages[nextIndex]);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation(); 
    const prevIndex = (currentGalleryIndex - 1 + thumbnailImages.length) % thumbnailImages.length;
    setCurrentGalleryIndex(prevIndex);
    setSelectedMainImage(thumbnailImages[prevIndex]);
  };

  return (
    <div className="property-page-container">
      <Link to="/search" className="back-link">
         <FaArrowLeft /> Back to Search
      </Link>

      <ImageViewer 
        images={fullGalleryImages}
        initialIndex={currentGalleryIndex} 
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      <div className="property-header" style={{ marginBottom: '30px' }}>
        
        <div 
          className="image-container" 
          style={{ position: 'relative', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden' }}
          onClick={() => openViewer(currentGalleryIndex)}
        >
          <img 
            src={selectedMainImage} 
            alt={property.location} 
            style={{ width: '100%', height: '450px', objectFit: 'cover', transition: 'opacity 0.3s' }} 
          />
          
          {thumbnailImages.length > 1 && (
            <>
                <button className="image-nav-btn" onClick={handlePrevImage} style={{ left: '15px' }}>
                    <FaChevronLeft />
                </button>
                <button className="image-nav-btn" onClick={handleNextImage} style={{ right: '15px' }}>
                    <FaChevronRight />
                </button>
            </>
          )}

          <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <FaSearchPlus /> View Fullscreen
          </div>
        </div>

        {thumbnailImages.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {thumbnailImages.map((img, index) => {
               const isActive = index === currentGalleryIndex;
               return (
                <img 
                  key={index}
                  src={img} 
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => handleThumbnailClick(img, index)} 
                  style={{ 
                    width: '100px', height: '70px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                    border: isActive ? '3px solid var(--primary-color)' : '1px solid var(--border-color)',
                    flexShrink: 0, opacity: isActive ? '1' : '0.6'
                  }} 
                />
               );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-main)' }}>{property.location}</h1>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', margin: '0' }}>£{property.price.toLocaleString()}</h2>
          </div>
          
          <button 
             onClick={() => isFav ? removeFavorite(property.id) : addFavorite(property.id)}
             className={`btn-save ${isFav ? 'saved' : ''}`}
             style={{ 
                 display: 'flex', alignItems: 'center', gap: '8px', 
                 padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1',
                 background: 'var(--card-bg)', cursor: 'pointer', fontSize: '1rem',
                 color: isFav ? '#e11d48' : '#64748b'
             }}
          >
             <FaHeart /> {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="specs">
         <span><FaBed color="var(--primary-color)"/> <strong>{property.bedrooms}</strong> Bedrooms</span>
         <span><FaRulerCombined color="var(--primary-color)"/> <strong>{property.type}</strong></span>
         <span><FaMapMarkerAlt color="var(--primary-color)"/> {property.location.split(',').pop()}</span>
      </div>

      <div className="property-info-grid">
        
        <div className="tabs-container">
            <div className="tabs-header">
                <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
                    Description
                </button>
                <button className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
                    <FaMap /> Map
                </button>
                <button className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
                    <FaCamera /> Gallery
                </button>
            </div>

            <div className="tab-content">
                
                {activeTab === 'description' && (
                    <div className="fade-in">
                        <h3>Description</h3>
                        <p>{property.description}</p>
                        
                        <h3 style={{ marginTop: '30px' }}>Floor Plan</h3>
                        <div className="floorplan-container">
                            {property.floorplan ? (
                                <img src={property.floorplan} alt="Floor Plan" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                            ) : (
                                <div style={{ padding: '40px', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
                                    <FaRulerCombined size={40} color="#cbd5e1"/>
                                    <p>Floor plan not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="fade-in">
                        <iframe 
                            title="Property Location"
                            width="100%" height="400" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                            style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        >
                        </iframe>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="fade-in">
                        {property.images && property.images.length > 0 ? (
                            <div className="gallery-grid">
                                {property.images.map((img, index) => (
                                    <img 
                                        key={index}
                                        src={img} 
                                        alt={`Gallery ${index + 1}`}
                                        className="gallery-thumb"
                                        onClick={() => openViewer(index + 1)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                <FaCamera size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <p>No additional images available for this property.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>

        <div className="agent-card">
           <h3>Interested?</h3>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
             Contact our estate agents today to book a viewing for this property.
           </p>
           <button className="btn-primary" style={{ marginBottom: '10px' }}>
             Book Viewing
           </button>
           <button className="btn-secondary" style={{ width: '100%' }}>
             Call Agent
           </button>
        </div>

      </div>
    </div>
  );
};

export default PropertyPage;