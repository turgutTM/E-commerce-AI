import { NextResponse } from "next/server";
import connect from "../../../db";
import Product from "@/models/Product";

export const POST = async (req) => {
  try {
    await connect();
    const {
      userID,
      imgURL,
      name,
      price,
      details,
      category,
      discountPercentage,
    } = await req.json();
    console.log(
      userID,
      imgURL,
      name,
      price,
      details,
      category,
      discountPercentage
    );

    if (!userID || !name || !price || !details || !category) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const finalPrice =
      discountPercentage && discountPercentage > 0
        ? price - (price * discountPercentage) / 100
        : null;

    const newProduct = new Product({
      userID,
      imgURL,
      name,
      price,
      discountedPrice: finalPrice,
      details,
      category,
      discountPercentage: discountPercentage || 0,
    });

    await newProduct.save();

    return new NextResponse(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
