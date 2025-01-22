import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src="your-logo.png" alt="App Logo" className="header-logo-img" />
        </div>
        <nav className="header-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/video-call" className="nav-link">Start a Call</a>
          <a href="/profile" className="nav-link">Profile</a>
        </nav>
        <div className="header-actions">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
