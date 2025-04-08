import { NextResponse } from "next/server";
import connect from "../../../db";
import Blog from "@/models/Blog";

export const POST = async (req) => {
  try {
    await connect();

    const { userID, title, content,category, blogPhoto } = await req.json();

    console.log(userID, title, content, blogPhoto ,category);

    if (!userID || !title || !content) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const newBlog = new Blog({
      userID,
      title,
      content,
      blogPhoto,
      category
    });

    await newBlog.save();

    return new NextResponse(JSON.stringify(newBlog), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
