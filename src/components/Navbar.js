"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "+ Create Blog", href: "/admin/create-blog" }, // Updated route path
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 p-6 flex flex-col justify-between sticky top-0 h-screen">
      <div>
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-gray-900 dark:text-white block mb-8 tracking-tight"
        >
          DevBlog<span className="text-blue-500">.</span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-4">
        <p>© 2026 DevBlog</p>
      </div>
    </aside>
  );
}
