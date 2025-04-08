"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdArrowBack, MdShoppingCart, MdZoomIn } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaBox } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/features/ShopCart";
import { setUser } from "@/app/features/UserSlice";
import TuguAnimation from "../../components/TuguAnimation";
import Link from "next/link";
import { motion } from "framer-motion";

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStorage, setSelectedStorage] = useState(128);
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user ? user._id : null;

  const colorOptions = [
    { name: "Gold", class: "bg-yellow-500", value: "yellow" },
    { name: "White", class: "bg-white", value: "white" },
    { name: "Blue", class: "bg-blue-500", value: "blue" },
  ];

  const handleAddToCart = async (productId) => {
    if (!userId) {
      // Show login modal or redirect to login
      router.push("/login?redirect=product/" + id);
      return;
    }

    const selectedPrice = calculatePrice();
    try {
      dispatch(
        addToCart({
          ...product,
          selectedStorage,
          selectedColor,
          calculatedPrice: selectedPrice,
        })
      );

      const response = await axios.post("/api/add-shop-cart", {
        userId,
        productId,
        quantity: 1,
        price: selectedPrice,
        storage: selectedStorage,
        color: selectedColor,
      });

      if (response.status === 200) {
        // Show success notification
        alert("Product added to cart successfully");
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
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

    const fetchRelatedProducts = async () => {
      if (!user?.lastViewedProduct) return;
      try {
        const response = await axios.get(
          `/api/recommendations/${user.lastViewedProduct}`
        );
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    const updateLastViewedProduct = async () => {
      if (userId && id) {
        try {
          await axios.put(`/api/last-viewed-product/${userId}`, {
            lastViewedProduct: id,
          });
        } catch (error) {
          console.error("Error updating last viewed product:", error);
        }
      }
    };

    fetchProduct();
    fetchRelatedProducts();
    updateLastViewedProduct();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [id, userId]);

  if (loading) return <TuguAnimation />;
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Product not found.
      </div>
    );

  const calculatePrice = () => {
    const extraCost =
      selectedStorage === 256 ? 200 : selectedStorage === 512 ? 400 : 0;
    return product.price + extraCost;
  };

  return (
    <div className="flex flex-col items-center min-h-screen relative bg-gray-50">
      <div
        className={`${
          scrolled
            ? "fixed top-0 left-0 w-full z-50 bg-white shadow-md transform translate-y-0 transition-transform duration-300 ease-in-out"
            : "absolute top-0 left-0 w-full bg-white transform -translate-y-full transition-transform duration-300 ease-in-out"
        } py-4 px-8 flex justify-between items-center`}
      >
        <div
          onClick={() => router.back()}
          className="flex cursor-pointer hover:text-gray-500 transition-colors items-center gap-2"
        >
          <MdArrowBack className="text-lg" />
          <p className="text-sm font-medium">Back</p>
        </div>
        <div className="text-xl font-semibold rounded-full bg-gray-100 px-5 py-2">
          <p className="text-lg font-semibold">${calculatePrice()}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAddToCart(product._id)}
            className="bg-black text-white py-2 px-4 rounded-full text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <MdShoppingCart />
            Add to cart
          </button>
          <img
            className="w-10 h-8 cursor-pointer"
            src="/tugulogo.png"
            alt="Logo"
          />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-10 pb-20">
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-10">
          <div className="w-full md:w-3/5 sticky top-20 p-4">
            <div className="relative group">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <img
                  className="w-full h-[30rem] object-contain p-4"
                  src={product.imgURL || "/blouse.png"}
                  alt={product.name}
                />
                <div
                  onClick={() => setShowGallery(true)}
                  className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-70 text-white p-3 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MdZoomIn size={20} />
                </div>
              </motion.div>
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setShowGallery(true)}
                  className="text-sm font-medium flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <MdZoomIn /> View gallery
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex flex-col rounded-xl bg-white shadow-sm p-8">
            <div className="flex flex-col mb-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">
                6.3-inch Super AMOLED Display
              </p>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">${calculatePrice()}</div>
                <div className="text-sm text-gray-500">
                  or ${(calculatePrice() / 24).toFixed(2)}/mo for 24 mo
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 my-6"></div>

              <div className="flex flex-col mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span>Model</span>
                  <span className="ml-2 text-gray-400 text-sm font-normal">
                    Which is best for you?
                  </span>
                </h2>
                <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-xl">{product.name}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        6.3-inch display
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-700 font-semibold">
                        From ${calculatePrice()}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        or ${(calculatePrice() / 24).toFixed(2)}/mo for 24 mo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span>Finish</span>
                  <span className="ml-2 text-gray-400 text-sm font-normal">
                    Pick your favorite
                  </span>
                  <IoColorPaletteOutline className="ml-2 text-gray-400" />
                </h2>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-gray-700">Color</p>
                  <div className="flex items-center gap-4 mt-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-10 h-10 rounded-full ${
                          color.class
                        } border-2 cursor-pointer transition-all duration-200 flex items-center justify-center
                        ${
                          selectedColor === color.value
                            ? "border-blue-500 scale-110"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedColor === color.value && (
                          <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Selected:{" "}
                    {colorOptions.find((c) => c.value === selectedColor).name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span>Storage</span>
                  <span className="ml-2 text-gray-400 text-sm font-normal">
                    How much space do you need?
                  </span>
                </h2>
                <div className="flex flex-col gap-3">
                  {[128, 256, 512].map((storage) => (
                    <div
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`border rounded-xl p-5 cursor-pointer transition-all duration-200
                        ${
                          selectedStorage === storage
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              selectedStorage === storage
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-400"
                            }`}
                          ></div>
                          <p className="font-semibold text-lg ml-3">
                            {storage}GB
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            $
                            {product.price +
                              (storage === 256
                                ? 200
                                : storage === 512
                                ? 400
                                : 0)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            $
                            {(
                              (product.price +
                                (storage === 256
                                  ? 200
                                  : storage === 512
                                  ? 400
                                  : 0)) /
                              24
                            ).toFixed(2)}
                            /mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                {user && user.role !== "admin" && (
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <MdShoppingCart />
                    Add to cart
                  </button>
                )}
                {(!user || user.role === "admin") && (
                  <button
                    onClick={() => router.push("/login?redirect=product/" + id)}
                    className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-black transition-colors"
                  >
                    Login to purchase
                  </button>
                )}
                <p className="text-sm mt-4 text-gray-500 text-center">
                  Need help buying your next Tugu product?
                  <a href="#" className="ml-1 text-blue-600 hover:underline">
                    Chat with us
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Product Details
          </h2>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center leading-relaxed">
            <p className="text-gray-700 md:px-12">{product.details}</p>
          </div>
        </div>

        <div className="my-24 py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold flex justify-center items-center gap-2">
              <FaBox className="text-gray-600" />
              What's in the box
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-16">
            <div className="flex flex-col items-center max-w-xs">
              <div className="h-64 w-64 rounded-2xl bg-gray-50 p-4 flex items-center justify-center mb-4">
                <img
                  className="max-h-full object-contain"
                  src={product.boxPhoto || product.imgURL}
                  alt={product.name}
                />
              </div>
              <p className="font-medium text-center">{product.name}</p>
            </div>

            {product.name.startsWith("iPhone") && (
              <div className="flex flex-col items-center max-w-xs">
                <div className="h-64 w-64 rounded-2xl bg-gray-50 p-4 flex items-center justify-center mb-4">
                  <img
                    className="max-h-full object-contain"
                    src="/iphonecable.jpeg"
                    alt="USB-C Charge Cable"
                  />
                </div>
                <p className="font-medium text-center">USB-C Charge Cable</p>
              </div>
            )}

            {product.name.startsWith("Samsung") && (
              <div className="flex flex-col items-center max-w-xs">
                <div className="h-64 w-64 rounded-2xl bg-gray-50 p-4 flex items-center justify-center mb-4">
                  <img
                    className="max-h-full object-contain"
                    src="/samsungcable2.webp"
                    alt="USB-C Charge Cable"
                  />
                </div>
                <p className="font-medium text-center">USB-C Charge Cable</p>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="my-24">
            <h2 className="text-3xl font-bold text-center mb-16">
              Find the perfect device for you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts
                .filter((relatedProduct) => relatedProduct._id !== id)
                .slice(0, 3)
                .map((relatedProduct) => (
                  <Link
                    href={`/product/${relatedProduct._id}`}
                    key={relatedProduct._id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="p-4">
                      <div className="h-72 flex items-center justify-center mb-4">
                        <img
                          src={relatedProduct.imgURL || "/blouse.png"}
                          alt={relatedProduct.name}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div className="px-2 pb-4">
                        <h3 className="text-xl font-semibold text-center mb-3">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex justify-center gap-2 mb-4">
                          <span className="text-xs border border-gray-300 px-3 py-1 rounded-full">
                            128GB
                          </span>
                          <span className="text-xs border border-gray-300 px-3 py-1 rounded-full">
                            256GB
                          </span>
                          <span className="text-xs border border-gray-300 px-3 py-1 rounded-full">
                            512GB
                          </span>
                        </div>
                        <p className="text-center font-semibold">
                          From ${relatedProduct.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {showGallery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="max-w-4xl max-h-screen p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.imgURL || "/blouse.png"}
              alt={product.name}
              className="max-w-full max-h-screen object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={() => setShowGallery(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
