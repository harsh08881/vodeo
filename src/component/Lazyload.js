import React, { useState, useEffect } from 'react';
import photo from '../assets/loads.webp'

const LazyLoadSpinner = () => {

  return (
    <div style={styles.container}>
      <img
          src={photo}// Replace with your spinner image URL
          alt="Loading..."
          style={styles.image}
        />
    </div>
  );
};

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
    },
    image: {
      width: "333px", /* Set your desired width */
      height: "333px", /* Set your desired height */
      borderRadius: "50%", /* Makes the image round */
      objectFit: "cover", /* Ensures the image scales without distortion */
      overflow: "hidden", /* Hides any part of the image outside the circle */
      border: "2px solid #ccc", /* Optional: Add a border around the image */
    },
  };
  

export default LazyLoadSpinner;
