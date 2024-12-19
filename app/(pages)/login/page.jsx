"use client";
import React, { useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/features/UserSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) =>state.user.user)

  if(user) {
    router.push("/")
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const data = await res.json();
        dispatch(setUser(data));
        localStorage.setItem("token", data.token);

        router.push("/");
      } else {
        const data = await res.json();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="flex">
      <div className="bg-white pl-28 flex flex-col justify-center w-[65%] h-screen">
        <div className="mb-6">
          <p className="font-bold text-4xl text-orange-500">TUGU</p>
        </div>
        <div>
          <p className="text-gray-500">Welcome Back</p>
          <p className="text-5xl font-bold mt-3">Sign In</p>
        </div>
        <form onSubmit={handleLogin} className="mt-10 flex flex-col gap-2">
          <p>Email</p>
          <input
            className="bg-[#f9f5e3] rounded-lg focus:outline-none  w-96 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2 mt-4 w-96">
            <div className="flex justify-between">
              <p>Password</p>
              <button className="text-gray-400 text-sm">
                Forgot password?
              </button>
            </div>
            <input
              className="bg-[#f9f5e3] rounded-lg focus:outline-none w-full p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
            />
          </div>
          <div className="w-96 flex mt-10 justify-center">
            <button
              type="submit"
              className="p-2 pl-10 pr-10 bg-orange-400 hover:bg-orange-300 duration-150 rounded-full font-semibold flex items-center gap-2 text-white"
            >
              SIGN IN <MdOutlineArrowRightAlt className="text-3xl" />
            </button>
          </div>
        </form>
        <div className="flex gap-1 justify-center w-96 mt-6">
          <p className="text-medium text-gray-400">
            If you don't have an account?
          </p>
          <Link className="text-orange-500" href="/register">
            Sign up
          </Link>
        </div>
      </div>

      <div className="relative w-[35%] justify-center flex flex-col h-screen bg-[#FFF7D1]">
        <img
          src="/shopphoto.png"
          className="absolute -left-32 object-cover"
          alt="Shop Photo"
        />
      </div>
    </div>
  );
};

export default Login;
