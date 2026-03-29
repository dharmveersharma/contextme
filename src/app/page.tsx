import Link from "next/link";
import { icons } from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { ScrollReveal } from "@/components/ScrollReveal";

function CoffeeScene() {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-[24px] border border-[rgba(28,25,23,0.08)] bg-[linear-gradient(180deg,#fffaf2_0%,#f8efe0_100%)] p-5">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_70%)]" />
      <div className="absolute right-10 top-10 text-[#a8a29e] opacity-80">
        <svg width="84" height="36" viewBox="0 0 84 36" fill="none" aria-hidden="true">
          <path d="M4 18C8 13 12 13 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 12C18 7 22 7 26 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 11C46 6 50 6 54 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M54 18C58 13 62 13 66 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute left-8 top-14 h-32 w-32 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute left-1/2 top-[28%] h-36 w-36 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8),rgba(255,255,255,0))]" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent_0%,rgba(232,220,201,0.65)_100%)]" />
      <div className="absolute bottom-16 left-0 right-0 h-px bg-[rgba(120,113,108,0.12)]" />

      <div className="absolute bottom-14 right-12 flex flex-col gap-3">
        <span className="h-2 w-20 rounded-full bg-[rgba(120,113,108,0.1)]" />
        <span className="h-2 w-16 rounded-full bg-[rgba(120,113,108,0.08)]" />
        <span className="h-2 w-10 rounded-full bg-[rgba(120,113,108,0.06)]" />
      </div>

      <div className="absolute bottom-10 left-1/2 w-[260px] -translate-x-1/2">
        <div className="relative mx-auto h-48 w-48">
          <div className="absolute left-1/2 top-1 h-20 w-16 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_70%)] blur-md" />
          <div className="absolute left-[74px] top-2 h-12 w-3 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0))] opacity-80 blur-[1px]" />
          <div className="absolute left-[88px] top-0 h-14 w-3 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(255,255,255,0))] opacity-70 blur-[1px]" />
          <div className="absolute left-[102px] top-4 h-10 w-3 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0))] opacity-60 blur-[1px]" />

          <div className="absolute left-1/2 top-8 h-20 w-28 -translate-x-1/2 rounded-[999px] bg-[#f2ddd1] shadow-[inset_0_3px_10px_rgba(255,255,255,0.5)]" />
          <div className="absolute left-1/2 top-11 h-14 w-22 -translate-x-1/2 rounded-[999px] bg-[#6f4e37]" />
          <div className="absolute left-1/2 top-[62px] h-8 w-16 -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle,#9b6b4e_0%,#6f4e37_75%)] opacity-90" />

          <div className="absolute bottom-8 left-1/2 h-24 w-32 -translate-x-1/2 rounded-b-[40px] rounded-t-[26px] border border-[rgba(28,25,23,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f5efe9_100%)] shadow-[0_16px_30px_rgba(28,25,23,0.08)]" />
          <div className="absolute bottom-14 left-1/2 h-5 w-28 -translate-x-1/2 rounded-full bg-[#fffaf5]" />
          <div className="absolute bottom-[60px] left-[144px] h-14 w-10 rounded-r-[24px] border-[6px] border-l-0 border-[#e9ddd0] bg-transparent" />
          <div className="absolute bottom-3 left-1/2 h-4 w-44 -translate-x-1/2 rounded-full bg-[rgba(120,113,108,0.12)] blur-sm" />
        </div>
      </div>

      <div className="absolute left-8 bottom-8 max-w-[170px] rounded-[20px] border border-white/60 bg-white/65 px-4 py-3 shadow-[0_12px_30px_rgba(28,25,23,0.05)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a8a29e]">Morning Pages</p>
        <p className="mt-2 text-sm leading-6 text-[#57534e]">
          Capture thoughts the way a coffee break makes them arrive: slowly, clearly, and all at once.
        </p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative px-4 pt-28 pb-12 sm:pt-32 sm:pb-18">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <ScrollReveal>
          <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,70,229,0.12)] bg-[#eef0ff] px-4 py-2 text-xs text-[#4f46e5]">
            {icons.sparkles("h-3.5 w-3.5")}
            A calmer home for ideas, links, and notes
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[#1c1917] sm:text-5xl lg:text-6xl">
            Your second brain, designed like a clean{" "}
            <span className="gradient-text-warm">morning notebook</span>.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#6b645f] sm:text-lg">
            Save an article, a passing thought, or something you want to return to later. ContextMe turns it into clear, searchable memory with structure that feels light instead of overwhelming.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/extract"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4f46e5] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca]"
            >
              Start Writing
              {icons.arrow("h-4 w-4")}
            </Link>
            <a
              href="#learn-more"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(28,25,23,0.08)] bg-white/80 px-6 py-3 text-sm font-medium text-[#6b645f] transition-all hover:border-[rgba(79,70,229,0.16)] hover:text-[#1c1917]"
            >
              Learn More
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["One place", "for links, notes, and saved context"],
              ["Quick recall", "without digging through old tabs"],
              ["Daily use", "that feels steady and uncluttered"],
            ].map(([title, text], index) => (
              <ScrollReveal key={title} delayMs={index * 90}>
                <div className="glass-card p-5">
                  <p className="text-lg font-semibold text-[#1c1917]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6b645f]">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={120}>
          <div className="relative">
            <div className="glass-card overflow-hidden p-5">
              <CoffeeScene />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Capture without clutter",
      description: "Save articles, pages, and thoughts into one clean place.",
      icon: icons.link,
      tone: "bg-[#eef0ff] text-[#4f46e5]",
    },
    {
      title: "Summaries you can skim",
      description: "Readable takeaways instead of walls of AI text.",
      icon: icons.document,
      tone: "bg-[#fff3e0] text-[#d97706]",
    },
    {
      title: "Connections that resurface",
      description: "New notes automatically connect with older ideas.",
      icon: icons.brain,
      tone: "bg-[#f4f4ff] text-[#4338ca]",
    },
    {
      title: "Search like memory",
      description: "Find what you meant, not just exact matching words.",
      icon: icons.search,
      tone: "bg-[#fff6ea] text-[#b45309]",
    },
    {
      title: "Gentle organization",
      description: "Tags and structure appear without becoming busy work.",
      icon: icons.tag,
      tone: "bg-[#eef0ff] text-[#4f46e5]",
    },
    {
      title: "Portable notes",
      description: "Export what you save when you want to take it elsewhere.",
      icon: icons.sparkles,
      tone: "bg-[#fff3e0] text-[#d97706]",
    },
  ];

  return (
    <section id="features" className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-[#a8a29e]">Features</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1c1917] sm:text-4xl">
            Light, minimal, and made for{" "}
            <span className="gradient-text">daily thinking</span>.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#6b645f]">
            Morning Pages keeps ContextMe clean and approachable. It feels like opening a favorite notebook, not a technical workspace.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delayMs={index * 80}>
              <div className="glass-card-hover p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.tone}`}>
                  {feature.icon("h-5 w-5")}
                </div>
                <h3 className="mt-5 text-xl font-medium text-[#1c1917]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6b645f]">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    ["01", "Save something", "Paste a link or note the moment it feels important."],
    ["02", "Let it settle", "ContextMe extracts the useful parts and keeps the rest quiet."],
    ["03", "Return later", "Search in plain language and recover the right context quickly."],
  ];

  return (
    <section id="how-it-works" className="px-4 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <ScrollReveal>
          <div className="glass-card p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.22em] text-[#a8a29e]">How It Works</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1c1917] sm:text-4xl">
              Simple enough to use every day.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b645f]">
              The goal is not to build a complicated knowledge machine. It is to make memory, reflection, and recall feel natural.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {steps.map(([num, title, desc], index) => (
            <ScrollReveal key={title} delayMs={index * 90}>
              <div className="glass-card-hover flex gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef0ff] text-sm font-semibold text-[#4f46e5]">
                  {num}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1c1917]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6b645f]">{desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Start building the habit.",
      features: ["50 saves per month", "AI summaries", "Smart search", "Auto tags"],
      button: "border border-[rgba(28,25,23,0.08)] bg-white text-[#6b645f] hover:text-[#1c1917]",
    },
    {
      name: "Pro",
      price: "$12",
      desc: "For people who use ContextMe every day.",
      features: ["Unlimited saves", "Deeper connections", "Daily digest", "Markdown and PDF export"],
      button: "bg-[#4f46e5] text-white hover:bg-[#4338ca]",
      highlight: true,
    },
    {
      name: "Team",
      price: "$29",
      desc: "Shared memory for small teams.",
      features: ["Everything in Pro", "Shared knowledge", "Team recall", "Priority support"],
      button: "border border-[rgba(28,25,23,0.08)] bg-white text-[#6b645f] hover:text-[#1c1917]",
    },
  ];

  return (
    <section id="pricing" className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-[#a8a29e]">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1c1917] sm:text-4xl">
            Start simple, then grow with your notes.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#6b645f]">
            The pricing stays straightforward and the presentation stays light, so the product feels useful instead of salesy.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.name} delayMs={index * 90}>
              <div
                className={`glass-card relative p-6 sm:p-7 ${plan.highlight ? "border-[rgba(79,70,229,0.18)] shadow-[0_22px_50px_rgba(79,70,229,0.12)]" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-6 rounded-full bg-[#4f46e5] px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </div>
                )}
                <p className="text-sm uppercase tracking-[0.18em] text-[#a8a29e]">{plan.name}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold text-[#1c1917]">{plan.price}</span>
                  <span className="pb-1 text-sm text-[#8a817b]">/month</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#6b645f]">{plan.desc}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={feature} className="flex items-start gap-2 text-sm text-[#57534e]">
                      {icons.check(`mt-0.5 h-4 w-4 ${featureIndex % 2 === 0 ? "text-[#4f46e5]" : "text-[#d97706]"}`)}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button className={`mt-8 w-full rounded-full px-4 py-3 text-sm font-medium transition-all ${plan.button}`}>
                  {plan.name === "Team" ? "Contact Us" : `Choose ${plan.name}`}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearnMoreSection() {
  return (
    <section id="learn-more" className="px-4 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <ScrollReveal>
          <div className="glass-card p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-[#a8a29e]">Learn More</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1c1917] sm:text-4xl">
              Built for calm productivity, not dashboard fatigue.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#6b645f]">
              Morning Pages is the most mainstream-friendly direction for ContextMe. The interface feels clean, soft, and familiar, while the product still does serious knowledge work underneath.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/extract" className="rounded-full bg-[#4f46e5] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca]">
                Try the Extractor
              </Link>
              <Link href="/history" className="rounded-full border border-[rgba(28,25,23,0.08)] bg-white px-5 py-3 text-sm font-medium text-[#6b645f] transition-all hover:text-[#1c1917]">
                View History
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          <ScrollReveal delayMs={80}>
            <div className="glass-card-hover p-6">
              <div className="flex items-center gap-2 text-sm text-[#4f46e5]">
                {icons.document("h-4 w-4")}
                Product notes
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b645f]">
                The notebook-paper texture stays subtle so the product feels distinctive without becoming decorative noise.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <div className="glass-card-hover p-6">
              <div className="flex items-center gap-2 text-sm text-[#d97706]">
                {icons.tag("h-4 w-4")}
                Contact
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b645f]">
                Want a custom workflow, team setup, or a different visual direction? Reach out and we can keep refining it.
              </p>
              <a href="mailto:hello@contextme.app" className="mt-4 inline-flex text-sm text-[#d97706] hover:text-[#b45309] transition-colors">
                hello@contextme.app
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-4 py-14 sm:py-20">
      <ScrollReveal>
        <div className="mx-auto max-w-5xl rounded-[36px] border border-[rgba(28,25,23,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,243,224,0.7),rgba(238,240,255,0.75))] px-6 py-10 text-center shadow-[0_24px_60px_rgba(28,25,23,0.08)] sm:px-10 sm:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#eef0ff]">
            {icons.brain("h-7 w-7 text-[#4f46e5]")}
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-[#1c1917] sm:text-4xl">
            Make remembering feel quiet and easy.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#6b645f]">
            ContextMe gives your thoughts a clean place to land, connect, and come back when you need them.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4f46e5] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#4338ca]"
            >
              Get Started for Free
              {icons.arrow("h-4 w-4")}
            </Link>
            <a
              href="mailto:hello@contextme.app"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(28,25,23,0.08)] bg-white px-6 py-3 text-sm font-medium text-[#6b645f] transition-all hover:text-[#1c1917]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-12 pt-8">
      <div className="mx-auto max-w-6xl border-t border-[rgba(28,25,23,0.08)] pt-8">
        <div className="grid gap-8 md:grid-cols-4">
          <ScrollReveal>
            <div>
              <div className="flex items-center gap-2">
                {icons.brain("w-5 h-5 text-[#4f46e5]")}
                <span className="text-sm font-semibold gradient-text">ContextMe</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b645f]">
                A soft, structured home for links, notes, and personal context.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={70}>
            <div>
              <h3 className="text-sm font-medium text-[#1c1917]">Product</h3>
              <div className="mt-3 space-y-2 text-sm text-[#6b645f]">
                <a href="#features" className="block hover:text-[#1c1917] transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-[#1c1917] transition-colors">Pricing</a>
                <a href="#learn-more" className="block hover:text-[#1c1917] transition-colors">Learn More</a>
                <Link href="/extract" className="block hover:text-[#1c1917] transition-colors">Extractor</Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={140}>
            <div>
              <h3 className="text-sm font-medium text-[#1c1917]">Company</h3>
              <div className="mt-3 space-y-2 text-sm text-[#6b645f]">
                <a href="#learn-more" className="block hover:text-[#1c1917] transition-colors">About</a>
                <a href="mailto:hello@contextme.app" className="block hover:text-[#1c1917] transition-colors">Contact</a>
                <a href="mailto:hello@contextme.app?subject=Partnership" className="block hover:text-[#1c1917] transition-colors">Partnerships</a>
                <a href="mailto:hello@contextme.app?subject=Support" className="block hover:text-[#1c1917] transition-colors">Support</a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={210}>
            <div>
              <h3 className="text-sm font-medium text-[#1c1917]">Resources</h3>
              <div className="mt-3 space-y-2 text-sm text-[#6b645f]">
                <Link href="/history" className="block hover:text-[#1c1917] transition-colors">History</Link>
                <Link href="/login" className="block hover:text-[#1c1917] transition-colors">Log In</Link>
                <Link href="/signup" className="block hover:text-[#1c1917] transition-colors">Sign Up</Link>
                <a href="mailto:hello@contextme.app" className="block hover:text-[#1c1917] transition-colors">hello@contextme.app</a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-8 flex flex-col gap-3 border-t border-[rgba(28,25,23,0.08)] pt-6 text-sm text-[#8a817b] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ContextMe. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-[#1c1917] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[#1c1917] transition-colors">Pricing</a>
            <a href="#learn-more" className="hover:text-[#1c1917] transition-colors">Learn More</a>
            <a href="mailto:hello@contextme.app" className="hover:text-[#1c1917] transition-colors">Contact</a>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar variant="landing" />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <LearnMoreSection />
      <CTASection />
      <Footer />
    </main>
  );
}
