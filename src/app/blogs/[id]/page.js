"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function BlogDetailPage({ params }) {
  const resolvedParams = use(params);
  const postId = resolvedParams?.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comments State
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [newComment, setNewComment] = useState("");

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 1. Fetch post and existing comments from localStorage
  useEffect(() => {
    if (!postId) return;

    async function fetchPostAndComments() {
      try {
        const localData = localStorage.getItem("blog_posts");
        let localPosts = localData ? JSON.parse(localData) : [];
        if (!Array.isArray(localPosts)) localPosts = [];

        const foundPost = localPosts.find(
          (p) => String(p.id) === String(postId),
        );
        setPost(foundPost || null);

        // Load comments stored in localStorage for this post
        const savedComments = localStorage.getItem(`comments_${postId}`);
        if (savedComments) {
          const parsedComments = JSON.parse(savedComments);
          if (Array.isArray(parsedComments)) {
            setComments(parsedComments);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPostAndComments();
  }, [postId]);

  // Helper function to persist updated comments in state and localStorage
  const saveCommentsToStorage = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
  };

  // 2. Add a new comment (prevents page refresh)
  const handleAddComment = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      name: name.trim() || "Anonymous",
      text: newComment.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      likes: 0,
      loves: 0,
    };

    const updatedComments = [commentObj, ...comments];
    saveCommentsToStorage(updatedComments);

    setNewComment("");
  };

  // 3. Delete a specific comment by ID
  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    saveCommentsToStorage(updatedComments);
  };

  // 4. Clear all comments for this post
  const handleClearAllComments = () => {
    setComments([]);
    localStorage.removeItem(`comments_${postId}`);
  };

  // 5. Trigger edit mode for a comment
  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  // 6. Save edited comment text
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) return;

    const updatedComments = comments.map((c) =>
      c.id === commentId ? { ...c, text: editText.trim() } : c,
    );

    saveCommentsToStorage(updatedComments);
    setEditingId(null);
    setEditText("");
  };

  // 7. Handle reaction counter (Like / Love)
  const handleReaction = (commentId, type) => {
    const updatedComments = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: type === "like" ? (c.likes || 0) + 1 : c.likes || 0,
          loves: type === "love" ? (c.loves || 0) + 1 : c.loves || 0,
        };
      }
      return c;
    });

    saveCommentsToStorage(updatedComments);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center text-gray-400 animate-pulse">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Post Not Found</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto py-10 px-4 text-white">
      <Link
        href="/"
        className="text-xs text-blue-400 hover:underline mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-extrabold mb-3">{post.title}</h1>
      <p className="text-gray-300 mb-8 whitespace-pre-line">
        {post.content || post.desc}
      </p>

      <hr className="border-gray-800 my-8" />

      {/* --- Comments Section --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

          {comments.length > 0 && (
            <button
              onClick={handleClearAllComments}
              className="text-xs text-red-400 hover:text-red-300 transition underline"
            >
              Clear All Comments
            </button>
          )}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={(e) => handleAddComment(e)} className="space-y-3 mb-8">
          <input
            type="text"
            placeholder="Your Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-sm focus:outline-none focus:border-blue-500 text-white"
          />
          <textarea
            placeholder="Write a thoughtful comment..."
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 text-sm focus:outline-none focus:border-blue-500 text-white"
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-semibold text-xs rounded-lg transition"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment, index) => {
            const commentId = comment.id || index;
            return (
              <div
                key={commentId}
                className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col gap-3"
              >
                {/* Header: Name, Date, Edit, Delete */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-200">
                    {comment.name || "Anonymous"}
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 mr-2">
                      {comment.date}
                    </span>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-500/10 rounded transition"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Comment Content or Edit Input */}
                {editingId === comment.id ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">{comment.text}</p>
                )}

                {/* Reaction Buttons */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-800/60 text-xs">
                  <button
                    onClick={() => handleReaction(comment.id, "like")}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition"
                  >
                    👍 <span>{comment.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(comment.id, "love")}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition"
                  >
                    ❤️ <span>{comment.loves || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
