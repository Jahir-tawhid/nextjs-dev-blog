"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Next.js",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Safely parse data from localStorage
      const rawData = localStorage.getItem("blog_posts");
      let existingPosts = [];

      if (rawData) {
        const parsed = JSON.parse(rawData);
        // Ensure that the parsed data is actually an array
        existingPosts = Array.isArray(parsed) ? parsed : [];
      }

      // 2. Create new post object
      const newPost = {
        id: Date.now(),
        title: formData.title,
        desc: formData.description,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        date: new Date().toISOString().split("T")[0],
      };

      // 3. Safely prepend the new post
      const updatedPosts = [newPost, ...existingPosts];

      // 4. Save updated array back to localStorage
      localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));

      // 5. Redirect to the blog list
      router.push("/");
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-xs font-medium text-blue-500 hover:underline mb-6 inline-block"
      >
        &larr; Back to All Blogs
      </Link>

      <h1 className="text-3xl font-extrabold text-white mb-8">
        Create New Blog Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900/60 p-6 rounded-2xl border border-gray-800"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Blog Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter title..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Next.js">Next.js</option>
            <option value="React">React</option>
            <option value="CSS">CSS</option>
            <option value="AI">AI</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Database">Database</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Short Description
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter short description..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Content
          </label>
          <textarea
            required
            rows={5}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Write your article content..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
