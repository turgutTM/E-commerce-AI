"use client";
import React, { useState, useEffect } from "react";
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

const Navbar = () => {
  const [activePage, setActivePage] = useState("/");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const userId = user._id;
  console.log(cartItems);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await axios.get(`/api/cart-products/${userId}`);
        setCartItems(response.data.cartProducts);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    };

    fetchCartProducts();
  }, [userId]);

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      dispatch(logoutUser());
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex justify-between items-center px-12 py-3 bg-white text-black shadow-md sticky top-0 z-50">
      <div className="text-3xl font-extrabold italic tracking-wide">
        <Link href="/" onClick={() => handleNavClick("Home")}>
          <img
            className="w-fit h-14 cursor-pointer"
            src="/Tugu.png"
            alt="Logo"
          />
        </Link>
      </div>

      <div className="flex items-center gap-12 text-lg font-medium relative">
        {user.role === "admin" && (
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

        {user.role === "user" ? (
          <div className="relative ">
            <IoIosLogOut
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleLogout}
              className="text-2xl cursor-pointer hover:text-black transition-colors text-gray-500"
            />
            <span
              className={`absolute left-0 -bottom-8 p-1 rounded-full border border-gray-200 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              Logout
            </span>
          </div>
        ) : null}

        {["Home", "Shop", "Blogs", "Contact"].map((page) => (
          <Link
            href={page === "Home" ? "/" : `/${page.toLowerCase()}`}
            key={page}
          >
            <p
              className={`relative cursor-pointer transition-all hover:text-black ${
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

        {user.role === "user" && (
          <p
            className="cursor-pointer relative"
            onClick={() => setCartOpen(true)}
          >
            <FiShoppingBag className="text-2xl hover:text-black transition-colors text-gray-500" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          </p>
        )}
      </div>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      <AddProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Navbar;
