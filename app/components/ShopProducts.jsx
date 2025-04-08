"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash, FaPercentage } from "react-icons/fa";
import {
  RiShoppingCartLine,
  RiLoader4Line,
  RiHeartLine,
  RiHeartFill,
} from "react-icons/ri";
import Link from "next/link";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import TuguAnimation from "./TuguAnimation";
import EditProductModal from "./EditProductModal";
import { setProduct } from "../features/ProductSlice";
import { addToCart } from "@/app/features/ShopCart";

const ShopProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [hoverRatings, setHoverRatings] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [addedToCart, setAddedToCart] = useState(null);
  const productsPerPage = 12;
  const quantity = 1;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const fetchProducts = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/all-products?page=${page}&limit=${productsPerPage}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      dispatch(setProduct(res.data.products));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const addToCartHandler = async (product) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    try {
      dispatch(addToCart({ ...product, quantity: quantity }));
      const userId = user._id;
      await axios.post("/api/add-shop-cart", {
        userId,
        productId: product._id,
        quantity,
        price:
          product.discountedPrice > 0 ? product.discountedPrice : product.price,
      });

      setAddedToCart(product._id);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const rateProduct = async (productId, rating) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    try {
      const res = await axios.post("/api/rate-product", {
        userId: user._id,
        productId,
        rating,
      });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                stars: res.data.stars,
                votes: res.data.votes,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error rating product:", error);
    }
  };

  const deleteProduct = async (productId) => {
    setDeletingProduct(productId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await axios.delete(`/api/delete-product/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeletingProduct(null);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMouseEnter = (productId, rating) => {
    setHoverRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const handleMouseLeave = (productId) => {
    setHoverRatings((prev) => ({ ...prev, [productId]: null }));
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
  };

  const getProductCategories = () => {
    if (!products.length) return ["all"];
    const categories = [
      "all",
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return categories;
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
        <TuguAnimation />
      </div>
    );
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const filterVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    tap: { scale: 0.98 },
  };

  const categories = getProductCategories();
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64  to-transparent opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-pink-200 to-transparent opacity-40 pointer-events-none"></div>

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <RiLoader4Line className="animate-spin text-5xl text-indigo-600" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Our Premium Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover our carefully curated selection of high-quality products
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center flex-wrap gap-2 mb-10"
          variants={filterVariants}
          initial="initial"
          animate="animate"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              whileTap="tap"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group relative"
                style={{ opacity: deletingProduct === product._id ? 0.5 : 1 }}
              >
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 z-10 bg-white bg-opacity-80 p-2 rounded-full shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product._id);
                    }}
                  >
                    {wishlist.includes(product._id) ? (
                      <RiHeartFill className="h-5 w-5 text-red-500" />
                    ) : (
                      <RiHeartLine className="h-5 w-5 text-gray-500 hover:text-red-500" />
                    )}
                  </motion.button>
                )}

                <Link href={`/product/${product._id}`} passHref legacyBehavior>
                  <a className="block">
                    <div className="relative aspect-square overflow-hidden">
                      {product.discountPercentage > 0 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: -15 }}
                          transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg z-10 transform"
                        >
                          <span className="flex items-center">
                            <FaPercentage className="mr-1 h-3 w-3" />
                            {product.discountPercentage}% OFF
                          </span>
                        </motion.div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-20">
                          <span className="text-white text-lg font-bold border-2 border-white px-4 py-1 rounded-md transform -rotate-6">
                            Sold Out
                          </span>
                        </div>
                      )}
                      {product.isNew && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg z-10"
                        >
                          NEW
                        </motion.div>
                      )}
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <img
                          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${
                            product.stock === 0 ? "opacity-40" : ""
                          }`}
                          src={product.imgURL || "/placeholder-image.webp"}
                          alt={product.name}
                        />
                      </motion.div>
                    </div>
                  </a>
                </Link>

                <div className="p-5 flex flex-col flex-grow relative">
                  {addedToCart === product._id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md"
                    >
                      Added to cart!
                    </motion.div>
                  )}

                  {product.category && (
                    <span className="text-xs font-medium text-indigo-500 uppercase tracking-wider mb-1">
                      {product.category}
                    </span>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 truncate mr-2 flex-1">
                      <Link
                        href={`/product/${product._id}`}
                        passHref
                        legacyBehavior
                      >
                        <a className="hover:underline">{product.name}</a>
                      </Link>
                    </h3>
                    <div className="text-right flex-shrink-0">
                      {product.discountedPrice &&
                      product.discountedPrice > 0 ? (
                        <>
                          <p className="text-sm line-through text-gray-400">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ${product.discountedPrice.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-800">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.3 }}
                          onMouseEnter={() =>
                            handleMouseEnter(product._id, i + 1)
                          }
                          onMouseLeave={() => handleMouseLeave(product._id)}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            rateProduct(product._id, i + 1);
                          }}
                        >
                          <FaStar
                            className={`w-4 h-4 cursor-pointer transition-colors duration-150 ${
                              i < (hoverRatings[product._id] ?? product.stars)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </motion.span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.votes || 0}{" "}
                      {product.votes === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    {product.stock === 0 ? (
                      <button
                        className="w-full bg-gray-200 text-gray-500 py-2.5 px-4 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                        disabled
                      >
                        <span className="relative">
                          Out of Stock
                          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </span>
                      </button>
                    ) : user && user.role === "admin" ? (
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 hover:shadow-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEditModal(product);
                          }}
                        >
                          <FaEdit className="mr-1.5 h-4 w-4" /> Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 hover:shadow-lg ${
                            deletingProduct === product._id
                              ? "opacity-70 cursor-wait"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (deletingProduct !== product._id) {
                              deleteProduct(product._id);
                            }
                          }}
                          disabled={deletingProduct === product._id}
                        >
                          {deletingProduct === product._id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                            >
                              <RiLoader4Line className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <>
                              <FaTrash className="mr-1.5 h-4 w-4" /> Delete
                            </>
                          )}
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCartHandler(product);
                        }}
                      >
                        <RiShoppingCartLine className="mr-2 h-5 w-5" /> Add to
                        Cart
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-16 space-x-1"
          >
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300 hover:border-indigo-300 shadow-sm hover:shadow"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {startPage > 1 && (
              <>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 py-2 text-gray-500">...</span>
                )}
              </>
            )}

            {pages.map((page) => (
              <button
                onClick={() => handlePageChange(page)}
                key={page}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 shadow-sm hover:shadow"
                }`}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 py-2 text-gray-500">...</span>
                )}
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300 hover:border-indigo-300 shadow-sm hover:shadow"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isEditModalOpen && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onUpdate={handleUpdateProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopProducts;
