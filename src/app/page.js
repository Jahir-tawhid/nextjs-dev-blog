"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(4);

  // Fetch all posts from API and localStorage inside useEffect
  useEffect(() => {
    const loadAllPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const apiPosts = await response.json();
        const safeApiPosts = Array.isArray(apiPosts) ? apiPosts : [];

        const localData = localStorage.getItem("blog_posts");
        let localPosts = [];
        if (localData) {
          const parsed = JSON.parse(localData);
          localPosts = Array.isArray(parsed) ? parsed : [];
        }

        setPosts([...localPosts, ...safeApiPosts]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllPosts();
  }, []);

  // Handle post deletion from localStorage and state
  const handleDelete = (id) => {
    const isConfirmed = confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) return;

    const rawData = localStorage.getItem("blog_posts");
    if (rawData) {
      try {
        const localPosts = JSON.parse(rawData);
        if (Array.isArray(localPosts)) {
          const updated = localPosts.filter((p) => String(p.id) !== String(id));
          localStorage.setItem("blog_posts", JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }

    setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const safePosts = Array.isArray(posts) ? posts : [];

  // Extract unique categories from posts
  const categories = [
    "All",
    ...new Set(safePosts.map((post) => post.category).filter(Boolean)),
  ];

  // Filter posts based on search query and selected category
  const filteredPosts = safePosts.filter((post) => {
    const title = post?.title || "";
    const desc = post?.desc || post?.description || "";
    const category = post?.category || "";

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Handle loading more posts
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Header Section (Text on left, profile image on right) */}
        <div className="flex items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Portfolio & Blog
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome to my projects and articles.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Link
                href="/blogs/create"
                className="text-xs font-semibold px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                + Create Blog
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Profile Image Section */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-800 shadow-md">
            <Image
              src="/profile.png"
              alt="Md. Jahirul Islam"
              fill
              sizes="(max-width: 768px) 112px, 128px"
              className="object-cover -scale-x-100"
              priority
            />
          </div>
        </div>

        {/* Search Input Section */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleCount(4);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Section */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 animate-pulse">
            Loading posts...
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl mb-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No items found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {visiblePosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                        {post.category || "General"}
                      </span>
                      <span className="font-medium truncate">
                        By Md. Jahirul Islam
                      </span>
                    </div>
                    <span className="whitespace-nowrap text-gray-400 dark:text-gray-500 text-[11px]">
                      {post.date}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {post.desc || post.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Read Article &rarr;
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/edit/${post.id}`}
                      className="text-[11px] font-medium px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && visibleCount < filteredPosts.length && (
          <div className="flex justify-center mb-10">
            <button
              type="button"
              onClick={handleLoadMore}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md cursor-pointer active:scale-95"
            >
              Load More ({filteredPosts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Md. Jahirul Islam. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:jahirtawhid1988@gmail.com"
              className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
            >
              📧 Email: jahirtawhid1988@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/jahirtawhid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
            >
              🔗 LinkedIn: jahirtawhid
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
