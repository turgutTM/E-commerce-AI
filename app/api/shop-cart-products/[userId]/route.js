import { NextResponse } from "next/server";
import connect from "@/db";
import ShopCart from "@/models/ShopCart";
import Product from "@/models/Product";

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

    const cartItems = await ShopCart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Cart is empty" }), {
        status: 404,
      });
    }

    const productIds = cartItems.map((item) => item.productId);

    const products = await Product.find({ _id: { $in: productIds } }).select(
      "name imgURL"
    );

    const productMap = products.reduce((acc, product) => {
      acc[product._id] = {
        name: product.name,
        imgURL: product.imgURL,
      };
      return acc;
    }, {});

    const cartDetails = cartItems.map((item) => ({
      productId: item.productId,
      name: productMap[item.productId]?.name || "Unknown Product",
      imgURL: productMap[item.productId]?.imgURL || "",
      price: item.price,
      quantity: item.quantity,
    }));

    return new NextResponse(JSON.stringify({ cartDetails }), {
      status: 200,
    });
  } catch (error) {
    console.error("Get cart error:", error.message, error.stack);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
