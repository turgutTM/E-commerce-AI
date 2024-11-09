import { NextResponse } from "next/server";
import connect from "@/db";
import Product from "@/models/Product";

export const PUT = async (req, { params }) => {
  try {
    await connect();
    const { id } = params;

    if (!id) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const body = await req.json();
    const { imgURL, name, price } = body;

    const updatedFields = {};
    if (imgURL) updatedFields.imgURL = imgURL;
    if (name) updatedFields.name = name;
    if (price) updatedFields.price = price;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Product updated successfully",
        product: updatedProduct,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
