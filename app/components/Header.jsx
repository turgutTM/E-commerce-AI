import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="bg-[#f2f6f1] justify-center gap-[8rem] flex items-center min-h-screen px-12">
      <div className="flex w-[40%] flex-col items-start">
        <p className="font-semibold text-xl text-green-700 mb-2 uppercase tracking-wider">
          Trade-in-offer
        </p>

        <p className="text-6xl font-bold leading-tight text-gray-800 w-[32rem]">
          Super value deals{" "}
          <span className="text-gray-500">On all products</span>
        </p>

        <p className="mt-5 text-lg text-gray-600">
          Save more with coupons & up to{" "}
          <span className="text-green-700 font-bold">70% off</span>!
        </p>
        <Link href="/shop">
          <button className="bg-[#f1b8b8] hover:bg-[#e07a7a] p-3 rounded-lg mt-6 text-lg font-semibold text-gray-700 transition-all ease-in-out duration-300">
            Shop Now
          </button>
        </Link>
      </div>

      <div className="w-[40%] h-full  flex justify-center items-center">
        <img
          src="/model1.png"
          alt="Model Image"
          className="w-full h-full  object-cover drop-shadow-lg rounded-xl"
        />
      </div>
    </div>
  );
};

export default Header;
