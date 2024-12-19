import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";
import Product from "@/models/Product";

export const POST = async (request, { params }) => {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.viewedProducts.includes(productId)) {
      user.viewedProducts.push(productId);
      await user.save();
    }

    return NextResponse.json(
      { message: "Product added to user's viewedProducts", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to user's viewedProducts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
