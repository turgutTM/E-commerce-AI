import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const DELETE = async (request) => {
  try {
    await connect();

    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return new NextResponse(
        JSON.stringify({ message: "userId and productId are required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    return new NextResponse(
      JSON.stringify({ message: "Product removed from cart successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
