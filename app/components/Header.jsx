import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiShoppingCartLine } from "react-icons/ri";

const Header = () => {
  return (
    <div className="bg-gradient-to-br from-[#f2f6f1] to-[#e6f3e4] flex justify-center items-center min-h-screen px-4 sm:px-12 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-[45%] flex flex-col items-start text-center md:text-left"
        >
          <p className="font-semibold text-lg text-green-600 mb-4 uppercase tracking-wider">
            Trade-in-Offer
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-800 mb-4">
            Super Value Deals{" "}
            <span className="block text-gray-500 text-3xl md:text-4xl lg:text-5xl">
              On All Products
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 mb-6">
            Save more with coupons & up to{" "}
            <span className="text-green-700 font-bold">70% off</span>!
          </p>
          <Link href="/shop">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#f1b8b8] hover:bg-[#e07a7a] px-6 py-3 rounded-lg text-lg font-semibold text-white transition-all ease-in-out duration of flex items-center justify-center gap-2"
            >
              <RiShoppingCartLine className="text-xl" />
              Shop Now
            </motion.button>
          </Link>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-[45%] flex justify-center items-center"
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 50
            }}
            src="/model1.png"
            alt="Model Image"
            className="w-full max-w-md h-auto object-cover drop-shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Header;