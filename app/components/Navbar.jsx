"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddProductModal from "./AddProductModal";
import CartSidebar from "@/app/components/CartSidebar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/UserSlice";
import { IoIosLogOut } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { setCartItems } from "../features/ShopCart";

const Navbar = () => {
  const [activePage, setActivePage] = useState("/");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [newProduct, setNewProduct] = useState(null);
  const [prevCartLength, setPrevCartLength] = useState(0);
  const cartItems = useSelector((state) => state.ShopCart.cartItems);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const userId = user?._id;
  const cartIconRef = useRef(null);

  useEffect(() => {
    const storedPage = localStorage.getItem("activePage");
    if (storedPage) {
      setActivePage(storedPage);
    }
  }, []);

  useEffect(() => {
    if (prevCartLength === 0 && cartItems.length > 0) {
      setPrevCartLength(cartItems.length);
    } else if (cartItems.length > prevCartLength) {
      const newlyAdded = cartItems[cartItems.length - 1];
      setNewProduct(newlyAdded);
      setPrevCartLength(cartItems.length);
      setTimeout(() => setNewProduct(null), 1000);
    } else if (cartItems.length < prevCartLength) {
      setPrevCartLength(cartItems.length);
    }
  }, [cartItems, prevCartLength]);

  const handleNavClick = (page) => {
    setActivePage(page);
    localStorage.setItem("activePage", page);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      dispatch(logoutUser());
      localStorage.removeItem("activePage");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex justify-between items-center px-16 bg-white text-black shadow-md sticky top-0 z-50">
      <div className="text-3xl font-extrabold italic tracking-wide">
        <Link href="/" onClick={() => handleNavClick("Home")}>
          <img
            className="w-fit h-14 cursor-pointer"
            src="/tugulogo.png"
            alt="Logo"
          />
        </Link>
      </div>

      <div className="flex items-center gap-12 text-lg font-medium relative">
        {user?.role === "admin" && (
          <div
            className="text-gray-500 flex items-center cursor-pointer relative"
            onClick={toggleDropdown}
          >
            <BsThreeDotsVertical />
            {dropdownOpen && (
              <div className="absolute top-[120%] right-0 bg-white shadow-lg rounded-lg mt-1 w-48 z-10">
                <p
                  className="p-2 flex gap-1 items-center hover:bg-gray-100 hover:text-yellow-600 cursor-pointer transition-colors rounded-md"
                  onClick={() => {
                    setModalOpen(true);
                    toggleDropdown();
                  }}
                >
                  <IoIosAddCircleOutline />
                  Add Product
                </p>
                <p
                  className="p-2 flex items-center gap-1 hover:bg-gray-100 hover:text-red-500 cursor-pointer transition-colors rounded-md"
                  onClick={() => {
                    handleLogout();
                    toggleDropdown();
                  }}
                >
                  <IoIosLogOut />
                  Logout
                </p>
              </div>
            )}
          </div>
        )}
        {user?.role === "user" && (
          <p className="relative p-2 flex items-center gap-1 text-2xl cursor-pointer transition-colors rounded-md group">
            <IoIosLogOut onClick={() => handleLogout()} />
            <span className="absolute left-1/2 transform -translate-x-1/2 text-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-9">
              Logout
            </span>
          </p>
        )}

        {["Home", "Shop", "Blogs", "Contact"].map((page) => (
          <Link
            href={page === "Home" ? "/" : `/${page.toLowerCase()}`}
            key={page}
          >
            <p
              className={`relative text-[17px] cursor-pointer transition-all hover:text-black ${
                activePage === page ? "text-black" : "text-gray-500"
              }`}
              onClick={() => handleNavClick(page)}
            >
              {page}
              <span
                className={`absolute left-0 bottom-[-4px] h-[2px] transition-all duration-300 ease-in-out ${
                  activePage === page ? "w-full bg-black" : "w-0 bg-transparent"
                }`}
              />
            </p>
          </Link>
        ))}

        {user?.role !== "admin" && (
          <p
            className="cursor-pointer relative"
            ref={cartIconRef}
            onClick={() => setCartOpen(true)}
          >
            <FiShoppingBag
              className={`text-2xl text-gray-500 ${
                newProduct ? "cart-icon-grow" : ""
              }`}
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          </p>
        )}
      </div>

      {newProduct && (
        <div
          className="fixed z-50 bg-white shadow-lg rounded-full animate-move-to-cart"
          style={{
            width: "80px",
            height: "80px",
            backgroundImage: `url(${newProduct.imgURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            right: cartIconRef.current?.offsetLeft + -448 + "px",
            top: cartIconRef.current?.offsetTop + 100 + "px",
          }}
          onAnimationEnd={() => setNewProduct(null)}
        />
      )}

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AddProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Navbar;
