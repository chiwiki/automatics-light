import React, { useState } from "react";

const LedDelay = ({ client }) => {
  const [option, setOption] = useState(5);
  const setDelayTime = () => {
    console.log("Option::", option);
    const data = JSON.stringify({ lifetime: option });
    client.publish("home/light/delay/control", data);
  };
  return (
    <div className="w-[500px] max-sm:w-full h-fit px-4 py-2 rounded-[4px] shadow-md bg-white flex items-center justify-between gap-4 mx-auto mb-[40px]">
      <div className=" px-4 py-2 max-sm:flex max-sm:flex-col max-sm:items-start">
        <span className="text-[14px]">Thiết lập thời gian đèn sáng </span>
        <select
          value={option}
          className="border-none text-black text-center"
          onChange={(e) => setOption(e.target.value)}
        >
          <option value="5">5 giây</option>
          <option value="10">10 giây</option>
          <option value="15">15 giây</option>
          <option value="20">20 giây</option>
          <option value="25">25 giây</option>
          <option value="30">30 giây</option>
        </select>
      </div>
      <button className="py-1 px-3 rounded-[4px]" onClick={setDelayTime}>
        Thiết lập
      </button>
    </div>
  );
};

export default LedDelay;
