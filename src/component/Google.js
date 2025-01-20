import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = ({ onSuccess, onFailure }) => {
  return (
    <GoogleOAuthProvider clientId="256395872874-7f460egvfdrph8re8rr6udej0rkeolh8.apps.googleusercontent.com">
      <div>
        <GoogleLogin
          onSuccess={(response) => {
            const credential = response.credential;
            // Handle login success (e.g., send credential to server for verification)
            onSuccess(credential);
          }}
          onError={onFailure}
          useOneTap // Optional: to show Google One Tap login on page load
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
