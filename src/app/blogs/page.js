"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [loading, setLoading] = useState(true);

  // Safe API fetch for blogs
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");

      // 1. Check HTTP response status (200-299)
      if (!res.ok) {
        console.error(`API returned error status: ${res.status}`);
        setPosts([]);
        return;
      }

      // 2. Check Content-Type to prevent HTML parsing errors
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(
          "Expected JSON response, but received HTML or other format",
        );
        setPosts([]);
        return;
      }

      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setPosts(result.data);
      } else {
        setPosts([]);
      }
    } catch (e) {
      console.error("Failed to fetch blogs from API:", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete blog using API
  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setPosts((prevPosts) => prevPosts.filter((p) => p.slug !== slug));
      } else {
        alert(result.message || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Safe Check for posts array
  const safePosts = Array.isArray(posts) ? posts : [];

  // Get all unique tags (Safely handles category/tags)
  const allTags = [
    "All",
    ...new Set(
      safePosts.flatMap((p) => {
        if (Array.isArray(p?.tags)) return p.tags;
        if (p?.category) return [p.category];
        return [];
      }),
    ),
  ];

  // Filter logic
  const filteredPosts = safePosts.filter((post) => {
    const title = post?.title || "";
    const description =
      post?.excerpt || post?.description || post?.content || "";
    const tags = Array.isArray(post?.tags) ? post.tags : [post?.category || ""];

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Portfolio & Blog
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Articles and insights on modern full-stack web development.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={fetchPosts}
            className="text-xs font-medium bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Refresh Data
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
              key={post._id || post.slug}
              className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all"
            >
              <div>
                {/* 1. Meta Section */}
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="font-medium truncate pr-2">
                    By {post.author || "Md. Jahirul Islam"}
                  </span>
                  <span className="whitespace-nowrap text-gray-400 dark:text-gray-500 text-[11px]">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Jul 28, 2026"}
                  </span>
                </div>

                {/* 2. Post Title */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {post.title}
                </h2>

                {/* 3. Post Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {post.excerpt || post.description || post.content}
                </p>
              </div>

              {/* 4. Bottom Action Area */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800/60 mt-auto">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read Article &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
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
