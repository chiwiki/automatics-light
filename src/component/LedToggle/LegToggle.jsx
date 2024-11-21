import React from "react";
import "./home2.css";
const LedToggle = ({ client, setStatus, status }) => {
  const handleLightToggle = (action) => {
    if (client) {
      setStatus(status === "ON" ? "OFF" : "ON");
      const dataToSend = JSON.stringify({ status: action });
      client.publish("home/light/control", dataToSend);
    }
  };
  return (
    <div className="w-[500px] max-sm:w-full  h-fit px-4 py-2 rounded-[4px] shadow-md bg-white  mx-auto mb-[10px] mt-[8px] flex item-center justify-between relative max-sm:py-4">
      <span>Điều khiển đèn thủ công: </span>
      <label className="switch" htmlFor="switch">
        <input
          onClick={() => handleLightToggle(status === "ON" ? "OFF" : "ON")}
          id="switch"
          className="toggle"
          type="checkbox"
          checked={status === "ON" ? true : false}
        />
        <span className="toggle slider round"></span>
      </label>
    </div>
  );
};

export default LedToggle;
