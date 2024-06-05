import React from "react";

const Advantages = () => {
  return (
    <div class="advantages-section">
      <h2>
        New York Taxi <span class="highlight">Advantages</span>.
      </h2>
      <div class="advantages-container">
        <div class="advantage-item">
          <img
            src={require("../images/customer-support-icon.png")}
            alt="Customer Support"
            class="advantage-icon"
          />
          <h3>24/7 Customer Online Support</h3>
          <p>Call us Anywhere Anytime</p>
        </div>
        <div class="advantage-item highlight-background">
          <img
            src={require("../images/reservation-icon.png")}
            alt="Reservation"
            class="advantage-icon"
          />
          <h3>Reservation Anytime You Want</h3>
          <p>24/7 Online Reservation</p>
        </div>
        <div class="advantage-item">
          <img
            src={require("../images/picking-locations-icon.png")}
            alt="Picking Locations"
            class="advantage-icon"
          />
          <h3>Lots of Picking Locations</h3>
          <p>250+ Locations</p>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
