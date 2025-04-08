import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { RiArrowRightLine } from "react-icons/ri";

const BetweenComponent = () => {
  const router = useRouter();
  return (
    <div className="relative h-[24rem]">
      <div className="bg-custom-background object-cover h-full w-full"></div>
      <div className="absolute top-0 left-0 h-full w-full bg-black opacity-60"></div>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center px-4"
      >
        <p className="text-xl font-semibold text-orange-300 mb-4 tracking-wider uppercase">
          Repair Services
        </p>
        <h2 className="text-4xl font-bold text-white mb-6 max-w-3xl text-center">
          Up to <span className="text-orange-500">70% Off</span> - All Technology Products
        </h2>
        <button
          onClick={() => router.push("/shop")}
          className="bg-white text-black px-8 py-3 rounded-lg font-semibold 
          tracking-wide flex items-center justify-center gap-2
          hover:bg-orange-500 hover:text-white 
          transition-all duration-300 group"
        >
          Explore More
          <RiArrowRightLine 
            className="text-xl transition-transform group-hover:translate-x-1" 
          />
        </button>
      </motion.div>
    </div>
  );
};

export default BetweenComponent;