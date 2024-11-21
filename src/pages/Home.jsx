import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

import ColorPicker from "../component/ColorPicker";
import LightTimer from "../component/LightTimer";
import LedAnimation from "../component/LedAnimation/LedAnimation";
import { getFullTime } from "../utils/getTime";
import LedToggle from "../component/LedToggle/LegToggle";
import LedDelay from "../component/LedDelay";
import Card from "../component/Card";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import { ImConnection } from "react-icons/im";
import { MdFlashlightOff } from "react-icons/md";
import { IoMdFlashlight } from "react-icons/io";
import { FaWalking } from "react-icons/fa";
import { MdPersonOff } from "react-icons/md";
import { LuMoon } from "react-icons/lu";
import { FiSun } from "react-icons/fi";

function Home() {
  const [startTime, setStartTime] = useState("");
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
      console.log("MQTT");
      if (startTime === "") {
        const data = JSON.stringify({ message: "GET_START_TIME" });
        client.publish("home/time/start/get", data);
      }

      client.subscribe("home/time/start");
      client.subscribe("home/light/status");
      client.subscribe("home/motion");
      client.subscribe("home/lightSensor");
    });

    client.on("message", (topic, message) => {
      if (topic === "home/light/status") {
        const result = JSON.parse(message.toString());
        console.log("RESULT::", result);
        setLightStatus(result.status);
      } else if (topic === "home/motion") {
        setMotionStatus(message.toString());
      } else if (topic === "home/lightSensor") {
        setLightLevel(message.toString());
      } else if (topic === "home/time/start") {
        console.log("______", message.toString());
        setStartTime(new Date().getTime() - parseFloat(message.toString()));
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

  return (
    <div className="w-full">
      <h1 className="!text-center !w-screen mt-4 mb-2 text-[20px] max-sm:text-[14px] uppercase">
        Đèn LED tự động
      </h1>
      <div className="w-full flex items-center justify-center whitespace-break-spaces flex-wrap">
        <Card
          Icon={startTime ? ImConnection : MdSignalWifiConnectedNoInternet0}
          content={startTime ? `${getFullTime(startTime)}` : "no connect"}
          title=" Thời gian hoạt động gần nhất"
        />
        <Card
          Icon={motionStatus === "No motion" ? MdPersonOff : FaWalking}
          content={
            motionStatus === "No motion"
              ? "Không có chuyển động"
              : "Phát hiện chuyển động"
          }
          title="Mức độ chuyển động"
        />
        <Card
          Icon={lightStatus === "OFF" ? MdFlashlightOff : IoMdFlashlight}
          content={lightStatus === "OFF" ? "Tắt" : "Bật"}
          title="Trạng thái đèn"
        />
        <Card
          Icon={lightLevel === "0" ? FiSun : LuMoon}
          content={lightLevel === "0" ? "Mức sáng cao" : "Mức sáng thấp"}
          title="Mức độ sáng"
        />
      </div>

      <LedToggle client={mqttClient} setStatus={setStatus} status={status} />

      {/* <LedAnimation lightStatus={lightStatus} /> */}
      <ColorPicker client={mqttClient} />
      <LightTimer client={mqttClient} startTime={startTime} />
      <LedDelay client={mqttClient} />
    </div>
  );
}

export default Home;
