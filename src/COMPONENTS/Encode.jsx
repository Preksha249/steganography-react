import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { encodeImage } from '../utils/steganography';

const Encode = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setEncodedImage(null);
      setError('');
    }
  };

  const handleEncode = async () => {
    if (!imageFile || !message) return;
    
    setIsEncoding(true);
    setError('');
    
    try {
      const encodedDataUrl = await encodeImage(imageFile, message);
      setEncodedImage(encodedDataUrl);
    } catch (err) {
      console.error('Encoding error:', err);
      setError(err.message || 'Failed to encode message. Try a larger image or shorter message.');
    } finally {
      setIsEncoding(false);
    }
  };

  return (
    <div className="encode-container" style={{color: "Black"}}>
      <h1>Encode Secret Message</h1>
      <br/>
      <div className="encode-form">
        <div className="form-group">
          <label htmlFor="upload-image">Upload Image:</label>
          <input id="upload-image" type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <img src={image} alt="Selected" className="preview-image" />}
        </div>
        
        <div className="form-group">
          <label htmlFor="secret-message">Secret Message:</label>
          <textarea 
            id="secret-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your secret message here"
          />
          <p className="message-info">Message will be hidden using LSB steganography</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={handleEncode} 
          disabled={!image || !message || isEncoding}
          className={isEncoding ? 'loading' : ''}
        >
          {isEncoding ? 'Encoding...' : 'Encode Message'}
        </button>
        
        {encodedImage && (
          <div className="result-section">
            <h2>Encoded Image:</h2>
            <img src={encodedImage} alt="Encoded" className="result-image" />
            <a href={encodedImage} download="encoded-image.png" className="download-button">
              Download Encoded Image
            </a>
          </div>
        )}
      </div>
      
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default Encode;
