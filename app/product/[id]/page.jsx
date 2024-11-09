"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const userId = user ? user._id : null;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const addToCart = async (productId) => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post("/api/add-to-cart", {
        userId,
        productId,
      });
      console.log("Product added to cart:", response.data);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/single-product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-10">
      <div className="flex flex-col w-[40%] h-[27rem] p-4">
        <div className="w-full h-[27rem] mb-4 relative">
          <img
            className="w-full h-[27rem] object-cover rounded-lg"
            src={product.imgURL || "/blouse.png"}
            alt="Product Image Large"
          />
        </div>

        <div className="flex justify-between gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <img
              key={index}
              className="w-[6rem] h-[6rem] object-cover rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              src="/blouse1.webp"
              alt="Product Image Small"
            />
          ))}
        </div>
      </div>

      <div className="w-[60%] rounded-lg ml-10 p-8 relative">
        <h1 className="text-md font-bold mt-2 mb-4">Home / T-shirt </h1>
        <p className="text-black font-bold text-3xl mb-6">{product.name}</p>
        <div className="flex flex-col mb-6">
          <span className="text-3xl font-bold text-green-600">
            ${product.price}
          </span>
          <div className="flex flex-col mt-2">
            <div className="relative">
              <label
                className="flex gap-3 text-lg items-center border-2 w-fit pl-5 text-green-800 border-[#85a18c] font-semibold cursor-pointer"
                onClick={toggleDropdown}
              >
                Select Size
                <MdArrowDropDown />
              </label>

              {isOpen && (
                <div className="absolute z-10 border-2 w-[9rem] h-[8rem] p-2 overflow-y-auto bg-gray-100 rounded-md">
                  <ul className="space-y-2">
                    {["Small", "Medium", "Large", "X-Large", "XX-Large"].map(
                      (size) => (
                        <li key={size}>
                          <input
                            type="radio"
                            name="size"
                            id={size.toLowerCase()}
                          />
                          <label htmlFor={size.toLowerCase()}>{size}</label>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center mt-2 gap-3">
              <div className="flex items-center">
                <input
                  min="1"
                  defaultValue="1"
                  className="w-12 h-12 text-center border-2 focus:border-2 focus:border-[#77907d] border-[#77907d] py-2 px-3"
                />
              </div>
              <button
                className="bg-[#758d81] text-white rounded-sm p-2.5 pl-8 pr-8 text-lg font-semibold hover:bg-green-500 transition-colors duration-300"
                onClick={() => addToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-2xl opacity-85">Product Details</p>
          <p className="w-[38rem] text-green-800">{product.details}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
