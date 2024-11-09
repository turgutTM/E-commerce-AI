import LoginRegisterComponent from "@/app/components/LoginRegisterComponent";
import ShopProducts from "@/app/components/ShopProducts";
import React from "react";

const Shop = () => {
  return (
    <div>
      <div className="relative bg-clothes h-[18rem] justify-center flex flex-col gap-6 items-center">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <p className="relative z-10 text-white font-bold text-6xl">
          #newbrands
        </p>
        <p className="text-white z-10 text-lg font-medium">
          Save more with coupons & up to 70% off
        </p>
      </div>

      <div>
       <ShopProducts></ShopProducts>
      </div>
      <div>
        <LoginRegisterComponent></LoginRegisterComponent>
      </div>
    </div>
  );
};

export default Shop;
