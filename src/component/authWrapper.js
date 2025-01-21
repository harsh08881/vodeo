import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect to the home/login page
    }
  }, [token, navigate]);

  if (!token) {
    return null; // Prevent rendering if redirect hasn't happened yet
  }

  return children; // Render the wrapped component if authenticated
};

export default AuthWrapper;
