"use client";
import React, { useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/register", {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        setSuccessMessage("Registration successful!");
        setErrorMessage("");
        router.push("/login");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
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
          <p className="text-5xl font-bold mt-3">Sign Up</p>
        </div>
        <form onSubmit={handleRegister} className="mt-10 flex flex-col gap-2">
          <div>
            <p>Email</p>
            <input
              className="bg-[#f9f5e3] rounded-lg focus:outline-none w-96 p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 mt-4 w-96">
            <div className="flex justify-between">
              <p>Password</p>
            </div>
            <input
              className="bg-[#f9f5e3] rounded-lg focus:outline-none w-full p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4 w-96">
            <div className="flex justify-between">
              <p>Name</p>
            </div>
            <input
              className="bg-[#f9f5e3] rounded-lg focus:outline-none w-full p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="w-96 flex mt-10 justify-center">
            <button
              type="submit"
              className="p-2 pl-10 pr-10 bg-orange-400 hover:bg-orange-300 duration-150 rounded-full font-semibold flex items-center gap-2 text-white"
            >
              SIGN UP <MdOutlineArrowRightAlt className="text-3xl" />
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="mt-4 text-green-500 text-center">
            {successMessage}
          </div>
        )}

        <div className="flex gap-1 justify-center w-96 mt-6">
          <p className="text-medium text-gray-400">Already have an account?</p>
          <Link className="text-orange-500" href="/login">
            Log in
          </Link>
        </div>
      </div>

      <div className="relative w-[35%] justify-center flex flex-col h-screen bg-[#FFF7D1]">
        <img
          src="/shopphoto1.png"
          className="absolute -left-36 object-cover"
          alt="Shop Photo"
        />
      </div>
    </div>
  );
};

export default Register;
