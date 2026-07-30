"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function PostDetailsPage({ params }) {
  const resolvedParams = use(params);
  const postId = resolvedParams?.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // State management for comments section
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    async function fetchPostDetails() {
      try {
        // 1. Fetch posts data from API
        const res = await fetch("/api/posts");
        const apiPosts = await res.json();
        const safeApiPosts = Array.isArray(apiPosts) ? apiPosts : [];

        // 2. Fetch posts data from LocalStorage
        const localData = localStorage.getItem("blog_posts");
        let localPosts = [];
        if (localData) {
          const parsed = JSON.parse(localData);
          localPosts = Array.isArray(parsed) ? parsed : [];
        }

        // Combine all posts and find the specific post by matching ID (converted to string)
        const allPosts = [...localPosts, ...safeApiPosts];
        const foundPost = allPosts.find((p) => String(p.id) === String(postId));
        setPost(foundPost || null);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  // Load comments specific to this post from LocalStorage
  useEffect(() => {
    if (!postId) return;
    const rawComments = localStorage.getItem(`comments_${postId}`);
    if (rawComments) {
      try {
        const parsed = JSON.parse(rawComments);
        setComments(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Error parsing comments:", err);
      }
    }
  }, [postId]);

  // Handle new comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: commentAuthor.trim() || "Anonymous Developer",
      text: commentText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);

    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));

    setCommentText("");
    setCommentAuthor("");
  };

  if (loading) {
    return (
      <main className="p-6 md:p-10 max-w-3xl mx-auto text-center py-20 text-gray-400 animate-pulse">
        Loading article details...
      </main>
    );
  }

  if (!post) {
    return (
      <main className="p-6 md:p-10 max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Article Not Found
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all"
        >
          &larr; Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10 max-w-3xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          &larr; Back to all posts
        </Link>
      </div>

      {/* Meta Information */}
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span className="font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          {post.category || "General"}
        </span>
        <span>By Md. Jahirul Islam</span>
        <span>•</span>
        <span>{post.date}</span>
      </div>

      {/* Article Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
        {post.title}
      </h1>

      {/* Article Content */}
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-12">
        <p className="text-lg font-medium">{post.desc || post.description}</p>
        {post.content ? (
          <p className="whitespace-pre-line">{post.content}</p>
        ) : (
          <p>
            Welcome to this detailed article on {post.title}. This post explores
            the fundamental concepts and practical implementation techniques
            necessary to master this topic in modern full-stack development.
          </p>
        )}
      </div>

      {/* ==================== COMMENTS SECTION ==================== */}
      <section className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({comments.length})
        </h3>

        {/* Comment Input Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <textarea
              required
              rows={3}
              placeholder="Write a thoughtful comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-all cursor-pointer"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No comments yet. Be the first to start the discussion!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-900/40"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-200">
                    {item.author}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
