import { NextResponse } from "next/server";

// Mock database / data source
const dummyPosts = [
  {
    id: 1,
    title: "Next.js 15 Portfolio",
    category: "Next.js",
    desc: "A fast portfolio built with App Router.",
    date: "2026-07-28",
  },
  {
    id: 2,
    title: "Tailwind CSS v4 Styling",
    category: "CSS",
    desc: "Modern styling using Tailwind v4.",
    date: "2026-07-27",
  },
  {
    id: 3,
    title: "React State Management",
    category: "React",
    desc: "Managing states cleanly with hooks.",
    date: "2026-07-26",
  },
  {
    id: 4,
    title: "AI Integration in Web",
    category: "AI",
    desc: "Integrating OpenAI & Gemini APIs.",
    date: "2026-07-25",
  },
  {
    id: 5,
    title: "TypeScript Fundamentals",
    category: "TypeScript",
    desc: "Type safety in modern JavaScript.",
    date: "2026-07-24",
  },
  {
    id: 6,
    title: "MongoDB Data Persistence",
    category: "Database",
    desc: "Connecting Next.js with MongoDB.",
    date: "2026-07-23",
  },
  {
    id: 7,
    title: "Responsive Web Design",
    category: "CSS",
    desc: "Building mobile-first layouts.",
    date: "2026-07-22",
  },
  {
    id: 8,
    title: "SEO Best Practices",
    category: "Next.js",
    desc: "Optimizing Next.js metadata for search.",
    date: "2026-07-21",
  },
];

export async function GET() {
  // Returns dummy posts as a JSON response with a 200 HTTP status
  return NextResponse.json(dummyPosts, { status: 200 });
}
