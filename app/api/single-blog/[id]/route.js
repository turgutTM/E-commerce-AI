import { NextResponse } from "next/server";
import connect from "@/db";
import Blog from "@/models/Blog";
import User from "@/models/User"; 

export const GET = async (req, { params }) => {
  const { id } = params;

  try {
    await connect();

 
    const blog = await Blog.findById(id);

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

   
    const user = await User.findById(blog.userID);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

 
    const blogWithUser = {
      ...blog.toObject(),
      user, 
    };

    return new NextResponse(JSON.stringify(blogWithUser), { status: 200 });
  } catch (error) {
    console.error("Error fetching blog or user:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
