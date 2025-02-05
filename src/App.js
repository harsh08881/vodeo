import React, { useState } from 'react';
import GoogleLoginComponent from './component/Google'; // Your custom Google login component
import axios from 'axios';
import URL from './utils/constant';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import the CSS file
import LoadingProgressBar from './component/progressbar';
import photo from './assets/photo.png'
import login from './assets/Login.png'
import FeatureCards from './component/Cards';

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
      navigate('/video');
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
      <LoadingProgressBar/>
      <Header />
      <div className="app-container">
          <div className="login-container"> 
            
          <img src={login} alt="Description" width="150" />;
            <h2>Login to Continue</h2>
            <GoogleLoginComponent
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
            />
          </div>
          <div className='imagecontainer'>
            <img src={photo} alt="Description" width="300" />;

          </div>
      </div> 
      <FeatureCards/>

      <Footer />
    </div>
  );
};

export default App;
