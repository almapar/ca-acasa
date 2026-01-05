import React, { useState } from 'react';
import { FaTimes, FaPaperPlane, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required";
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        
        {isSubmitted ? (
          <div className="success-message">
            <h2>Thank you!</h2>
            <p>Your message has been sent. We will contact you shortly.</p>
          </div>
        ) : (
          <>
            <h2>Contact Us</h2>
            <p style={{ marginBottom: '20px', color: '#64748b' }}>
              Interested in a property? Send us a message.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label><FaUser /> Name</label>
                <input 
                  type="text" name="name" 
                  value={formData.name} onChange={handleChange} 
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label><FaEnvelope /> Email</label>
                <input 
                  type="email" name="email" 
                  value={formData.email} onChange={handleChange} 
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label><FaPhone /> Phone</label>
                <input 
                  type="tel" name="phone" 
                  value={formData.phone} onChange={handleChange} 
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  name="message" rows="4" 
                  value={formData.message} onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;