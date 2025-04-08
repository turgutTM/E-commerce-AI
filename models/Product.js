import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    imgURL: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    details: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    votes: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    ratings: [
      {
        userId: String,
        rating: Number,
      },
    ],
    stock: {
      type: Number,
      default: 10,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    views: {
      type: [String],
      default: [],
    },
    boxPhoto: {
      type: String, 
      required: false, 
    },
    embedding: { type: [Number] }, 
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
