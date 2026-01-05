import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import propertiesData from '../data/properties.json';
import { 
  FaHeart, FaBed, FaMapMarkerAlt, FaArrowLeft, FaRulerCombined, FaSearchPlus,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import ImageViewer from './ImageViewer';

const PropertyPage = ({ favorites, addFavorite, removeFavorite }) => {
  const { id } = useParams();
  const property = propertiesData.properties.find(p => p.id === id);

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
    return <div style={{ padding: '20px', textAlign: 'center' }}><h2>Property not found</h2><Link to="/" className="btn-primary">Back to Search</Link></div>;
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
    <div className="property-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '600' }}>
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
            <button 
              className="image-nav-btn"
              onClick={handlePrevImage}
              style={{ left: '15px' }}
            >
              <FaChevronLeft />
            </button>
          )}

          {thumbnailImages.length > 1 && (
            <button 
              className="image-nav-btn"
              onClick={handleNextImage}
              style={{ right: '15px' }}
            >
              <FaChevronRight />
            </button>
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
                    width: '100px', 
                    height: '70px', 
                    objectFit: 'cover', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    border: isActive ? '3px solid var(--primary-color)' : '1px solid var(--border-color)',
                    flexShrink: 0,
                    opacity: isActive ? '1' : '0.6',
                    transition: 'all 0.2s'
                  }} 
                  onMouseOver={(e) => { if(!isActive) e.target.style.opacity = '1'; }}
                  onMouseOut={(e) =>  { if(!isActive) e.target.style.opacity = '0.6'; }}
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
          
          {isFav ? (
             <button onClick={() => removeFavorite(property.id)} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
               <FaHeart /> Saved
             </button>
          ) : (
             <button onClick={() => addFavorite(property.id)} className="btn-secondary">
               <FaHeart style={{ color: '#cbd5e1' }} /> Save
             </button>
          )}
        </div>
      </div>

      <div className="property-info-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        <div className="left-col">
          <div className="specs" style={{ display: 'flex', gap: '20px', padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaBed color="var(--primary-color)"/> <strong>{property.bedrooms}</strong> Bedrooms</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaRulerCombined color="var(--primary-color)"/> <strong>{property.type}</strong></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaMapMarkerAlt color="var(--primary-color)"/> {property.location.split(',').pop()}</span>
          </div>

          <h3>Description</h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '40px' }}>
            {property.description}
          </p>
          
          {property.floorplan && (
            <>
              <h3>Floor Plan</h3>
              <div 
                className="floorplan-container" 
                onClick={() => openViewer(fullGalleryImages.length - 1)}
                style={{ cursor: 'pointer' }}
              >
                 <img 
                   src={property.floorplan} 
                   alt="Floor Plan" 
                   style={{ width: '100%', maxWidth: '600px', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                 />
                 <p style={{ textAlign: 'center', color: 'var(--primary-color)', marginTop: '10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                    <FaSearchPlus /> Click to enlarge
                 </p>
              </div>
            </>
          )}
        </div>

        <div className="right-col">
          <div className="agent-card" style={{ padding: '25px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', position: 'sticky', top: '20px' }}>
            <h3>Interested?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Contact our estate agents today to book a viewing for this property.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Book Viewing</button>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Call Agent</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;