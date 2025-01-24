import React, { useState } from 'react';
import GoogleLoginComponent from './component/Google'; // Your custom Google login component
import axios from 'axios';
import URL from './utils/constant';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the CSS file

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLoginSuccess = async (credential) => {
    console.log('Login successful, credential:', credential);

    try {
      // Post the token to your backend server
      const response = await axios.post(`${URL}/google`, { token: credential });

      // Extract user data from server response
      const userData = response.data.token;
      console.log('Server response:', userData);
    
      // Update user state
      setUser(userData);

      // Optionally, persist user data to localStorage
      localStorage.setItem('token', userData);
      navigate('/vid');
    } catch (error) {
      console.error('Failed to verify token with server:', error.response?.data || error.message);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div>
      <Header />
      <div className="app-container">
        {!user ? (
          <div className="login-container">
            <h2>Login to Continue</h2>
            <GoogleLoginComponent
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
            />
          </div>
        ) : (
          <div className="profile-container">
            <h2>Welcome, {user.name}!</h2>
            <img src={user.picture} alt="Profile" style={{ width: 50, borderRadius: '50%' }} />
            <p>Email: {user.email}</p>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
