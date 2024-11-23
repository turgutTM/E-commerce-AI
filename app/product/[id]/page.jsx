"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdArrowDropDown, MdArrowBack } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";
import TuguAnimation from "../../components/TuguAnimation"; // Correct import of TuguAnimation component.

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [animationStage, setAnimationStage] = useState(0);

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
        quantity,
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  if (loading) return <TuguAnimation />; // Show animation while loading the product.

  if (!product) return <div>Product not found.</div>; // Handle case where product is not found.

  return (
    <div className="flex flex-col items-center min-h-screen p-4 relative">
      <div className="flex justify-center relative w-full gap-5 mt-10">
        <div className="w-[65%] sticky top-20 p-4 h-fit max-w-full">
          <div className="w-full h-[27rem] mb-4 relative">
            <img
              className="w-full h-[27rem] object-cover rounded-lg"
              src={product.imgURL || "/blouse.png"}
              alt="Product Image Large"
            />
          </div>
          <div className="flex justify-center gap-4">
            <p>View gallery</p>
          </div>
        </div>

        <div className="flex w-[35%] flex-col rounded-lg p-8 relative">
          <div className="flex flex-col mb-6">
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="text-2xl">
                <span className="font-semibold">Model.</span>
                <span className="font-semibold text-gray-400">
                  {" "}
                  Which is best for you?
                </span>
              </h1>
              <div className="border-[1px] w-full mt-4 flex justify-between rounded-lg p-4 py-5 border-black">
                <div className="items-start">
                  <p className="font-semibold text-xl">{product.name}</p>
                  <p className="text-gray-800 mt-1 text-xs">6.3-inch display</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold">
                    From ${product.price}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-xs mt-1 font-semibold">
                      or ${(product.price / 24).toFixed(2)}/mo
                    </p>
                    <p className="text-gray-500 text-xs font-semibold">
                      for 24 mo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-8 mb-2">
              <h1 className="text-2xl">
                <span className="font-semibold">Finish.</span>
                <span className="font-semibold text-gray-400">
                  {" "}
                  Pick your favorite
                </span>
              </h1>
              <div className="mt-7">
                <p className="font-semibold opacity-80">Color</p>
                <div className="flex items-center gap-4 mt-5 opacity-75">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 border border-gray-300 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-300 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border border-gray-300 cursor-pointer"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-2">
              <div className="mt-32">
                <h1 className="text-2xl">
                  <span className="font-semibold">Storage.</span>
                  <span className="font-semibold text-gray-400">
                    {" "}
                    How much space do you need?
                  </span>
                </h1>
                <div className="flex flex-col gap-3">
                  {[128, 256, 512].map((storage) => (
                    <div
                      key={storage}
                      className="border-[1px] w-full mt-4 items-center flex justify-between rounded-lg p-4 py-4 border-black"
                    >
                      <div className="items-start">
                        <p className="font-semibold text-xl">{storage}GB</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold">
                          From ${product.price}
                        </p>
                        <div className="flex flex-col">
                          <p className="text-gray-500 text-xs mt-1 font-semibold">
                            or ${(product.price / 24).toFixed(2)}/mo
                          </p>
                          <p className="text-gray-500 text-xs font-semibold">
                            for 24 mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center mt-2 gap-3"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-20 gap-4">
        <p className="font-bold text-2xl text-center opacity-85">
          Product Details
        </p>
        <p className="w-full text-center px-60 text-green-800">
          {product.details}
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
