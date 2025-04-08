import { NextResponse } from "next/server";
import connect from "@/db";
import Product from "@/models/Product";

export const DELETE = async (req, { params }) => {
  try {
    await connect();
    const { id } = params;
    if (!id) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Product deleted successfully",
        product: deletedProduct,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
