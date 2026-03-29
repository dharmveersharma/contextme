import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { icons } from "@/components/icons";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const username = email ? email.split("@")[0] : "User";
  const initial = username.charAt(0).toUpperCase() || "U";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="px-4 pt-32 pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.22em] text-[#a8a29e]">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1c1917] sm:text-4xl">
              Your account
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#6b645f]">
              A simple space for your account details now, with room for preferences and profile settings later.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef0ff] text-xl font-semibold text-[#4f46e5]">
                  {initial}
                </div>
                <div>
                  <p className="text-xl font-semibold text-[#1c1917]">{username}</p>
                  <p className="text-sm text-[#8a817b]">ContextMe account</p>
                </div>
              </div>

              <div className="mt-8 rounded-[24px] bg-[#fffdf9] p-5">
                <div className="flex items-center gap-2 text-sm text-[#4f46e5]">
                  {icons.brain("h-4 w-4")}
                  Account overview
                </div>
                <p className="mt-3 text-sm leading-7 text-[#6b645f]">
                  Your account is active and ready to use across extraction, history, and future personalized settings.
                </p>
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Email address</p>
                  <p className="mt-2 text-base text-[#1c1917]">{email}</p>
                </div>

                <div className="border-t border-[rgba(28,25,23,0.08)] pt-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Display name</p>
                  <p className="mt-2 text-base text-[#1c1917]">{username}</p>
                </div>

                <div className="border-t border-[rgba(28,25,23,0.08)] pt-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">Member since</p>
                  <p className="mt-2 text-base text-[#1c1917]">{createdAt}</p>
                </div>

                <div className="border-t border-[rgba(28,25,23,0.08)] pt-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a8a29e]">What comes next</p>
                  <p className="mt-2 text-sm leading-7 text-[#6b645f]">
                    This page is ready for future additions like profile editing, preferences, export defaults, and account controls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
