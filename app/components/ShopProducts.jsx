"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash, FaPercentage } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [hoverRatings, setHoverRatings] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 10;
  let quantity = 1;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/all-products");
      setProducts(response.data);
      dispatch(setProduct(response.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const rateProduct = async (productId, rating) => {
    try {
      const response = await axios.post("/api/rate-product", {
        userId: user._id,
        productId,
        rating,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                stars: response.data.stars,
                ratingsCount: response.data.ratingsCount,
              }
            : product
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setDeletingProduct(productId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.delete(`/api/delete-product/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error(error);
    } finally {
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
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.documentElement.scrollTo({
      top: 290,
      behavior: "smooth",
    });
  };

  const handleMouseEnter = (productId, rating) => {
    setHoverRatings((prevRatings) => ({ ...prevRatings, [productId]: rating }));
  };

  const handleMouseLeave = (productId) => {
    setHoverRatings((prevRatings) => ({ ...prevRatings, [productId]: null }));
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
      <div className="mt-7 w-[85%] flex flex-col items-center">
        <div className="mb-5 w-[18rem]">
          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 text-gray-800 placeholder-gray-400 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300"
          />
        </div>
        <div className="grid grid-cols-5 gap-6 mb-4">
          <AnimatePresence>
            {currentProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="relative flex justify-center"
              >
                <Link href={`/product/${product._id}`} passHref>
                  <div className="flex flex-col rounded-xl gap-2 p-2 w-[18rem] h-[26rem] border-2 bg-white border-gray-300 transition-transform duration-300">
                    <div className="bg-white w-full rounded-t-xl">
                      <div className="w-full flex justify-between items-center mb-1 ">
                        {product.discountPercentage > 0 && (
                          <FaPercentage className="text-yellow-500 text-[13px]" />
                        )}
                      </div>
                      <div className="relative h-[15rem] w-full">
                        {product.stock === 0 && (
                          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center rounded-xl z-20 bg-black bg-opacity-40">
                            <span className="text-white font-bold text-xl">
                              Sold Out
                            </span>
                          </div>
                        )}
                        <img
                          className={`h-full w-full rounded-lg object-cover ${
                            product.stock === 0 ? "opacity-50" : ""
                          }`}
                          src={product.imgURL || "/iphone16.webp"}
                          alt={product.name}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col h-[12rem] justify-center w-full items-start gap-1">
                      <p className="opacity-80">{product.name}</p>
                      <div className="text-yellow-500 flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar
                            key={index}
                            className={`cursor-pointer ${
                              index <
                              (hoverRatings[product._id] ?? product.stars)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            onMouseEnter={() =>
                              handleMouseEnter(product._id, index + 1)
                            }
                            onMouseLeave={() => handleMouseLeave(product._id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              rateProduct(product._id, index + 1);
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {product.votes || 0} votes
                      </p>
                      <div className="flex w-full justify-between">
                        <div className="flex gap-2">
                          {product.discountedPrice &&
                          product.discountedPrice > 0 ? (
                            <>
                              <p className="line-through text-gray-700 opacity-70">
                                ${product.price.toFixed(2)}
                              </p>
                              <p className="text-black font-bold opacity-90">
                                ${product.discountedPrice.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="font-bold opacity-90">
                              ${product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        {product.stock === 0 ? (
                          <button
                            className="bg-gray-200 text-gray-500 mb-3 p-1 rounded-3xl cursor-not-allowed"
                            disabled
                          >
                            :(
                          </button>
                        ) : user.role === "admin" ? (
                          <div className="flex gap-2">
                            <button
                              className="hover:text-blue-500 mb-3 duration-200 rounded-3xl p-1"
                              onClick={(e) => {
                                e.preventDefault();
                                openEditModal(product);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="hover:text-red-500 mb-3 duration-200 rounded-3xl p-1"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteProduct(product._id);
                              }}
                            >
                              {deletingProduct === product._id ? (
                                <motion.div
                                  initial={{ scale: 1, rotate: 0 }}
                                  animate={{ scale: 1.1, rotate: 360 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="text-red-500"
                                >
                                  <FaTrash />
                                </motion.div>
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            className="bg-gray-200 hover:bg-red-500 mb-3 hover:text-white duration-200 rounded-3xl p-3"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCartHandler(product);
                            }}
                          >
                            <RiShoppingCartLine />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex-container">
          <div> currentPage : {currentPage} </div>
          <div className="paginate-ctn">
            <div
              className="round-effect"
              onClick={() => {
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
            >
              &lsaquo;
            </div>
            {(() => {
              const items = [];
              let leftSide = currentPage - 2;
              if (leftSide < 1) leftSide = 1;
              let rightSide = currentPage + 2;
              if (rightSide > totalPages) rightSide = totalPages;
              for (let number = leftSide; number <= rightSide; number++) {
                items.push(
                  <div
                    key={number}
                    className={`round-effect ${
                      number === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </div>
                );
              }
              return items;
            })()}
            <div
              className="round-effect"
              onClick={() => {
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
            >
              &rsaquo;
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProductModal
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={handleUpdateProduct}
        />
      )}
    </div>
  );
};

export default ShopProducts;
