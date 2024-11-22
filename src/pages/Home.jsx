import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

import ColorPicker from "../component/ColorPicker";
import LightTimer from "../component/LightTimer";
import { getFullTime, getFullTimeV2 } from "../utils/getTime";
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
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
function Home() {
  const [startTime, setStartTime] = useState("");
  const [log, setLog] = useState([]);
  const [lightStatus, setLightStatus] = useState("OFF");
  const [motionStatus, setMotionStatus] = useState("No motion");
  const [lightLevel, setLightLevel] = useState(0);
  const [mqttClient, setMqttClient] = useState(null);
  const [status, setStatus] = useState("OFF");
  const [openMenu, setOpenMenu] = useState(false);
  const options = {
    username: process.env.REACT_APP_HIVEMQ_USERNAME,
    password: process.env.REACT_APP_HIVEMQ_PASSWORD,
  };
  let prevStat = "OFF";
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

        if (result.status !== prevStat) {
          prevStat = result.status;
          console.log("status res", result.status);
          console.log("light current", lightStatus);
          const data = {
            ...result,
            created_at: new Date().getTime(),
          };
          setLog((prevLog) => [data, ...prevLog]);
        }

        if (result.method !== "sensor") {
          setStatus(result.status);
        }
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
    <div className="w-full flex items-center justify-between h-screen overflow-y-scroll px-3">
      <div className="w-[20%] bg-[#232946] border-r-2 border-black h-screen overflow-y-scroll flex flex-col max-sm:hidden">
        {log.length > 0 ? (
          log.map((data, i) => {
            return (
              <div
                className="w-full pl-10 px-3 py-1 border-b-2 border-[#232947] bg-[#0f0e17] shadow-md "
                key={i}
              >
                <p>
                  Trạng thái đèn:{" "}
                  <span className="text-white">{data.status}</span>
                </p>
                <p>
                  Nguyên nhân: <span className="text-white">{data.method}</span>
                </p>
                <p>
                  Thời gian:{" "}
                  <span className="text-white">
                    {getFullTimeV2(data.created_at)}
                  </span>
                </p>
              </div>
            );
          })
        ) : (
          <h2 className="text-center"> Chưa có log</h2>
        )}
      </div>
      {!openMenu && (
        <button
          className="sm:hidden fixed top-4 left-4"
          onClick={() => setOpenMenu(true)}
        >
          <IoMenu size={25} />
        </button>
      )}
      {openMenu && (
        <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-black/40">
          <div className="w-[80%] bg-[#232946] border-r-2 border-black h-screen overflow-y-scroll flex flex-col sm:hidden">
            <button
              className="text-right text-white  ml-auto block mt-[10px] mb-[5px] bg-transparent pr-4 "
              onClick={() => setOpenMenu(false)}
            >
              <IoClose size={25} />
            </button>
            {log.length > 0 ? (
              log.map((data, i) => {
                return (
                  <div
                    className="w-full pl-10 px-3 py-1 border-b-2 border-[#232947] bg-[#0f0e17] shadow-md "
                    key={i}
                  >
                    <p>
                      Trạng thái đèn:{" "}
                      <span className="text-white">{data.status}</span>
                    </p>
                    <p>
                      Nguyên nhân:{" "}
                      <span className="text-white">{data.method}</span>
                    </p>
                    <p>
                      Thời gian:{" "}
                      <span className="text-white">
                        {getFullTimeV2(data.created_at)}
                      </span>
                    </p>
                  </div>
                );
              })
            ) : (
              <h2 className="text-center"> Chưa có log</h2>
            )}
          </div>
        </div>
      )}

      <div className="max-sm:w-full w-[80%] h-screeen overflow-y-scroll overflow-x-scroll">
        <h1 className="w-full text-center mt-4 text-[20px] max-sm:text-[14px] uppercase mb-[20px]">
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
    </div>
  );
}

export default Home;
