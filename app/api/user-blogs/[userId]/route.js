import { NextResponse } from "next/server";
import connect from "@/db";
import Blog from "@/models/Blog";

export const GET = async (req, { params }) => {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Missing userID" }, { status: 400 });
    }

    await connect();

    const userBlogs = await Blog.find({ userID: userId });

    return NextResponse.json(userBlogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
