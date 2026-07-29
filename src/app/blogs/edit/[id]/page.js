"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = resolvedParams?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Next.js",
  });
  const [loading, setLoading] = useState(true);

  // Load previous post data
  useEffect(() => {
    if (!postId) return;

    const rawData = localStorage.getItem("blog_posts");
    if (rawData) {
      try {
        const posts = JSON.parse(rawData);
        if (Array.isArray(posts)) {
          const targetPost = posts.find((p) => String(p.id) === String(postId));
          if (targetPost) {
            // Schedule state update asynchronously to avoid React synchronous render warning
            setTimeout(() => {
              setFormData({
                title: targetPost.title || "",
                description: targetPost.desc || targetPost.description || "",
                content: targetPost.content || "",
                category: targetPost.category || "Next.js",
              });
            }, 0);
          }
        }
      } catch (err) {
        console.error("Error reading post for edit:", err);
      }
    }
    setLoading(false);
  }, [postId]);

  // Handle submit logic for editing post
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const rawData = localStorage.getItem("blog_posts");
      let posts = rawData ? JSON.parse(rawData) : [];
      posts = Array.isArray(posts) ? posts : [];

      // Update existing post object
      const updatedPosts = posts.map((post) => {
        if (String(post.id) === String(postId)) {
          return {
            ...post,
            title: formData.title,
            desc: formData.description,
            description: formData.description,
            content: formData.content,
            category: formData.category,
          };
        }
        return post;
      });

      localStorage.setItem("blog_posts", JSON.stringify(updatedPosts));
      router.push("/");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto text-center text-gray-400 py-20">
        Loading post details...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-xs font-medium text-blue-500 hover:underline mb-6 inline-block"
      >
        &larr; Back to All Blogs
      </Link>

      <h1 className="text-3xl font-extrabold text-white mb-8">
        Edit Blog Post
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
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2.5 rounded-xl border border-gray-800 bg-black text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
