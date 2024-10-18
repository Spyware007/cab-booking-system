import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen  bg-black items-center">
      <span className="inline-block w-[3px] h-5 bg-white/50 rounded-full animate-scaleUp"></span>
      <span className="inline-block w-[3px] h-[35px] bg-white/50 rounded-full mx-[5px] animate-scaleUp animation-delay-250"></span>
      <span className="inline-block w-[3px] h-5 bg-white/50 rounded-full animate-scaleUp animation-delay-500"></span>
    </div>
  );
};

export default Loader;
