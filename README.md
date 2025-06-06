# React Steganography App

A modern React application for hiding and extracting secret messages within images using the **Least Significant Bit (LSB)** steganography technique.

---

## What is Steganography?

> Steganography is the practice of concealing secret data within an ordinary, non-secret file or message to avoid detection. Unlike encryption, steganography hides the **existence** of the information itself.

---

## Features

- **Encode**: Hide secret text messages in images
- **Decode**: Extract hidden messages from encoded images
- **Image Processing**: Utilizes HTML5 Canvas API for pixel manipulation
- **Download Support**: Save the encoded images to your device
- **User-Friendly Interface**: Smooth and intuitive design using React

---

## How It Works

### Encoding Process:
1. User uploads a `.png` image
2. Enters a secret message
3. The message is converted to binary
4. LSB of each RGB pixel is replaced with bits of the message
5. Encoded image is shown and available for download

### Decoding Process:
1. User uploads an encoded image
2. LSBs from RGB pixels are read
3. Bits are converted back to characters
4. Hidden message is extracted and displayed

---

## Technologies Used

- **React** `v19.1.0`
- **React Router** `v7.6.1`
- **JavaScript (ES6+)**
- **HTML5 Canvas API** for pixel-level image manipulation
- **CSS** for styling

---

## Project Structure

```plaintext
/src
│
├── components/
│   ├── HomePage.jsx         # Landing screen with navigation
│   ├── Encode.jsx           # Component to encode messages into images
│   └── Decode.jsx           # Component to decode messages from images
│
├── utils/
│   └── steganography.js     # Core encoding/decoding logic
│
├── App.jsx                  # Main app router
└── index.js                 # Entry point
