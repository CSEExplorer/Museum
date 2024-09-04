import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import museum1 from './museum1.jpg'; // Adjust path as needed
import museum2 from './museum2.jpg'; // Adjust path as needed
import museum3 from './museum3.jpg'; // Adjust path as needed

const Cart = () => {
  const images = [museum1, museum2, museum3];

  const [cardImages, setCardImages] = useState([]);

  useEffect(() => {
    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    };

    const updateCardImages = () => {
      const newCardImages = Array.from({ length: 3 }, getRandomImage);
      setCardImages(newCardImages);
    };

    updateCardImages(); // Set initial images

    const intervalId = setInterval(updateCardImages, 3000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [images.length]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '1rem', 
      padding: '2rem',
      backgroundColor: '#FAEBEB' // Light background color for the container
    }}>
      {cardImages.map((image, index) => (
        <div key={index} className="card" style={{ 
          width: '18rem', 
          backgroundColor: '#ffffff', // White background for the card
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Shadow for card
          border: '2px solid #007bff' // Blue border for the card
        }}>
          <img src={image} className="card-img-top" alt={`Card ${index + 1}`} style={{ height: '12rem', objectFit: 'cover' }} />
          <div className="card-body">
            <h5 className="card-title" style={{ color: '#007bff' }}>Card title {index + 1}</h5> {/* Blue text color */}
            <p className="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>


            <Link 
  to="/information" 
  className="btn btn-primary" 
  style={{ 
    backgroundColor: '#1a73e8', 
    borderColor: '#1a73e8', 
    padding: '0.75rem 1.5rem', 
    borderRadius: '5px', 
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#fff'
  }}
>
  Learn More
</Link>

            

 {/* Blue button */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
