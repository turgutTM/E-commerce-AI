"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/features/ShopCart";
import TuguAnimation from "../../components/TuguAnimation";
import Link from "next/link";
import { setCurrentProduct } from "../../features/ProductSlice";

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStorage, setSelectedStorage] = useState(128);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const reduxCurrentProductId = useSelector(
    (state) => state.product.currentProduct
  );
  const user = useSelector((state) => state.user.user);
  const userId = user ? user._id : null;



  const handleAddToCart = async (productId) => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }
    const selectedPrice = calculatePrice();

    try {
      dispatch(addToCart(product));

      const response = await axios.post("/api/add-shop-cart", {
        userId,
        productId,
        quantity: 1,
        price: selectedPrice,
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(addToCart(data));
      } else {
        console.error("Hata:", data.message);
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
        dispatch(setCurrentProduct(id));
        localStorage.setItem("lastViewedProductId", reduxCurrentProductId);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get("/api/all-products");
        const shuffledProducts = response.data.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffledProducts.slice(0, 20));
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchProduct();
    fetchRelatedProducts();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [id]);

  if (loading) return <TuguAnimation />;

  if (!product) return <div>Product not found.</div>;

  const calculatePrice = () => {
    const extraCost =
      selectedStorage === 256 ? 200 : selectedStorage === 512 ? 400 : 0;
    return product.price + extraCost;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 relative">
      <div
        className={`${
          scrolled
            ? "fixed top-0 left-0 w-full z-50 bg-white transform translate-y-0 transition-transform duration-500 ease-in-out"
            : "absolute top-0 left-0  w-full bg-white transform -translate-y-full transition-transform duration-500 ease-in-out"
        } p-3 px-8 flex justify-between items-center `}
      >
        <div
          onClick={() => router.back()}
          className="flex cursor-pointer hover:text-gray-400 items-center gap-2"
        >
          <MdArrowBack></MdArrowBack>
          <p className="text-sm">Back</p>
        </div>
        <div className="text-xl font-semibold">
          <p className="text-lg font-semibold">
            Total Price: ${calculatePrice()}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <img
            className="w-fit h-12 cursor-pointer"
            src="/tugulogo.png"
            alt="Logo"
          />
        </div>
      </div>

      <div className="flex justify-center relative w-full gap-5 mt-10">
        <div className="w-[65%] sticky top-20 p-4 h-fit max-w-full">
          <div className="w-full h-[27rem] mb-4 relative">
            <img
              className="w-full h-[27rem] object-contain rounded-lg"
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
                    From ${calculatePrice()}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-xs mt-1 font-semibold">
                      or ${(calculatePrice() / 24).toFixed(2)}/mo
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
                      onClick={() => setSelectedStorage(storage)}
                      className={`border-[1px] w-full mt-4 items-center flex justify-between rounded-lg p-4 py-4 border-black cursor-pointer ${
                        selectedStorage === storage
                          ? "border-blue-500 duration-300"
                          : ""
                      }`}
                    >
                      <div className="items-start">
                        <p className="font-semibold text-xl">{storage}GB</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold">
                          From $
                          {product.price +
                            (storage === 256 ? 200 : storage === 512 ? 400 : 0)}
                        </p>
                        <div className="flex flex-col">
                          <p className="text-gray-500 text-xs mt-1 font-semibold">
                            or $
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
                          <p className="text-gray-500 text-xs font-semibold">
                            for 24 mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full mt-10 border-[1px] rounded-lg border-black">
                  {user && user.role !== "admin" && (
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="text-sm text-center w-full p-4 hover:bg-black hover:text-white duration-300 hover:rounded-lg"
                    >
                      Add to cart
                    </button>
                  )}
                </div>

                <p className="text-xs mt-3 text-gray-400">
                  Need some help buying your next Tugu product? Chat with us
                  now.
                </p>
              </div>
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
      <div className="flex flex-col mt-20 h-[30rem] justify-center w-full">
        <div>
          <p className="font-semibold z-50 text-4xl flex justify-center">
            What's in the box
          </p>
        </div>
        <div className="flex justify-center items-center  h-[30rem] gap-28">
          <div className="flex gap-3 w-[18%] h-[60%] flex-col items-center justify-center ">
            <img
              className=" h-full object-cover rounded-lg"
              src={product.boxPhoto}
              alt="Product"
            />
            <p>{product.name}</p>
          </div>
          {product.name.startsWith("iPhone") && (
            <div className="flex flex-col items-center text-center mt-2">
              <img
                className="h-[17rem] object-cover"
                src="/iphonecable.jpeg"
                alt="USB-C Charge Cable"
              />
              <p className="mt-2 ">USB-C Charge Cable</p>
            </div>
          )}
          {product.name.startsWith("Samsung") && (
            <div className="flex flex-col w-[14%] items-center text-center mt-2">
              <img
                className="w-full h-full object-cover"
                src="/samsungcable2.webp"
                alt="USB-C Charge Cable"
              />
              <p>USB-C Charge Cable</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-[75%] py-10 mt-36">
        <h2 className="text-4xl font-bold text-center mb-6">
          Find the best device for yourself
        </h2>
        <div className="flex overflow-x-auto mt-16 gap-8 pb-4">
          {relatedProducts
            .filter((relatedProduct) => relatedProduct._id !== id)
            .map((relatedProduct) => (
              <div key={relatedProduct.id} className="flex-none w-[70%] p-4">
                <Link href={`/product/${relatedProduct._id}`}>
                  <img
                    src={relatedProduct.imgURL || "/blouse.png"}
                    alt="Related Product"
                    className="w-full mt-4 h-96 object-contain rounded-lg mb-4"
                  />
                </Link>
                <p className="text-lg font-semibold text-center">
                  {relatedProduct.name}
                </p>

                <div className="text-center mb-4 mt-4">
                  <div className="flex justify-center gap-4">
                    <p className="text-[13px] border items-center justify-center px-2 border-black p-1 rounded-full font-medium">
                      128GB
                    </p>
                    <p className="text-[13px] border p-1 px-2 border-black rounded-full font-medium">
                      256GB
                    </p>
                    <p className="text-[13px] border p-1 px-2 border-black rounded-full font-medium">
                      512GB
                    </p>
                  </div>
                  <p className="text-gray-500 mt-5 text-sm font-semibold">
                    From ${relatedProduct.price}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
