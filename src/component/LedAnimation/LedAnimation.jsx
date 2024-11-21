import React from "react";

import "./home.css";
const LedAnimation = ({ lightStatus }) => {
  return (
    <div id="lampadario">
      <input
        className="light"
        type="radio"
        value={lightStatus === "ON" ? "on" : "off"}
        checked={lightStatus === "ON" ? true : false}
      />
      <input
        type="radio"
        name="switch"
        value="off"
        disabled
        className="light"
      />
      <label htmlFor="switch"></label>
      <div id="filo"></div>
    </div>
  );
};

export default LedAnimation;
