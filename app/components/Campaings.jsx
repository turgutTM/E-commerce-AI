import React, { useState } from "react";

const Campaigns = () => {
  const [flipped, setFlipped] = useState([false, false]);

  const handleFlip = (index) => {
    setFlipped((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="p-20 flex justify-center gap-32 items-center ml-5">
      {[0, 1].map((index) => (
        <div
          key={index}
          className={`card-container ${flipped[index] ? "flipped" : ""}`}
        >
          <div
            className="card-front w-[42rem] h-[28rem] bg-cover bg-center"
            style={{ backgroundImage: "url('/orange-photo.jpg')" }}
          >
            <div className="flex flex-col ml-3 items-start justify-center gap-2 h-full text-white p-4">
              <p className="text-2xl font-thin">crazy deals</p>
              <p className="font-bold text-4xl">buy 1 get 1 free</p>
              <p className="font-light">
                The best classic dress is on sale at Cara
              </p>
              <button
                className="bg-transparent border-white border-[1px] text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => handleFlip(index)}
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="card-back w-[42rem] h-[28rem] bg-orange-500 flex flex-col items-center gap-1 justify-center text-white text-center">
            <p className="text-2xl font-light">
              The best deals are available during certain times of the year. We
              will notify you!
            </p>
            <button
              className=" border-white border-[1px] hover:text-black hover:bg-white duration-150 text-white font-semibold py-2 px-6 rounded-2xl mt-2"
              onClick={() => handleFlip(index)}
            >
              Go Back
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Campaigns;
