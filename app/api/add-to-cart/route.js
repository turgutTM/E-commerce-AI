import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const POST = async (request) => {
  const { userId, productId } = await request.json();

  if (!userId || !productId) {
    return new NextResponse(
      JSON.stringify({ message: "User ID and Product ID are required" }),
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

    const existingCartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();

    return new NextResponse(
      JSON.stringify({
        message: "Product added to cart successfully",
        cart: user.cart,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
