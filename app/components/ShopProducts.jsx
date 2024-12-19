"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { FaPercentage } from "react-icons/fa";
import EditProductModal from "./EditProductModal";
import { useDispatch } from "react-redux";
import { setProduct } from "../features/ProductSlice";
import { addToCart } from "@/app/features/ShopCart";
import TuguAnimation from "./TuguAnimation";
import { FaApple } from "react-icons/fa";
import { SiSamsung } from "react-icons/si";

const ShopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const [hoverRatings, setHoverRatings] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  console.log(products);
  let quantity = 1;

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/all-products");
      setProducts(response.data);
      dispatch(setProduct(response.data));
    } catch (error) {
      console.error("Error fetching products:", error);
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
      const response = await axios.post("/api/add-shop-cart", {
        userId,
        productId: product._id,
        quantity,
        price: product.price,
      });

      await fetchProducts();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const rateProduct = async (productId, rating) => {
    try {
      const userId = user._id;
      const response = await axios.post("/api/rate-product", {
        userId: user._id,
        productId,
        rating,
      });
      console.log("Product rated:", response.data);
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
      console.error("Error rating product:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/delete-product/${productId}`);
      console.log("Product deleted");
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product) => {
    console.log("Opening modal for product:", product);
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
  const getCategoryIcon = (productName) => {
    if (
      productName.startsWith("iPhone") ||
      productName.startsWith("MacBook") ||
      productName.startsWith("AirPods") ||
      productName.startsWith("Apple Watch")
    ) {
      return <FaApple className="text-black text-[16px]" />;
    } else if (productName.startsWith("Samsung")) {
      return (
        <SiSamsung className="text-black text-6xl mt-[-19px] absolute transform scale-x-205" />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TuguAnimation></TuguAnimation>
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
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

  return (
    <div className="flex justify-center w-full pb-20 bg-gray-100">
      <div className="flex flex-col items-center mt-7">
        <div className="w-[85%] flex flex-wrap justify-center mt-20 gap-10 min-h-screen">
          {currentProducts.map((product) => (
            <div className="relative" key={product._id}>
              <Link href={`/product/${product._id}`} passHref>
                <div className="flex flex-col rounded-xl gap-4 p-3 w-[18rem] h-[26rem] border-2 bg-white border-gray-300 transition-transform duration-300">
                  <div className="bg-white rounded-xl w-full h-full relative">
                    {product.stock === 0 && (
                      <div className="absolute top-0 left-0 right-0 bottom-0  flex justify-center items-center rounded-xl z-10">
                        <span className="text-white font-bold text-xl">
                          Sold Out
                        </span>
                      </div>
                    )}
                    <div
                      className={`mb-2 flex justify-between items-center ${
                        product.stock === 0 ? "blur-sm" : ""
                      }`}
                    >
                      <p className="rounded-full font-pfont border-black text-xs text-blue-800  pr-5 w-fit">
                        {getCategoryIcon(product.name)}
                      </p>
                      {product.discountPercentage > 0 && (
                        <FaPercentage className="text-yellow-500" />
                      )}
                    </div>
                    <div className="h-[15rem]">
                      <img
                        className={`h-full w-full flex justify-center object-contain ${
                          product.stock === 0 ? "opacity-50" : ""
                        }`}
                        src={product.imgURL || "/iphone16.webp"}
                        alt={product.name}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col h-[12rem] justify-center w-full items-start gap-1">
                    <p className="opacity-80 font-pfont">{product.name}</p>
                    <div className="text-yellow-500 flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                          key={index}
                          className={`cursor-pointer ${
                            index < (hoverRatings[product._id] ?? product.stars)
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
                            <FaTrash />
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
            </div>
          ))}
        </div>
        <div className="flex gap-4 my-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`p-2 ${
                index + 1 === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } rounded-xl`}
            >
              {index + 1}
            </button>
          ))}
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
