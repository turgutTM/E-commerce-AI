import { NextResponse } from "next/server";
import connect from "@/db";
import Product from "@/models/Product";

export const POST = async (request) => {
  const { userId, productId, rating } = await request.json();

  if (!userId || !productId || !rating) {
    return new NextResponse(
      JSON.stringify({
        message: "User ID, Product ID, and Rating are required",
      }),
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return new NextResponse(
      JSON.stringify({
        message: "Rating must be between 1 and 5",
      }),
      { status: 400 }
    );
  }

  try {
    await connect();

    const product = await Product.findById(productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const existingRatingIndex = product.ratings.findIndex(
      (item) => item.userId === userId
    );

    if (existingRatingIndex > -1) {
      product.ratings[existingRatingIndex].rating = rating;
    } else {
      product.ratings.push({ userId, rating });
      product.votes += 1;
    }

    const totalRatings = product.ratings.length;
    const totalStars = product.ratings.reduce(
      (total, item) => total + item.rating,
      0
    );
    product.stars = totalRatings > 0 ? totalStars / totalRatings : 0;

    await product.save();

    return new NextResponse(
      JSON.stringify({
        message: "Product rated successfully",
        stars: product.stars,
        ratingsCount: product.votes,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in rating:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
