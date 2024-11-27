"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import { removeFromCart } from "../features/ShopCart";

const CartSidebar = ({ isOpen, onClose, setFetchedCartItems }) => {
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.ShopCart.cartItems);
  const router = useRouter();
  const [message, setMessage] = React.useState("");
  const [deletingItemId, setDeletingItemId] = React.useState(null); 
  const dispatch = useDispatch();

  const handleFinishShop = () => {
    onClose();
    if (!user) {
      setMessage("You need to log in to complete the purchase.");
      return;
    }
    router.push("/purchase");
  };

  const handleDelete = async (productId) => {
    if (!user) {
      setMessage("You need to log in to modify your cart.");
      return;
    }

    setDeletingItemId(productId);

    setTimeout(async () => {
      try {
        dispatch(removeFromCart(productId));

        const response = await fetch("/api/delete-from-cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id, productId }),
        });

        // API yanıtı kontrolü
        if (!response.ok) {
          const data = await response.json();
          setMessage(data.message || "Failed to delete item.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        setMessage("Failed to delete item.");
      } finally {
        setDeletingItemId(null);
      }
    }, 500);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "32%" }}
    >
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="text-2xl font-semibold">Your Cart</h2>
        <button
          className="text-xl font-semibold text-gray-500 hover:text-black transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="p-6 overflow-y-auto h-[80vh]">
        {cartItems.length > 0 ? (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className={`flex border-b-2 border-blue-100 py-2 justify-between items-center transition-all duration-500 ${
                  deletingItemId === item.id
                    ? "opacity-50 blur-sm"
                    : "opacity-100"
                }`}
              >
                <img
                  src={item.imgURL}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col w-full ml-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">
                    $
                    {item.discountedPrice !== 0
                      ? item.discountedPrice
                      : item.price}
                  </p>
                </div>
                <p className="font-semibold">{item.quantity}</p>
                <button
                  className="text-red-500 hover:text-red-700 ml-4"
                  onClick={() => handleDelete(item.id)}
                >
                  <MdDeleteOutline size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        )}
      </div>

      <div className="p-6 -mt-3">
        <button
          className="w-full py-2 border-black text-black hover:bg-orange-200 transition-colors border-[1px] font-semibold rounded-lg shadow-lg"
          onClick={handleFinishShop}
        >
          Finish the Shop
        </button>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default CartSidebar;
