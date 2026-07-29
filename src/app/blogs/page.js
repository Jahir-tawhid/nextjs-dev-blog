"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch blogs from localStorage safely
  const loadPosts = () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem("blog_posts");
      const savedPosts = saved ? JSON.parse(saved) : [];
      setPosts(Array.isArray(savedPosts) ? savedPosts : []);
    } catch (e) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadPosts();
    });
  }, []);

  const handleResetData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const initialBlogs = await res.json();
      const safeData = Array.isArray(initialBlogs) ? initialBlogs : [];
      localStorage.setItem("blog_posts", JSON.stringify(safeData));
      setPosts(safeData);
    } catch (error) {
      console.error("Failed to reset blogs data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const safePosts = Array.isArray(posts) ? posts : [];
    const updated = safePosts.filter((p) => p.id !== id);
    setPosts(updated);
    localStorage.setItem("blog_posts", JSON.stringify(updated));
  };

  // Safe Check for posts array
  const safePosts = Array.isArray(posts) ? posts : [];

  // Get all unique tags (Safely handles undefined/null)
  const allTags = [
    "All",
    ...new Set(
      safePosts.flatMap((p) => (Array.isArray(p?.tags) ? p.tags : [])),
    ),
  ];

  // Filter logic
  const filteredPosts = safePosts.filter((post) => {
    const title = post?.title || "";
    const description = post?.description || post?.desc || "";
    const tags = Array.isArray(post?.tags) ? post.tags : [];

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 bg-clip-text text-transparent mb-1">
            My Portfolio & Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Articles and insights on modern full-stack web development.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 hover:bg-red-200 dark:hover:bg-red-900/50 px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Reset All Data
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 text-sm">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search articles by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Tags Filter */}
      {allTags.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {allTags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 animate-pulse">
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <p className="text-gray-500 text-sm">
            No blog posts found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all"
            >
              <div>
                {/* 1. Meta Section (Author on left, date on right) */}
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="font-medium truncate pr-2">
                    By Md. Jahirul Islam | Full-Stack Web Developer
                  </span>
                  <span className="whitespace-nowrap text-gray-400 dark:text-gray-500 text-[11px]">
                    {post.date || "Jul 28, 2026"}
                  </span>
                </div>

                {/* 2. Post Title */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {post.title}
                </h2>

                {/* 3. Post Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {post.description || post.desc}
                </p>
              </div>

              {/* 4. Bottom Action Area */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
                <Link
                  href={`/blogs/${post.id}`}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read Article &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
