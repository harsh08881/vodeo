import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Header.css';
import logo from '../../assets/logo.png'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="App Logo" className="header-logo-img" />
          <span>Vodeo</span>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/vid" className="nav-link">Start a Call</Link> {/* Link to /vid */}
          <Link to="/profile" className="nav-link">Profile</Link>
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
