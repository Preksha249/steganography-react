import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { decodeImage } from '../utils/steganography';

const Decode = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setDecodedMessage('');
      setError('');
    }
  };

  const handleDecode = async () => {
    if (!imageFile) return;
    
    setIsDecoding(true);
    setError('');
    setDecodedMessage('');
    
    try {
      const message = await decodeImage(imageFile);
      if (message) {
        setDecodedMessage(message);
      } else {
        setError('No hidden message found in this image.');
      }
    } catch (err) {
      console.error('Decoding error:', err);
      setError(err.message || 'Failed to decode message from image.');
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="decode-container" style={{color: "Black"}}>
      <h1>Decode Hidden Message</h1>
      <br/>
      <div className="decode-form">
        <div className="form-group">
          <label htmlFor="upload-encoded-image">Upload Encoded Image:</label>
          <input id="upload-encoded-image" type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <img src={image} alt="Selected" className="preview-image" />}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={handleDecode} 
          disabled={!image || isDecoding}
          className={isDecoding ? 'loading' : ''}
        >
          {isDecoding ? 'Decoding...' : 'Decode Message'}
        </button>
        
        {decodedMessage && (
          <div className="result-section">
            <h2>Decoded Message:</h2>
            <div className="message-box">
              <span style={{color: 'black'}}>{decodedMessage}</span>
            </div>
          </div>
        )}
      </div>
      
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default Decode;
