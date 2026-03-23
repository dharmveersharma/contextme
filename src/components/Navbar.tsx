"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "./icons";

interface NavbarProps {
  variant?: "landing" | "app";
}

export function Navbar({ variant = "app" }: NavbarProps) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? "text-violet-400 font-medium"
      : "text-gray-400 hover:text-white transition-colors";

  if (variant === "landing") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {icons.brain("w-5 h-5 text-violet-400")}
            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              ContextMe
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/history" className="hover:text-white transition-colors">History</Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs text-gray-300 hover:text-white transition-colors px-3 py-1.5">Log In</button>
            <Link href="/extract" className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-full transition-colors font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // App variant (Extract + History pages)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          {icons.brain("w-5 h-5 text-violet-400")}
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
            ContextMe
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/extract" className={linkClass("/extract")}>Extract</Link>
          <Link href="/history" className={linkClass("/history")}>History</Link>
        </div>
      </div>
    </nav>
  );
}
