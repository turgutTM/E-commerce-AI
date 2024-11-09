import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/User";
import Product from "@/models/Product";

export const POST = async (request) => {
  const { userId, productId, quantity } = await request.json();
  console.log(userId, productId, quantity);

  if (!userId || !productId || !quantity) {
    return new NextResponse(
      JSON.stringify({
        message: "User ID, Product ID, and quantity are required",
      }),
      { status: 400 }
    );
  }

  try {
    await connect();

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 404,
      });
    }
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid product ID" }),
        { status: 404 }
      );
    }

    if (product.quantity < quantity) {
      return new NextResponse(
        JSON.stringify({
          message: `Only ${product.quantity} items left in stock.`,
        }),
        { status: 400 }
      );
    }

    const totalPrice = product.price * quantity;

    try {
      await user.deductBalance(totalPrice);
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    }

    product.quantity -= quantity;

    const order = {
      orderDate: new Date(),
      products: [
        {
          productId: product._id,
          quantity,
          price: totalPrice,
        },
      ],
      totalAmount: totalPrice,
      status: "pending",
    };

    user.orders.push(order);

    user.cart = user.cart.filter((item) => !item.productId.equals(product._id));

    await product.save();
    await user.save();

    return new NextResponse(
      JSON.stringify({
        message: "Product purchased successfully",
        remainingStock: product.quantity,
        orders: user.orders,
        newBalance: user.balance,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Purchase error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
