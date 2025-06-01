/**
 * Steganography utility functions for encoding and decoding messages in images
 * using the Least Significant Bit (LSB) method
 */

// Constants (equivalent to Python implementation)
const BITS_PER_PIXEL = 3;
const BITS_PER_CHAR = 8;
const MAX_BIT_STUFFING = 2;
const DELIMITER = '%'; // Message delimiter

/**
 * Check if the message can be encoded in the image
 * @param {string} message - The message to encode
 * @param {Object} imageData - The image data (width and height)
 * @returns {boolean} - Whether the message can be encoded in the image
 */
function canEncode(message, imageData) {
  const { width, height } = imageData;
  const imageCapacity = width * height * BITS_PER_PIXEL;
  const messageCapacity = (message.length * BITS_PER_CHAR) - (BITS_PER_CHAR + MAX_BIT_STUFFING);
  
  if (imageCapacity < messageCapacity) {
    console.log("Not sufficient space");
    return false;
  } else {
    return true;
  }
}

/**
 * Convert a string to binary representation
 * @param {string} text - The text to convert
 * @returns {string} - Binary representation of the text
 */
function stringToBinary(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const binary = text.charCodeAt(i).toString(2);
    // Pad with 0s to ensure each character is 8 bits
    const paddedBinary = '0'.repeat(8 - binary.length) + binary;
    result += paddedBinary;
  }
  return result;
}

/**
 * Encode a message into an image using LSB steganography
 * @param {ImageData} imageData - The image data from canvas
 * @param {string} binaryData - The binary message to encode
 * @returns {ImageData} - The modified image data with encoded message
 */
function encode(imageData, binaryData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  let i = 0; // binary data index
  
  // Create a copy of the image data to avoid modifying the original
  const encodedData = new Uint8ClampedArray(data);
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Calculate the index in the flat array (RGBA format)
      const pixelIndex = (y * width + x) * 4;
      
      // Get the pixel values (RGB, ignore Alpha)
      const pixel = [
        encodedData[pixelIndex],     // R
        encodedData[pixelIndex + 1], // G
        encodedData[pixelIndex + 2]  // B
      ];
      
      // Modify each color channel (RGB)
      for (let n = 0; n < 3; n++) {
        if (i < binaryData.length) {
          // Clear the LSB and set it to the message bit
          // (pixel[n] & ~1) clears the LSB
          // | parseInt(binaryData[i]) sets it to the message bit
          pixel[n] = (pixel[n] & ~1) | parseInt(binaryData[i]);
          i++;
        }
      }
      
      // Put the modified pixel back
      encodedData[pixelIndex] = pixel[0];     // R
      encodedData[pixelIndex + 1] = pixel[1]; // G
      encodedData[pixelIndex + 2] = pixel[2]; // B
      // Alpha channel remains unchanged
    }
  }
  
  // Create new ImageData with the modified pixel values
  return new ImageData(encodedData, width, height);
}

/**
 * Decode a message from an image that has been encoded using LSB steganography
 * @param {ImageData} imageData - The image data from canvas
 * @returns {string} - The decoded message
 */
function decode(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  let binaryMessage = '';
  let result = '';
  
  // Extract the LSB from each color channel
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pixelIndex = (y * width + x) * 4;
      
      // Extract from each color channel (RGB)
      for (let n = 0; n < 3; n++) {
        // Extract the LSB from the current channel
        const lsb = data[pixelIndex + n] & 1;
        binaryMessage += lsb;
        
        // Check every 8 bits if we have a complete character
        if (binaryMessage.length % 8 === 0 && binaryMessage.length > 0) {
          const charIndex = binaryMessage.length - 8;
          const byte = binaryMessage.substring(charIndex, charIndex + 8);
          const decimal = parseInt(byte, 2);
          const char = String.fromCharCode(decimal);
          
          result += char;
          
          // Check if we've reached the delimiter
          if (char === DELIMITER) {
            // Remove the delimiter and return
            return result.slice(0, -1);
          }
        }
      }
    }
  }
  
  return result;
}

/**
 * Main function to handle encoding a message into an image
 * @param {File} imageFile - The image file
 * @param {string} message - The message to encode
 * @returns {Promise<string>} - Promise resolving to the data URL of the encoded image
 */
function encodeImage(imageFile, message) {
  return new Promise((resolve, reject) => {
    // Load the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to get the image data
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Check if the message can be encoded
        if (canEncode(message, imageData)) {
          // Add delimiter to the message
          const messageWithDelimiter = message + DELIMITER;
          
          // Convert message to binary
          const binaryMessage = stringToBinary(messageWithDelimiter);
          
          // Encode the message
          const encodedImageData = encode(imageData, binaryMessage);
          
          // Put the encoded image data back to canvas
          ctx.putImageData(encodedImageData, 0, 0);
          
          // Convert to data URL for display or download
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject(new Error("Not sufficient space in the image to encode the message"));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Main function to handle decoding a message from an image
 * @param {File} imageFile - The image file
 * @returns {Promise<string>} - Promise resolving to the decoded message
 */
function decodeImage(imageFile) {
  return new Promise((resolve, reject) => {
    // Load the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to get the image data
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Decode the message
        const decodedMessage = decode(imageData);
        resolve(decodedMessage);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(imageFile);
  });
}

// Export the functions
export {
  canEncode,
  stringToBinary,
  encode,
  decode,
  encodeImage,
  decodeImage
};
