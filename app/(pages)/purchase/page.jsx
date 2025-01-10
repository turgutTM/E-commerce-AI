"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { CiWallet } from "react-icons/ci";

const Purchase = () => {
  const user = useSelector((state) => state.user.user);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `/api/shop-cart-products/${user._id}`
          );
          setCartItems(response.data.cartDetails);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCartItems();
  }, [user]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePurchase = async () => {
    setIsProcessing(true);
    setIsSuccess(false);

    try {
      const purchaseData = cartItems.map((item) => ({
        userId: user._id,
        productId: item.id,
        quantity: item.quantity,
      }));

      for (const data of purchaseData) {
        await axios.post("/api/purchase", data);
      }

      setIsSuccess(true);
      setCartItems([]);
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Purchase error:", error);
      alert("There was an error completing the purchase.");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading your cart...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start min-h-screen bg-gray-100 p-6 lg:p-12">
      {isProcessing && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          {isSuccess ? (
            <div className="flex flex-col items-center">
              <AiOutlineCheckCircle className="text-green-500 text-6xl" />
              <p className="font-semibold text-green-700">
                Successfully Purchased,Good Luck!
              </p>
            </div>
          ) : (
            <AiOutlineLoading3Quarters className="text-blue-600 text-6xl animate-spin" />
          )}
        </div>
      )}

      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6 lg:mr-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Items</h2>
        {cartItems.length > 0 ? (
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between border-b pb-4"
              >
                <img
                  src={item.imgURL}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="text-gray-500">${item.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        )}
      </div>
      <div className="">
        <div className="min-w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 mt-6 lg:mt-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2">
            <p className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-lg">
              <span>Shipping:</span>
              <span>$5.00</span>
            </p>
            <p className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${(totalPrice + 5).toFixed(2)}</span>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <input
              type="text"
              placeholder="Card Number"
              className="w-full p-2 mb-3 border rounded-lg"
            />
            <div className="flex space-x-3 mb-3">
              <input
                type="text"
                placeholder="Expiry Date"
                className="w-1/2 p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-1/2 p-2 border rounded-lg"
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handlePurchase}
              disabled={isProcessing}
            >
              Complete Purchase
            </button>
          </div>
        </div>
        <div className="mt-3">
          <p>Your balance:</p>
          <span className=" flex items-center">
            <CiWallet className="text-2xl "></CiWallet>
            <p className="text-green-500 ml-1">${user.balance}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
