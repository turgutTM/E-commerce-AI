import React from "react";
import { FaStar } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";

const FeaturedProducts = () => {
  return (
    <div className="flex justify-center w-full pb-20 bg-gray-100">
      <div className="flex flex-col items-center mt-7">
        <div>
          <p className="text-[3.2rem] font-bold">Featured Products</p>
        </div>
        <div>
          <p className="mt-2 text-gray-400 text-same font-semibold ">
            Summer Collection New Modern Design
          </p>
        </div>
        <div className="w-[85%] flex flex-wrap mt-20 gap-10 min-h-screen">
          <div className="flex flex-col  rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 border-gray-300">
            <div className="bg-gray-200 rounded-xl w-full h-full">
              <img className="h-full" src="/blouse.png"></img>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold opacity-80">Red Blouse</p>
              <p className="text-yellow-500 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </p>
              <div className="flex w-full justify-between">
                <p className="font-bold opacity-90">$78</p>
                <button className="bg-gray-200 rounded-3xl p-3 ">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col  rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 border-gray-300">
            <div className="bg-gray-200 rounded-xl w-full h-full">
              <img src="/blouse.png"></img>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold opacity-80">Red Blouse</p>
              <p className="text-yellow-500 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </p>
              <div className="flex w-full justify-between">
                <p className="font-bold opacity-90">$78</p>
                <button className="bg-gray-200 rounded-3xl p-3">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 border-gray-300">
            <div className="bg-gray-200 rounded-xl w-full h-full">
              <img src="/blouse.png"></img>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold opacity-80">Red Blouse</p>
              <p className="text-yellow-500 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </p>
              <div className="flex w-full justify-between">
                <p className="font-bold opacity-90">$78</p>
                <button className="bg-gray-200 rounded-3xl p-3 ">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col  rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 border-gray-300">
            <div className="bg-gray-200 rounded-xl w-full h-full">
              <img src="/blouse.png"></img>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold opacity-80">Red Blouse</p>
              <p className="text-yellow-500 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </p>
              <div className="flex w-full justify-between">
                <p className="font-bold opacity-90">$78</p>
                <button className="bg-gray-200 rounded-3xl p-3 ">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col  rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 border-gray-300">
            <div className="bg-gray-200 rounded-xl w-full h-full">
              <img src="/blouse.png"></img>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold opacity-80">Red Blouse</p>
              <p className="text-yellow-500 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </p>
              <div className="flex w-full justify-between">
                <p className="font-bold opacity-90">$78</p>
                <button className="bg-gray-200 rounded-3xl p-3">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 border-gray-300">
            <div className="bg-gray-200 rounded-xl w-full h-full">
              <img src="/blouse.png"></img>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold opacity-80">Red Blouse</p>
              <p className="text-yellow-500 flex">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </p>
              <div className="flex w-full justify-between">
                <p className="font-bold opacity-90">$78</p>
                <button className="bg-gray-200 rounded-3xl p-3 ">
                  <RiShoppingCartLine />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
