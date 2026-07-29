import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'DevBlog | Portfolio & Articles',
  description: 'Built with Next.js 15 & Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-white dark:bg-black text-slate-900 dark:text-gray-100 min-h-screen transition-colors duration-300 flex">
        {/* Left Vertical Navbar / Sidebar */}
        <Navbar />

        {/* Right Side Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl">
          {children}
        </main>
      </body>
    </html>
  );
}