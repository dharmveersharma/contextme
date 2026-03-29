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
  const router = useRouter();

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

  return (
    <main className="min-h-screen">
      <Navbar variant="landing" />

      <section className="pt-24 pb-12 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-sm mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in-up">
            {icons.brain("w-10 h-10 text-violet-400 mx-auto mb-3")}
            <h1 className="text-2xl font-bold mb-1">Create Account</h1>
            <p className="text-sm text-gray-400">
              Start building your AI-powered knowledge base
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-4 animate-fade-in-up stagger-1"
          >
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs">
                {icons.warning("w-3.5 h-3.5")}
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              {loading ? (
                <>
                  {icons.spinner("w-4 h-4 animate-spin")}
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6 animate-fade-in-up stagger-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
