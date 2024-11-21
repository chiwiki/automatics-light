import React, { useState } from "react";
import { ChromePicker } from "react-color";

const ColorPickerMQTT = ({ client }) => {
  const [color, setColor] = useState({ rgb: { r: 255, g: 255, b: 255 } });
  const [hexColor, setHexColor] = useState("#00F");
  const [isOpen, setIsOpen] = useState(false);
  const handleColorChange = (selectedColor) => {
    // Cập nhật màu được chọn
    setColor({ rgb: selectedColor.rgb });
    setHexColor(selectedColor.hex);
    const color = `${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b}`;
    console.log("SELECT COLOR::", color);
    document.documentElement.style.setProperty("--dynamic-color", color);
    // Gửi thông số RGB qua MQTT
    const message = JSON.stringify({
      r: selectedColor.rgb.r,
      g: selectedColor.rgb.g,
      b: selectedColor.rgb.b,
    });
    client.publish("home/light/color", message);
  };

  return (
    <div className="w-[500px] max-sm:w-full  h-fit px-4 py-2 rounded-[4px] shadow-md bg-white  mx-auto mb-[10px] mt-[8px]">
      <h3 className="text-black text-center">Chọn màu cho đèn LED</h3>
      <div className="w-full flex justify-between items-center">
        <span>Màu đèn hiện tại</span>
        <button
          className={`size-8 rounded`}
          style={{ backgroundColor: hexColor }}
          onClick={() => setIsOpen(true)}
        />
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/40 z-50 ">
          <div className="w-[500px] h-fit py-4 px-3 flex flex-col items-center justify-center gap-3 bg-white ">
            <ChromePicker color={hexColor} onChange={handleColorChange} />
            <button
              className="px-5 py-1 rounded"
              onClick={() => setIsOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerMQTT;
