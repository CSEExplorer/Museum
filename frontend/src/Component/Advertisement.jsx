import React, { useState, useEffect } from 'react';

// Importing images directly
import advert1 from './advert1.jpg';
import adverti2 from './adverti2.jpg';
import advert4 from './advert4.jpg';

const Advertisement = () => {
  const images = [advert1, adverti2, advert4]; // Using the imported images

  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const changeImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
    };

    const intervalId = setInterval(changeImage, 2000);

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <div style={styles.container}>
      <div style={styles.imageSection}>
        <img
          src={currentImage}
          alt="Museum Exhibition"
          style={styles.image}
        />
      </div>
      <div style={styles.textSection}>
        <h2 style={styles.title}>Step into History</h2>
        <p style={styles.subtitle}>Discover the Wonders of the Past</p>
        <p style={styles.description}>
          Explore our latest exhibitions, featuring artifacts and stories from
          ancient civilizations, breathtaking art, and more. Experience the
          magic of the museum and dive deep into history like never before.
        </p>
        <a href="/tickets" style={styles.button}>
          Get Your Tickets Now
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f0f4f8',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  imageSection: {
    flex: 1,
    marginRight: '2rem',
  },
  image: {
    width: '100%',
    borderRadius: '10px',
  },
  textSection: {
    flex: 2,
    textAlign: 'left',
  },
  title: {
    fontSize: '2rem',
    color: '#1a73e8',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#555',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  button: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1a73e8',
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
};

export default Advertisement;
