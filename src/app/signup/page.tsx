"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { icons } from "@/components/icons";
import { Navbar } from "@/components/Navbar";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // ── Email / password signup ───────────────────────────────
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
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

  // ── Google OAuth ──────────────────────────────────────────
  async function handleGoogleSignup() {
    setError("");
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) setError(authError.message);
    } catch {
      setError("Could not connect to Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar variant="landing" />

      <section className="px-4 pt-32 pb-12">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="text-center animate-fade-in-up">
            {icons.sparkles("w-10 h-10 text-[#4f46e5] mx-auto")}
            <h1 className="mt-4 text-3xl font-semibold text-[#2f241d]">Create your space</h1>
            <p className="mt-3 text-sm leading-7 text-[#6f5e52]">
              Start a calmer, more useful home for what you read and think about.
            </p>
          </div>

          {/* Google button */}
          <div className="mt-8 animate-fade-in-up stagger-1">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[rgba(28,25,23,0.1)] bg-white py-3 text-sm font-medium text-[#1c1917] transition-all hover:border-[rgba(28,25,23,0.18)] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {googleLoading ? (
                <>{icons.spinner("w-4 h-4 animate-spin text-[#4f46e5]")}<span>Connecting…</span></>
              ) : (
                <>{icons.google("w-5 h-5")}<span>Continue with Google</span></>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 animate-fade-in-up stagger-1">
            <div className="h-px flex-1 bg-[rgba(28,25,23,0.08)]" />
            <span className="text-xs text-[#a8a29e]">or sign up with email</span>
            <div className="h-px flex-1 bg-[rgba(28,25,23,0.08)]" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSignup} className="glass-card space-y-4 p-6 animate-fade-in-up stagger-2">
            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading || googleLoading}
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
                placeholder="At least 6 characters"
                disabled={loading || googleLoading}
                className="w-full rounded-[20px] border border-[rgba(28,25,23,0.08)] bg-white px-4 py-3 text-sm text-[#1c1917] placeholder:text-[#a8a29e] transition-all focus:border-[rgba(79,70,229,0.2)] focus:ring-1 focus:ring-[rgba(79,70,229,0.14)] focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading || googleLoading}
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
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4f46e5] py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>{icons.spinner("w-4 h-4 animate-spin")}<span>Creating account…</span></>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8a786a] animate-fade-in-up stagger-3">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4f46e5] transition-colors hover:text-[#4338ca]">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
