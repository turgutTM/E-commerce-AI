"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdClose, 
  MdShoppingCart, 
  MdDelete 
} from "react-icons/md";
import { removeFromCart } from "../features/ShopCart";

const CartSidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/shop-cart-products/${user._id}`);
        const data = await response.json();
        setCartItems(data.cartDetails || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCartItems();
    }
  }, [user, isOpen]);

  const handleDelete = async (productId) => {
    // Optimistic UI Update
    setDeletingItem(productId);
    
    // Immediately update local state
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    dispatch(removeFromCart(productId));

    // Async API Call
    try {
      const response = await fetch("/api/delete-shop-cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, productId }),
      });

      if (!response.ok) {
        // Rollback if API call fails
        setCartItems(cartItems);
        dispatch(removeFromCart(productId)); // Revert Redux state
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeletingItem(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    onClose();
    router.push("/purchase");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween" }}
          className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl z-50 flex flex-col"
        >
          <div className="p-6 flex justify-between items-center border-b">
            <div className="flex items-center space-x-3">
              <MdShoppingCart className="text-2xl text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-800">Cart</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 py-10">Loading...</div>
            ) : cartItems.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                Your cart is empty
              </div>
            ) : (
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 1 }}
                    exit={{ 
                      opacity: 0, 
                      x: deletingItem === item.productId ? -50 : 0 
                    }}
                    className={`
                      flex items-center justify-between p-3 
                      border-b last:border-b-0 
                      ${deletingItem === item.productId ? 'opacity-50' : ''}
                    `}
                  >
                    <img 
                      src={item.imgURL} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded mr-4" 
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.productId)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                    >
                      <MdDelete />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-gray-800">
                  ${calculateTotal()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gray-800 text-white rounded-lg 
                hover:bg-gray-700 transition disabled:opacity-50"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;