"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { UploadButton } from "../utils/uploadthing";

const AddProductModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    imgURL: "",
    name: "",
    price: "",
    details: "",
    category: "",
    discountPercentage: 0,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountChange = (discount) => {
    setFormData((prev) => ({ ...prev, discountPercentage: discount }));
  };

  const handleImageUpload = (res) => {
    if (res && res.length > 0) {
      setImagePreview(res[0].url);
      setFormData((prev) => ({ ...prev, imgURL: res[0].url }));
      setIsImageUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user._id,
          imgURL: formData.imgURL,
          name: formData.name,
          price: formData.price,
          details: formData.details,
          category: formData.category,
          discountPercentage: formData.discountPercentage,
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating product");
      }

      const newProduct = await response.json();
      console.log("Product created:", newProduct);
      onClose();
      setFormData({
        imgURL: "",
        name: "",
        price: "",
        details: "",
        category: "",
        discountPercentage: 0,
      });
      setImagePreview("");
      setIsImageUploaded(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-[50rem] flex">
        <div className="flex flex-col items-center justify-center w-1/2 border-r pr-4">
          <img
            src={imagePreview || "/profilePhoto.jpg"}
            alt="Product Preview"
            className="w-full h-auto mb-4 border rounded"
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={handleImageUpload}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
          {isImageUploaded && (
            <p className="mt-2 text-sm text-gray-500">
              Image uploaded successfully!
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">Upload Image</p>
        </div>
        <div className="flex flex-col w-1/2 pl-4">
          <h2 className="text-xl font-bold mb-4">Add Product</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 mb-4 rounded"
              required
            />
            <input
              type="text"
              name="price"
              placeholder="Product Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 mb-4 rounded"
              required
            />
            <textarea
              name="details"
              placeholder="Product Details"
              value={formData.details}
              onChange={handleChange}
              className="border p-2 mb-4 rounded"
              required
            ></textarea>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 mb-4 rounded bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Toys">Toys</option>
            </select>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Discount</h3>
              <div className="flex gap-2">
                {[5, 25, 30, 50].map((discount) => (
                  <button
                    key={discount}
                    type="button"
                    onClick={() => handleDiscountChange(discount)}
                    className={`p-2 rounded-full px-6 border text-white ${
                      formData.discountPercentage === discount
                        ? "bg-blue-400"
                        : "bg-gray-600"
                    } transition-all hover:bg-blue-400 focus:outline-none`}
                  >
                    {discount}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded transition-all hover:bg-blue-600"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full p-2 rounded border transition-all hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
