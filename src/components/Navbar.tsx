"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { icons } from "./icons";

interface NavbarProps {
  variant?: "landing" | "app";
}

export function Navbar({ variant = "app" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const linkClass = (href: string) =>
    pathname === href
      ? "text-[#4f46e5] font-semibold"
      : "text-[#6b645f] hover:text-[#1c1917] transition-colors";

  const logo = (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef0ff] border border-[rgba(79,70,229,0.1)]">
        {icons.brain("w-5 h-5 text-[#4f46e5]")}
      </div>
      <div>
        <span className="block text-sm font-semibold tracking-[0.18em] uppercase gradient-text">
          ContextMe
        </span>
        <span className="block text-[10px] text-[#8a817b]">
          Morning pages for your mind
        </span>
      </div>
    </div>
  );

  if (variant === "landing") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="glass-nav mx-auto max-w-6xl rounded-[28px] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="shrink-0">
              {logo}
            </Link>

            <div className="hidden items-center gap-7 text-sm md:flex">
              <a href="#features" className="text-[#6b645f] hover:text-[#1c1917] transition-colors">Features</a>
              <a href="#how-it-works" className="text-[#6b645f] hover:text-[#1c1917] transition-colors">How It Works</a>
              <a href="#pricing" className="text-[#6b645f] hover:text-[#1c1917] transition-colors">Pricing</a>
              <a href="#learn-more" className="text-[#6b645f] hover:text-[#1c1917] transition-colors">Learn More</a>
              <Link href="/history" className="text-[#6b645f] hover:text-[#1c1917] transition-colors">History</Link>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {userEmail ? (
                <>
                  <span className="max-w-[160px] truncate text-xs text-[#8a817b]">
                    {userEmail}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-[#6b645f] hover:text-[#1c1917] transition-colors"
                  >
                    Logout
                  </button>
                  <Link
                    href="/extract"
                    className="rounded-full bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#4338ca]"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm text-[#6b645f] hover:text-[#1c1917] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#4338ca]"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(28,25,23,0.08)] bg-white/70 text-[#6b645f] md:hidden"
              aria-label="Toggle menu"
            >
              {icons.menu("w-5 h-5")}
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-4 space-y-3 border-t border-[rgba(28,25,23,0.08)] pt-4 md:hidden animate-fade-in-up">
              <a href="#features" className="block text-sm text-[#6b645f]">Features</a>
              <a href="#how-it-works" className="block text-sm text-[#6b645f]">How It Works</a>
              <a href="#pricing" className="block text-sm text-[#6b645f]">Pricing</a>
              <a href="#learn-more" className="block text-sm text-[#6b645f]">Learn More</a>
              <Link href="/history" className="block text-sm text-[#6b645f]">History</Link>
              {userEmail ? (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-[#8a817b]">{userEmail}</p>
                  <Link
                    href="/extract"
                    className="block rounded-full bg-[#4f46e5] px-4 py-3 text-center text-sm font-medium text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-full border border-[rgba(28,25,23,0.08)] px-4 py-3 text-sm text-[#6b645f]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <Link
                    href="/login"
                    className="block rounded-full border border-[rgba(28,25,23,0.08)] px-4 py-3 text-center text-sm text-[#6b645f]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block rounded-full bg-[#4f46e5] px-4 py-3 text-center text-sm font-medium text-white"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-[28px] px-4 py-3">
        <Link href="/" className="shrink-0">
          {logo}
        </Link>

        <div className="hidden items-center gap-5 text-sm md:flex">
          <Link href="/extract" className={linkClass("/extract")}>Extract</Link>
          <Link href="/history" className={linkClass("/history")}>History</Link>
          {userEmail && (
            <>
              <span className="max-w-[160px] truncate text-xs text-[#8a817b]">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-[#6b645f] hover:text-[#1c1917] transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(28,25,23,0.08)] bg-white/70 text-[#6b645f] md:hidden"
          aria-label="Toggle menu"
        >
          {icons.menu("w-5 h-5")}
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-nav mx-auto mt-3 max-w-6xl rounded-[28px] px-4 py-4 md:hidden animate-fade-in-up">
          <div className="space-y-3 text-sm">
            <Link href="/extract" className="block text-[#6b645f]">Extract</Link>
            <Link href="/history" className="block text-[#6b645f]">History</Link>
            {userEmail && (
              <>
                <p className="pt-2 text-xs text-[#8a817b]">{userEmail}</p>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-full border border-[rgba(28,25,23,0.08)] px-4 py-3 text-sm text-[#6b645f]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
