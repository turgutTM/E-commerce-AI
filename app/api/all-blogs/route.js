// pages/api/get-blogs.js
import { NextResponse } from "next/server";
import connect from "../../../db";
import Blog from "@/models/Blog";

export const GET = async (req) => {
  try {
    await connect();
    const blogs = await Blog.find();
    return new NextResponse(JSON.stringify(blogs), { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
