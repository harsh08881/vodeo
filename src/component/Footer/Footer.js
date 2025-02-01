import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="App Logo" className="footer-logo-img" />
        </div>
        <div className="footer-links">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/terms-of-service" className="footer-link">Terms of Service</a>
          <a href="/contact-us" className="footer-link">Contact Us</a>
        </div>
      </div>
      <div className="footer-socials">
        <a href="https://twitter.com/yourapp" target="_blank" rel="noopener noreferrer" className="social-icon">Twitter</a>
        <a href="https://facebook.com/yourapp" target="_blank" rel="noopener noreferrer" className="social-icon">Facebook</a>
        <a href="https://instagram.com/yourapp" target="_blank" rel="noopener noreferrer" className="social-icon">Instagram</a>
      </div>
      <p className="footer-text">© 2025 YourApp. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
