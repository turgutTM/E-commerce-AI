import React from "react";

const Campaigns = () => {
  return (
    <div className="p-20 flex justify-center gap-32 items-center ml-5">
      <div
        className="w-[42rem] h-[28rem] bg-cover bg-center"
        style={{ backgroundImage: "url('/orange-photo.jpg')" }}
      >
        <div className="flex flex-col ml-3 items-start justify-center gap-2 h-full  text-white p-4">
          <p className="text-2xl font-thin">crazy deals</p>
          <p className="font-bold text-4xl">buy 1 get 1 free</p>
          <p className="font-light">
            The best classic dress is on sale at Cara
          </p>
          <button className="bg-transparent border-white border-[1px] text-white font-bold  py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>
      </div>
      <div
        className="w-[42rem] h-[28rem] bg-cover bg-center"
        style={{ backgroundImage: "url('/orange-photo.jpg')" }}
      >
        <div className="flex flex-col ml-3 items-start justify-center gap-2 h-full  text-white p-4">
          <p className="text-2xl font-thin">crazy deals</p>
          <p className="font-bold text-4xl">buy 1 get 1 free</p>
          <p className="font-light">
            The best classic dress is on sale at Cara
          </p>
          <button className="bg-transparent border-white border-[1px] text-white font-bold  py-2 px-4 rounded mt-2">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
