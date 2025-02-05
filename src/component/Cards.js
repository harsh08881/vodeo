import React from "react";
import "./card.css";
import feature1 from "../assets/fast.png";
import feature2 from "../assets/secure.png";
import feature3 from "../assets/userfriendly.png";
import feature4 from "../assets/two.png";

const features = [
  { id: 1, name: "Fast Search", description: "Get results in milliseconds with our advanced search algorithm.", image: feature1 },
  { id: 2, name: "Secure Login", description: "Your data is safe with our top-tier security features.", image: feature2 },
  { id: 3, name: "User Friendly", description: "An intuitive interface that makes navigation effortless.", image: feature3 },
  { id: 4, name: "24/7 Support", description: "We provide round-the-clock support to assist you anytime.", image: feature4 },
];

const FeatureCards = () => {
  return (
    <>
    <div className="feature">
    <h1>How Vodeo Helps You</h1>
    <div className="feature-grid">
      {features.map((feature) => (
        <div key={feature.id} className="feature-card">
          <img src={feature.image} alt={feature.name} className="feature-image" />
          <h3 className="feature-title">{feature.name}</h3>
          <p className="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
    </div>
    </>
  );
};

export default FeatureCards;