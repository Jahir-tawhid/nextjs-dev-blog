"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Web Development",
    author: "Md. Jahirul Islam",
    excerpt: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle automatic slug generation on title change
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title,
      slug: generatedSlug,
    }));
  };

  // Handle standard input updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "content" && !prev.excerpt) {
        updated.excerpt =
          value.slice(0, 150) + (value.length > 150 ? "..." : "");
      }
      return updated;
    });
  };

  // Handle form submission to MongoDB via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      excerpt:
        formData.excerpt.trim() || formData.content.slice(0, 150) + "...",
    };

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create blog post");
      }

      setSuccess("Blog post created successfully! Redirecting to blog list...");
      setTimeout(() => {
        router.push("/blogs");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong while publishing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and publish a new blog post directly to MongoDB
          </p>
        </div>
        <Link
          href="/blogs"
          className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          &larr; View All Blogs
        </Link>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
          ✅ {success}
        </div>
      )}

      {/* Blog Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        {/* Blog Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Blog Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g. Mastering Next.js 15 and MongoDB"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* URL Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            URL Slug (Auto-generated) *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g. mastering-nextjs-15-and-mongodb"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category & Author Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Web Development">Web Development</option>
              <option value="Programming">Programming</option>
              <option value="Next.js">Next.js</option>
              <option value="React">React</option>
              <option value="Database">Database</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Author Name *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Md. Jahirul Islam"
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Short Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Short Excerpt / Summary *
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            required
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A brief 1-2 sentence overview of your article"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Full Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Blog Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog post content here..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? "Publishing Post..." : "🚀 Publish Blog Post"}
        </button>
      </form>
    </main>
  );
}
