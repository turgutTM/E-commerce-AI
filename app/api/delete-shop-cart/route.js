import { NextResponse } from "next/server";
import connect from "@/db";
import ShopCart from "@/models/ShopCart";
import User from "@/models/User";
import Product from "@/models/Product";

export const DELETE = async (request) => {
  const { userId, productId } = await request.json();
  console.log(userId, productId);

  if (!userId || !productId) {
    return new NextResponse(
      JSON.stringify({
        message: "User ID and Product ID are required",
      }),
      { status: 400 }
    );
  }

  try {
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 404,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const cartItem = await ShopCart.findOneAndDelete({
      userId,
      productId,
    });

    if (!cartItem) {
      return new NextResponse(
        JSON.stringify({ message: "Cart item not found" }),
        { status: 404 }
      );
    }

    const updatedCart = await ShopCart.find({ userId }).populate("productId");

    return new NextResponse(
      JSON.stringify({
        message: "Product removed from cart successfully",
        cart: updatedCart,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove from cart error:", error.message, error.stack);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
