import React from 'react';
import photo from '../assets/loads.png';

const LazyLoadSpinner = () => {
  return (
    <>
      <div style={styles.container}>
        {/* Image Loader */}
        <div style={styles.imageContainer}>
          <img
            src={photo} 
            alt="Loading..."
            style={styles.image}
          />
        </div>

        {/* Spinner below the image */}
      </div>

      {/* Keyframes for Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    width: '400px',
    height: 'auto',
    overflow: 'hidden',
    borderRadius:'90%',
    animation: 'pulse 2s infinite ease-in-out',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '6px solid rgba(50, 205, 50, 0.3)', // Semi-transparent border
    borderTop: '6px solid #32cd32', // Solid green border
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

export default LazyLoadSpinner;
