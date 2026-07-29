import { NextResponse } from "next/server";

const mockBlogs = [
  {
    id: "1",
    title: "Getting Started with Next.js App Router",
    description:
      "Next.js App Router provides a seamless way to build full-stack web applications.",
    date: "2026-07-28",
    author:
      "Md. Jahirul Islam | Full-Stack Web Developer | Next.js & React | AI & SaaS Specialist",
    content: `Next.js App Router provides a seamless way to build full-stack web applications. It brings server components, simplified routing, and nested layout capabilities straight out of the box.`,
    tags: ["Next.js", "React", "Web Dev"],
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS for Clean UI",
    description:
      "Discover best practices and utility classes to build fast, modern responsive layouts.",
    date: "2026-07-28",
    author:
      "Md. Jahirul Islam | Full-Stack Web Developer | Next.js & React | AI & SaaS Specialist",
    content: `Tailwind CSS has completely transformed how modern front-end developers handle styling. Instead of writing bulky custom CSS files, utility-first classes allow you to rapidly craft beautiful, responsive layouts.`,
    tags: ["Tailwind", "CSS", "UI/UX"],
  },
  {
    id: "3",
    title: "Why JavaScript is Still King in 2026",
    description:
      "An overview of modern JavaScript capabilities, performance, and ecosystem growth.",
    date: "2026-07-28",
    author:
      "Md. Jahirul Islam | Full-Stack Web Developer | Next.js & React | AI & SaaS Specialist",
    content: `JavaScript continues to dominate full-stack and modern web application development in 2026. With frameworks like Next.js and the evolution of AI-driven web services, JavaScript remains the core foundation.`,
    tags: ["JavaScript", "Web Dev", "Programming"],
  },
];

export async function GET() {
  return NextResponse.json({
    status: "success",
    total: mockBlogs.length,
    data: mockBlogs,
  });
}
