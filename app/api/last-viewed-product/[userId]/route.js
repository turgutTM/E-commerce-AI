import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";

export const PUT = async (request, { params }) => {
  const { userId } = params;


  const body = await request.json();
  const { lastViewedProduct } = body;

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "User ID is required" }),
      { status: 400 }
    );
  }

  if (!lastViewedProduct) {
    return new NextResponse(
      JSON.stringify({ message: "Last Viewed Product ID is required" }),
      { status: 400 }
    );
  }

  try {
   
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    user.lastViewedProduct = lastViewedProduct;
    await user.save();


    return new NextResponse(
      JSON.stringify({
        message: "Last viewed product updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          lastViewedProduct: user.lastViewedProduct,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating last viewed product:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
