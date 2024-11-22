import React, { useState } from "react";
import { toast } from "react-hot-toast";

const LightTimer = ({ client, startTime }) => {
  const [turnOnTime, setTurnOnTime] = useState("");
  const [turnOffTime, setTurnOffTime] = useState("");

  const handleSetTimer = () => {
    if (!turnOffTime || !turnOnTime) {
      return toast.error("Không được để trống 2 thời gian bật và tắt");
    }
    let turnon, turnoff;
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const turnOnHour = turnOnTime.split(":")[0];
    const turnOnMinute = turnOnTime.split(":")[1];
    const turnOffHour = turnOffTime.split(":")[0];
    const turnOffMinute = turnOffTime.split(":")[1];

    if (turnOnHour <= currentHour && turnOffMinute < currentMinute) {
      turnon = new Date();
      turnon.setDate(currentTime.getDate() + 1);
    } else {
      turnon = new Date(currentTime);
    }
    if (turnOffHour < turnOnHour) {
      turnoff = new Date();
      turnoff.setDate(turnon.getDate() + 1);
    } else {
      turnoff = new Date();
      turnoff.setDate(turnon.getDate());
    }

    turnon.setHours(turnOnHour);
    turnon.setMinutes(turnOnMinute);
    turnon.setSeconds(0);

    turnoff.setHours(turnOffHour);
    turnoff.setMinutes(turnOffMinute);
    turnoff.setSeconds(0);
    console.log({
      turnon,
      turnoff,
    });

    const message = JSON.stringify({
      turnOnTime: turnon.getTime() - startTime,
      turnOffTime: turnoff.getTime() - startTime,
    });
    console.log(message);

    client.publish("home/time/control", message);
    toast.success("Đã hẹn giờ");
  };

  return (
    <div className="mx-auto w-[500px] max-sm:w-full  px-4 py-2 rounded-[4px] bg-white h-fit mb-[10px]">
      <h2 className="text-black text-center mb-2">
        Thiết lập hẹn giờ cho đèn LED
      </h2>
      <div className="w-full flex items-center justify-center">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col w-[200px] items-center gap-1">
            <div className="flex gap-2 w-full items-center justify-center">
              <span>Thời gian bật:</span>
              <input
                className="text-black w-[80px] text-center"
                type="time"
                value={turnOnTime}
                onChange={(e) => setTurnOnTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full items-center justify-center">
              <span>Thời gian tắt:</span>
              <input
                className="text-black w-[80px] text-center"
                type="time"
                min={turnOnTime}
                value={turnOffTime}
                onChange={(e) => setTurnOffTime(e.target.value)}
              />
            </div>
          </div>
          <button className="py-1 px-3 rounded-[4px]" onClick={handleSetTimer}>
            Thiết lập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightTimer;
