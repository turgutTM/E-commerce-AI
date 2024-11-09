import { NextResponse } from "next/server";
import connect from "../../../db";
import Product from "@/models/Product";

export const GET = async (req) => {
  try {
    await connect();

    const products = await Product.find();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
