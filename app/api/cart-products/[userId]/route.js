import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const GET = async (request) => {
  try {
    await connect();

    const userId = request.nextUrl.pathname.split("/").pop();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "userId is required" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate({
      path: "cart.productId",
      select: "name imgURL price discountedPrice",
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const cartProducts = user.cart
      .filter((item) => item.productId)
      .map((item) => ({
        id: item.productId._id,
        name: item.productId?.name || "Unknown Product",
        imgURL: item.productId?.imgURL || "",
        price: item.productId?.price || 0,
        quantity: item.quantity,
        discountedPrice: item.productId?.discountedPrice || item.discountedPrice || 0,
      }));

    return new NextResponse(JSON.stringify({ cartProducts }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
