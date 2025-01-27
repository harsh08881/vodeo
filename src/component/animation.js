import React, { useState } from "react";
import "./animation.css";

const TransitionShowcase = () => {
  return (
    <div className="main">
      <div className="container">
        <div className="bus-details">
          <div className="flex">
            <div className="sa">
            <img
              src={require('../assets/air-conditioner-icon.png')}
              alt="Example placeholder"
            />
            <span>AC Bus</span>
            </div>
          </div>
          <div className="flex">
            <img
              src={require("../assets/travel_agency.png")}
              alt="Example placeholder"
            />
            <span>Yuvraj Bus Travels
            </span>
          </div>
          <div className="flex">
            <img
              src={require("../assets/list_bus.png")}
              alt="Example placeholder"

            />
            <span>Non Sleeper AC</span>
          </div>
          <div className="flex">
            <img
              src={require("../assets/timing.png")}
              alt="Example placeholder"
            />
            <span> 6H 36M</span>
          </div>
        </div>
        <div className="bus-time"></div>
        <div className="bus-price"></div>
      </div>
    </div>
  );
};

export default TransitionShowcase;
