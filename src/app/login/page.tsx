"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { icons } from "@/components/icons";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/extract");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar variant="landing" />

      <section className="px-4 pt-32 pb-12">
        <div className="mx-auto max-w-md">
          <div className="text-center animate-fade-in-up">
            {icons.brain("w-10 h-10 text-[#4f46e5] mx-auto")}
            <h1 className="mt-4 text-3xl font-semibold text-[#2f241d]">Welcome back</h1>
            <p className="mt-3 text-sm leading-7 text-[#6f5e52]">
              Pick up where you left off and return to your saved notes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="glass-card mt-8 space-y-4 p-6 animate-fade-in-up stagger-1">
            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full rounded-[20px] border border-[rgba(28,25,23,0.08)] bg-white px-4 py-3 text-sm text-[#1c1917] placeholder:text-[#a8a29e] transition-all focus:border-[rgba(79,70,229,0.2)] focus:ring-1 focus:ring-[rgba(79,70,229,0.14)] focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                disabled={loading}
                className="w-full rounded-[20px] border border-[rgba(28,25,23,0.08)] bg-white px-4 py-3 text-sm text-[#1c1917] placeholder:text-[#a8a29e] transition-all focus:border-[rgba(79,70,229,0.2)] focus:ring-1 focus:ring-[rgba(79,70,229,0.14)] focus:outline-none disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                {icons.warning("w-4 h-4")}
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4f46e5] py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  {icons.spinner("w-4 h-4 animate-spin")}
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8a786a] animate-fade-in-up stagger-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#4f46e5] transition-colors hover:text-[#4338ca]">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
