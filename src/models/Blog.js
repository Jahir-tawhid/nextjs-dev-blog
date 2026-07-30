import mongoose from "mongoose";

// Define the Blog Schema
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [200, "Excerpt cannot exceed 200 characters"],
    },
    category: {
      type: String,
      default: "Web Development",
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Md. Jahirul Islam",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  },
);

// Prevent re-compiling the model in Next.js hot-reloading environment
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
