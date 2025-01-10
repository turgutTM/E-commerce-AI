"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import TuguAnimation from "../components/TuguAnimation";
import { addToCart } from "../features/ShopCart";
import { useDispatch } from "react-redux";
import Link from "next/link";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const reduxCurrentProductId = useSelector(
    (state) => state.product.currentProduct
  );
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [currentProductId, setCurrentProductId] = useState(null);
  console.log("current id is" + reduxCurrentProductId);

  useEffect(() => {
  
    if (reduxCurrentProductId) {
     
      localStorage.setItem("lastViewedProductId", reduxCurrentProductId);
   
      setCurrentProductId(reduxCurrentProductId);
    } else {
    }
  }, [reduxCurrentProductId]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!currentProductId) return;
      try {
        const response = await axios.get(
          `/api/recommendations/${currentProductId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [currentProductId]);

  const addToCartHandler = async (product) => {
    try {
      dispatch(addToCart(product));
      const userId = user._id;
      await axios.post("/api/add-shop-cart", {
        userId,
        productId: product._id,
        quantity,
        price: product.price,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TuguAnimation />
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full pb-20 bg-gray-100">
      <div className="flex flex-col items-center mt-7">
        <div>
          <p className="text-[3.2rem] font-bold">Recommended Products for you</p>
        </div>
        <div>
          <p className="mt-2 text-gray-400 text-same font-semibold">
            Recommended based on your recent views
          </p>
        </div>
        <div className="w-[85%] flex flex-wrap mt-20 gap-10 min-h-screen">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col rounded-xl gap-4 p-3 w-[18rem] h-[25rem] border-2 border-gray-300"
              >
                <div className="bg-gray-200 rounded-xl w-full h-60 justify-center flex">
                  <Link href={`/product/${product._id}`}>
                  <img
                    className="h-full w-full cursor-pointer rounded-lg object-cover"
                    src={product.imgURL || "/placeholder.png"}
                    alt={product.name}
                  />
                  </Link>
                </div>
                <div className="flex flex-col gap-1 mt-6">
                  <p className="font-bold opacity-80">{product.name}</p>
                  <p className="text-yellow-500 flex">
                    {[...Array(Math.round(product.stars || 0))].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </p>
                  <div className="flex w-full justify-between"> 
                    <p className="font-bold opacity-90">${product.price}</p>
                    <button
                      className="bg-gray-200 hover:bg-red-500 mb-3 hover:text-white duration-200 rounded-3xl p-3"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCartHandler(product);
                      }}
                    >
                      <RiShoppingCartLine />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full justify-center h-fit items-center">
              <p className="text-center">No recommended products available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
