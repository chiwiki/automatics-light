import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import "./home.css";
import "./home2.css";

function Home() {
  const [lightStatus, setLightStatus] = useState("OFF");
  const [motionStatus, setMotionStatus] = useState("No motion");
  const [lightLevel, setLightLevel] = useState(0);
  const [mqttClient, setMqttClient] = useState(null);
  const [status, setStatus] = useState("OFF");
  const options = {
    username: process.env.REACT_APP_HIVEMQ_USERNAME,
    password: process.env.REACT_APP_HIVEMQ_PASSWORD,
  };
  useEffect(() => {
    console.log(process.env.REACT_APP_HIVEMQ_URL);
    const client = mqtt.connect(process.env.REACT_APP_HIVEMQ_URL, options);

    client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      setMqttClient(client);
      client.subscribe("home/light/status");
      client.subscribe("home/motion");
      client.subscribe("home/lightSensor");
    });

    client.on("message", (topic, message) => {
      if (topic === "home/light/status") {
        console.log("Light Status::", message.toString());
        setLightStatus(message.toString());
      } else if (topic === "home/motion") {
        setMotionStatus(message.toString());
      } else if (topic === "home/lightSensor") {
        console.log("LIGHT VALUE:::", message.toString());
        setLightLevel(message.toString());
      }
    });
    client.on("error", (err) => {
      console.error("Connection error: ", err);
    });

    client.on("close", () => {
      console.error("Closed!!!");
    });

    return () => {
      client.end();
    };
  }, []);

  const handleLightToggle = (action) => {
    if (mqttClient) {
      setStatus(status === "ON" ? "OFF" : "ON");
      mqttClient.publish("home/light/control", action);
    }
  };

  return (
    <div className=" ">
      <h1 className="!text-center !w-screen mt-4 mb-2">Đèn LED tự động</h1>
      <p>Light Status: {lightStatus === "OFF" ? "Tắt" : "Bật"}</p>
      <p>Motion Status: {motionStatus}</p>
      <p>
        Light Level:{" "}
        {lightLevel === "0" ? "Cường độ sáng mạnh" : "Cường độ sáng yếu"}
      </p>

      <div className="devide" />
      <div className="flex-center">
        <p>Điều khiển đèn thủ công: </p>
        {/* <button onClick={() => handleLightToggle("ON")} className="btn">
          Bật
        </button>
        <button onClick={() => handleLightToggle("OFF")} className="btn">
          Tắt
        </button> */}
        <label className="switch" htmlFor="switch">
          <input
            onClick={() => handleLightToggle(status === "ON" ? "OFF" : "ON")}
            id="switch"
            type="checkbox"
            checked={status === "ON" ? true : false}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <div id="lampadario">
        <input
          type="radio"
          value={lightStatus === "ON" ? "on" : "off"}
          checked={lightStatus === "ON" ? true : false}
        />
        <input type="radio" name="switch" value="off" disabled />
        <label htmlFor="switch"></label>
        <div id="filo"></div>
      </div>
    </div>
  );
}

export default Home;
