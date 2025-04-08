import { NextResponse } from "next/server";
import connect from "@/db";
import Blog from "@/models/Blog";
import User from "@/models/User"; 

export const POST = async (request) => {
  const { blogId, userId, content } = await request.json();

  if (!blogId || !userId || !content) {
    return new NextResponse(
      JSON.stringify({ message: "Blog ID, User ID, and content are required" }),
      { status: 400 }
    );
  }

  try {
    await connect();

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found" }), {
        status: 404,
      });
    }

  
    const newComment = { userId, content };
    
    blog.comments.push(newComment);
    
    await blog.save();
    
    const user = await User.findById(userId).select("name profilePhoto");

    return new NextResponse(
      JSON.stringify({
        message: "Comment added successfully",
        comment: {
          ...newComment,
          name: user.name,
          profilePhoto: user.profilePhoto,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Add comment error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
