import { NextResponse } from "next/server";
import connect from "@/db";
import Blog from "@/models/Blog";

export const POST = async (request) => {
  try {
    const { blogId, userId } = await request.json();
    console.log(blogId,userId);
    

    if (!blogId || !userId) {
      return NextResponse.json(
        { message: "Blog ID and User ID are required" },
        { status: 400 }
      );
    }

    await connect();

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return NextResponse.json(
      {
        message: isLiked
          ? "Like removed successfully"
          : "Blog liked successfully",
        blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Like/Unlike error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
