import { NextResponse } from "next/server";
import connect from "@/db";
import ShopCart from "@/models/ShopCart";
import User from "@/models/User";
import Product from "@/models/Product";

export const POST = async (request) => {
  const { userId, productId, quantity, price } = await request.json();
  console.log(userId,productId,quantity,price);
  

  if (!userId || !productId || quantity === undefined || price === undefined) {
    return new NextResponse(
      JSON.stringify({
        message: "User ID, Product ID, Quantity, and Price are required",
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

    const availableStock = product.stock;

    const existingCartItem = await ShopCart.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      if (existingCartItem.quantity + quantity > availableStock) {
        return new NextResponse(
          JSON.stringify({ message: "Not enough stock available" }),
          { status: 400 }
        );
      }
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      if (quantity > availableStock) {
        return new NextResponse(
          JSON.stringify({ message: "Not enough stock available" }),
          { status: 400 }
        );
      }
      const newCartItem = new ShopCart({
        userId,
        productId,
        quantity,
        price,
      });
      await newCartItem.save();
    }

    const updatedCart = await ShopCart.find({ userId }).populate("productId");

    return new NextResponse(
      JSON.stringify({
        message: "Product added to cart successfully",
        cart: updatedCart,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Add to cart error:", error.message, error.stack);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
