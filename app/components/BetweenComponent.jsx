import { useRouter } from "next/navigation";
import React from "react";

const BetweenComponent = () => {
  const router = useRouter();
  return (
    <div className="relative h-[24rem]">
      <div className="bg-custom-background object-cover h-full w-full"></div>
      <div className="absolute top-0 left-0 h-full w-full bg-black opacity-60"></div>
      <div className="w-full h-full gap-3 flex flex-col justify-center items-center text-white font-bold absolute top-0 left-0">
        <p className="text-xl font-bold">Repair Services</p>
        <p className="text-3xl font-bold">
          Up to <span className="text-orange-500">70% Off</span> - All
          Technology Porducts
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-white mt-2 hover:bg-orange hover:text-white duration-150  text-black tracking-wide p-3 rounded-md"
        >
          <span className="opacity-95 ">Explore More</span>
        </button>
      </div>
    </div>
  );
};

export default BetweenComponent;
