import React, { useState } from 'react';
import GoogleLoginComponent from './component/Google'; // Your custom Google login component
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = async (credential) => {
    console.log('Login successful, credential:', credential);

    try {
      // Post the token to your backend server
      const response = await axios.post('http://localhost:3002/google', { token: credential });

      // Extract user data from server response
      const userData = response.data.token;
      console.log('Server response:', userData);
    

      // Update user state
      setUser(userData);

      // Optionally, persist user data to localStorage
      localStorage.setItem('token', userData);
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
      {!user ? (
        <div style={{width: '100px'}}>
        <GoogleLoginComponent
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <img src={user.picture} alt="Profile" style={{ width: 50, borderRadius: '50%' }} />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
