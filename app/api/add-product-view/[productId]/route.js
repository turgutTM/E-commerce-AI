import { NextResponse } from "next/server";
import connect from "@/db";
import Product from "@/models/Product";

export const POST = async (request, { params }) => {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
  
    await connect();

   
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
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

    
    if (!product.views.includes(userId)) {
      product.views.push(userId);
      await product.save();
    }

    return NextResponse.json(
      { message: "User ID added to product views", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding user ID to product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
