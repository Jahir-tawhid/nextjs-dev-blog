import Link from "next/link";
import { notFound } from "next/navigation";

// Fetch single blog helper function
async function getSingleBlog(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error loading single blog:", error);
    return null;
  }
}

// Next.js Dynamic Metadata function for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getSingleBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | DevBlog",
      description: "The requested blog post was not found.",
    };
  }

  return {
    title: `${blog.title} | DevBlog`,
    description: blog.excerpt || blog.content.slice(0, 150),
    authors: [{ name: blog.author || "Md. Jahirul Islam" }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content.slice(0, 150),
      type: "article",
      publishedTime: blog.createdAt,
    },
  };
}

export default async function SingleBlogPage({ params }) {
  const { slug } = await params;
  const blog = await getSingleBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      {/* Back Button */}
      <Link
        href="/blogs"
        className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        &larr; Back to all blogs
      </Link>

      {/* Blog Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          {blog.category || "Web Development"}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900 dark:text-gray-100">
          {blog.title}
        </h1>

        {/* Author & Date Info */}
        <div className="flex items-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            By {blog.author || "Md. Jahirul Islam"}
          </span>
          <span>•</span>
          <span>
            {blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Jul 28, 2026"}
          </span>
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed text-sm md:text-base whitespace-pre-line">
        {blog.content}
      </div>
    </main>
  );
}
