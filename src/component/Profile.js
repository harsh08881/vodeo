import React from "react";
import useApiData from "../hooks/useFetchData"; // Assuming the hook is in the same folder
import "./Profile.css"; // Assuming you have a separate CSS file for styles
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Photo from '../assets/custom.png'

const Profile = () => {
  const { data, loading, error } = useApiData("/profile"); // Endpoint for fetching profile data

  //   if (loading) {
  //     return <div className="loading">Loading...</div>;
  //   }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Assuming data is an object with properties like name, email, etc.
  return (
    <>
      <Header />
      <div className="profile-container">
        <h2 className="profile-header">Profile</h2>
        {loading && <div className="loading">Loading...</div>}

        {data ? (
          <div className="profile-details">
            <div className="avatar">
              {/* Assuming an avatar image URL in data.avatar */}
              <img
                src={ Photo }
                alt="Profile Avatar"
              />
            </div>
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {data.name}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="no-data">No profile data available.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
