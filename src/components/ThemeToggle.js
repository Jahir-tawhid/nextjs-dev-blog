"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // 1. Initially set theme from LocalStorage and update render
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Toggle theme on button click
  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    localStorage.setItem("theme", nextState ? "dark" : "light");

    if (nextState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all cursor-pointer select-none"
      title="Toggle Theme"
    >
      <span>{isDark ? "☀️ Light" : "🌙 Dark"}</span>
    </button>
  );
}
