import { NextResponse } from "next/server";
import connect from "@/db";
import Blog from "@/models/Blog";
import User from "@/models/User";

export const GET = async (request, { params }) => {
  const { blogId } = params;

  if (!blogId) {
    return new NextResponse(
      JSON.stringify({ message: "Blog ID is required" }),
      { status: 400 }
    );
  }

  try {
    await connect();

    const blog = await Blog.findById(blogId)
      .populate({
        path: "comments.userId",
        select: "profilePhoto name",
      });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

   
    const commentsWithUserDetails = blog.comments.map((comment) => ({
      profilePhoto: comment.userId ? comment.userId.profilePhoto : null, 
      name: comment.userId ? comment.userId.name : "Unknown User", 
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    return new NextResponse(
      JSON.stringify({
        message: "Comments fetched successfully",
        comments: commentsWithUserDetails,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get comments error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
