"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import { removeFromCart } from "../features/ShopCart";

const CartSidebar = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const [cartItems, setCartItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [animatingItemId, setAnimatingItemId] = React.useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/shop-cart-products/${user._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
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
    } else {
      setCartItems([]);
    }
  }, [user, isOpen]);

  const handleFinishShop = () => {
    onClose();
    if (!user) {
      return;
    }
    router.push("/purchase");
  };

  const handleDelete = async (productId) => {
    if (!user) {
      return;
    }

    setAnimatingItemId(productId);

    const animationDuration = 500;
    setTimeout(async () => {
      try {
        dispatch(removeFromCart(productId));
        const response = await fetch("/api/delete-shop-cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, productId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete item.");
        }

        setCartItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
      } catch (error) {
        console.error("Error deleting item:", error);
      } finally {
        setAnimatingItemId(null);
      }
    }, animationDuration);
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

      <div className="p-6 overflow-y-auto max-h-[80vh]">
        {loading ? (
          <div className="w-full min-h-screen flex items-center justify-center">
            <img
              className="flex w-fit h-fit mb-48 ml-3 justify-center items-center"
              src="/AnimationCart.gif"
            ></img>
          </div>
        ) : cartItems.length > 0 ? (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.productId}
                className={`flex border-b-2 border-blue-100 py-2 justify-between items-center transition-all duration-500 ${
                  animatingItemId === item.productId ? "delete-anim" : ""
                }`}
              >
                <img
                  src={item.imgURL}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col w-full ml-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">${item.price}</p>
                </div>
                <p className="font-semibold">{item.quantity}</p>
                <button
                  className="text-red-500 hover:text-red-700 ml-4"
                  onClick={() => handleDelete(item.productId)}
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
      </div>
    </div>
  );
};

export default CartSidebar;
