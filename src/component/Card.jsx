import React from "react";

const Card = ({ title, content, Icon }) => {
  return (
    <div className="flex flex-col h-fit w-[200px] py-3 px-4 rounded bg-white gap-1 justify-center items-center m-1">
      <Icon size={30} />
      <p className="text-center">{title}</p>
      <span className="text-black text-center">{content}</span>
    </div>
  );
};

export default Card;
