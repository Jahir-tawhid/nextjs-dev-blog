import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

// GET: Fetch a single blog post by its slug
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}

// PUT: Update an existing blog post by its slug
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const body = await request.json();

    const updatedBlog = await Blog.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found to update" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedBlog,
        message: "Blog updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// DELETE: Delete a blog post by its slug
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const deletedBlog = await Blog.findOneAndDelete({ slug });

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found to delete" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
