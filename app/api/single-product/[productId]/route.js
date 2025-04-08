import { NextResponse } from "next/server";
import connect from "@/db";
import Product from "@/models/Product";

export const GET = async (request, { params }) => {
  const { productId } = params; 
  try {
    await connect();

    const product = await Product.findById(productId); 

    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(product), { status: 200 }); 
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
