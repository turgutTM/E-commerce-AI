import { NextResponse } from "next/server";
import connect from "../../../db";
import Product from "@/models/Product";

export const GET = async (req) => {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    return NextResponse.json(
      {
        products,
        totalProducts,
        page,
        totalPages: Math.ceil(totalProducts / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Server error", { status: 500 });
  }
};
