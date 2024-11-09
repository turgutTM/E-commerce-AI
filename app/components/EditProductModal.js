import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { UploadButton } from "../utils/uploadthing";

const EditProductModal = ({ product, isOpen, onClose, onUpdate }) => {
  const [imgURL, setImgURL] = useState(product?.imgURL || "");
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    if (product) {
      setImgURL(product.imgURL || "");
      setName(product.name || "");
      setPrice(product.price || "");
      setSuccessMessage(""); 
    }
  }, [product]);

  const handleUpdate = async () => {
    if (!name || !price) {
      alert("Please fill in all fields before updating.");
      return;
    }

    try {
      const response = await axios.put(`/api/edit-product/${product._id}`, {
        imgURL,
        name,
        price,
      });
      onUpdate(response.data.product);
      setSuccessMessage("Product updated successfully!"); 
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product. Please try again."); 
    }
  };

  const handleImageUpload = (res) => {
    if (res && res.length > 0) {
      setImgURL(res[0].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50 bg-opacity-50">
      <div className="bg-white w-96 p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Edit Product</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <img
          src={imgURL || "/default-image.jpg"}
          alt="Product"
          className="w-full h-48 object-cover mb-4"
        />
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleImageUpload}
        />
        <div className="mb-4 mt-2">
          <label className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border rounded-md p-2"
          />
        </div>
        {successMessage && (
          <div className="mb-4 text-green-500">{successMessage}</div>
        )}
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Update Product
        </button>
      </div>
    </div>
  );
};

export default EditProductModal;
