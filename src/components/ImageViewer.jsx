import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import './ImageViewer.css';

const ImageViewer = ({ images, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  // reset state when opening a new image
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [isOpen, initialIndex]);

  // handle keyboard nav (esc to close, arrows to move)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]); // depend on currentIndex to ensure state is fresh

  if (!isOpen) return null;

  const nextImage = () => {
    setZoom(1); // reset zoom on slide change
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setZoom(1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3)); // max zoom 3x
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 1)); // min zoom 1x

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="viewer-controls">
          <div className="zoom-controls">
            <button onClick={zoomOut}><FaSearchMinus /></button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn}><FaSearchPlus /></button>
          </div>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="image-wrapper">
          {images.length > 1 && (
            <button className="nav-btn left" onClick={prevImage}><FaChevronLeft /></button>
          )}
          
          <img 
            src={images[currentIndex]} 
            alt="Fullscreen View" 
            style={{ transform: `scale(${zoom})` }}
            className="viewer-image"
          />

          {images.length > 1 && (
            <button className="nav-btn right" onClick={nextImage}><FaChevronRight /></button>
          )}
        </div>

        <div className="viewer-footer">
          Image {currentIndex + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;