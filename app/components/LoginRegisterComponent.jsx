"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

const LoginRegisterComponent = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="bg-blue-950 flex justify-center gap-[12rem] items-center h-[10rem] px-12 py-8 shadow-lg">
      <div className="flex flex-col gap-2 text-left max-w-lg">
        <p className="text-3xl text-white font-bold leading-tight">
          {user ? (
            user.role === "admin" ? (
              <p className="text-center">Welcome Admin</p>
            ) : user.role === "user" ? (
              "Thank you for being a member"
            ) : (
              "Sign Up for Newsletters"
            )
          ) : (
            "Sign Up for Newsletters"
          )}
        </p>
        <p className="text-white text-center font-medium">
          <span className="opacity-85">
            Activate add cart, shop, blogs, and enjoy
          </span>{" "}
          <span className="text-orange-300">special offers</span>
        </p>
      </div>

      {!user && (
        <div className="flex gap-16 items-center">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-yellow-300 font-semibold">Not a member yet?</p>
            <Link href="/register">
              <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 w-full text-white font-medium rounded-full px-6 py-2 shadow-lg">
                Sign Up
              </button>
            </Link>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <p className="text-yellow-300 font-semibold">
              Already have an account?
            </p>
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 w-full text-white font-medium rounded-full px-6 py-2 shadow-lg">
                Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterComponent;
