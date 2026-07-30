import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

// GET: Fetch all blogs from the database
export async function GET() {
  try {
    await dbConnect();

    // Sort by latest created blog first
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: blogs }, { status: 200 });
  } catch (error) {
    // Log error to console for debugging purposes
    console.error("GET /api/blogs Error:", error.message || error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
        error: error.message || "Server Error",
      },
      { status: 500 },
    );
  }
}

// POST: Create a new blog post
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newBlog = await Blog.create(body);

    return NextResponse.json(
      { success: true, message: "Blog created successfully", data: newBlog },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/blogs Error:", error.message || error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create blog",
        error: error.message || "Server Error",
      },
      { status: 400 },
    );
  }
}
