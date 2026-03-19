import Link from "next/link";

// ─── Inline SVG Icons (small, consistent sizes) ────────────
const icons = {
  brain: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  link: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  ),
  sparkles: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  search: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  bolt: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
  tag: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  ),
  arrow: (cls: string) => (
    <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  ),
  play: (cls: string) => (
    <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
  ),
};

// ─── Navbar ─────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icons.brain("w-5 h-5 text-violet-400")}
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">ContextMe</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-300 hover:text-white transition-colors px-3 py-1.5">Log In</button>
          <Link href="/extract" className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-full transition-colors font-medium">Get Started Free</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ───────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative pt-20 pb-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/15 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs mb-4">
          {icons.sparkles("w-3 h-3")}
          <span>AI-Powered Knowledge Base</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
          Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">Second Brain</span> That Actually Thinks
        </h1>

        <p className="text-sm text-gray-400 max-w-xl mx-auto mb-5 leading-relaxed">
          Paste any link. AI extracts key insights, finds connections to your saved knowledge, and builds a searchable brain that gets smarter every day.
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Link href="/extract" className="group flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105">
            Start Building Your Brain
            {icons.arrow("w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform")}
          </Link>
          <button className="flex items-center gap-1.5 text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm border border-white/10 hover:border-white/20 transition-all">
            Watch Demo
            {icons.play("w-3.5 h-3.5")}
          </button>
        </div>

        {/* Mockup */}
        <div className="max-w-lg mx-auto rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-3">
          <div className="bg-[#12121a] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-white/5 rounded px-2 py-0.5 text-[10px] text-gray-500">contextme.app</div>
            </div>
            <div className="bg-white/5 rounded px-3 py-2 border border-white/5 mb-2 flex items-center gap-2">
              {icons.link("w-3.5 h-3.5 text-violet-400 shrink-0")}
              <span className="text-gray-400 text-[11px]">Paste any URL, article, video, or text...</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded p-1.5 animate-float" style={{ animationDelay: "0s" }}>
                {icons.sparkles("w-3 h-3 text-violet-400")}
                <p className="text-[9px] text-gray-300 mt-0.5">3 insights extracted</p>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-1.5 animate-float" style={{ animationDelay: "0.5s" }}>
                {icons.link("w-3 h-3 text-indigo-400")}
                <p className="text-[9px] text-gray-300 mt-0.5">5 connections found</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded p-1.5 animate-float" style={{ animationDelay: "1s" }}>
                {icons.tag("w-3 h-3 text-purple-400")}
                <p className="text-[9px] text-gray-300 mt-0.5">Auto-tagged: AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ──────────────────────────────────────────────────
function StatsSection() {
  return (
    <section className="py-4 border-y border-white/5">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-4 gap-4 text-center">
        {[
          ["10x", "Faster Recall"],
          ["500+", "Beta Users"],
          ["50K+", "Insights"],
          ["99%", "Accuracy"],
        ].map(([val, label], i) => (
          <div key={i}>
            <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">{val}</div>
            <p className="text-gray-500 text-[10px]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ───────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: icons.link, title: "Paste Any URL", desc: "Articles, videos, tweets, PDFs — AI extracts insights instantly.", iconCls: "w-4 h-4 text-violet-400", bgCls: "bg-violet-500/10" },
    { icon: icons.brain, title: "Auto-Connect Ideas", desc: "AI finds connections between new saves and existing knowledge.", iconCls: "w-4 h-4 text-indigo-400", bgCls: "bg-indigo-500/10" },
    { icon: icons.search, title: "Smart Search", desc: "Ask questions in natural language. Chat with your notes.", iconCls: "w-4 h-4 text-purple-400", bgCls: "bg-purple-500/10" },
    { icon: icons.bolt, title: "Daily Digest", desc: "Daily summary of new connections. Discover hidden patterns.", iconCls: "w-4 h-4 text-violet-400", bgCls: "bg-violet-500/10" },
    { icon: icons.tag, title: "Auto-Tagging", desc: "AI generates tags and categories. Knowledge organizes itself.", iconCls: "w-4 h-4 text-indigo-400", bgCls: "bg-indigo-500/10" },
    { icon: icons.sparkles, title: "Export Anywhere", desc: "Send notes to Notion, Obsidian, or Markdown.", iconCls: "w-4 h-4 text-purple-400", bgCls: "bg-purple-500/10" },
  ];

  return (
    <section id="features" className="py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-violet-400 text-[10px] font-medium uppercase tracking-wider mb-1">Features</p>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">
            Everything Your Brain <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Can&#39;t Do</span>
          </h2>
          <p className="text-gray-400 text-xs max-w-md mx-auto">Stop losing knowledge. ContextMe remembers, connects, and makes it searchable.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div key={i} className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-3 transition-all hover:scale-[1.02]">
              <div className={`w-7 h-7 rounded-lg ${f.bgCls} flex items-center justify-center mb-1.5`}>
                {f.icon(f.iconCls)}
              </div>
              <h3 className="text-xs font-semibold mb-0.5">{f.title}</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Paste or Save", desc: "Drop any link or text. Use the browser extension for one-click saving." },
    { num: "02", title: "AI Extracts & Connects", desc: "AI pulls insights and finds connections to your existing knowledge." },
    { num: "03", title: "Search & Discover", desc: "Ask in natural language. Get daily digests. Watch your brain grow." },
  ];

  return (
    <section id="how-it-works" className="py-10 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-violet-600/8 rounded-full blur-[80px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-violet-400 text-[10px] font-medium uppercase tracking-wider mb-1">How It Works</p>
          <h2 className="text-xl sm:text-2xl font-bold">
            Three Steps to a <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Smarter You</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-2">
                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">{s.num}</span>
              </div>
              <h3 className="text-xs font-semibold mb-1">{s.title}</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ────────────────────────────────────────────────
function PricingSection() {
  return (
    <section id="pricing" className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-violet-400 text-[10px] font-medium uppercase tracking-wider mb-1">Pricing</p>
          <h2 className="text-xl sm:text-2xl font-bold">
            Start Free, <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Scale Smart</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {/* Free */}
          <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
            <h3 className="text-xs font-semibold">Free</h3>
            <p className="text-gray-500 text-[10px] mb-2">Get started</p>
            <div className="mb-2"><span className="text-xl font-bold">$0</span><span className="text-gray-500 text-[10px]">/mo</span></div>
            <ul className="space-y-1 text-[10px] text-gray-300 mb-3">
              <li>&#10003; 50 saves/month</li>
              <li>&#10003; Basic AI insights</li>
              <li>&#10003; Smart search</li>
              <li className="text-gray-600">&#10003; Connection mapping</li>
            </ul>
            <Link href="/extract" className="block w-full py-1.5 rounded-full border border-white/10 hover:border-white/20 text-[10px] font-medium transition-colors text-center">Get Started</Link>
          </div>
          {/* Pro */}
          <div className="rounded-xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-4 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[9px] font-medium px-2 py-0.5 rounded-full">Popular</div>
            <h3 className="text-xs font-semibold">Pro</h3>
            <p className="text-gray-500 text-[10px] mb-2">For power users</p>
            <div className="mb-2"><span className="text-xl font-bold">$12</span><span className="text-gray-500 text-[10px]">/mo</span></div>
            <ul className="space-y-1 text-[10px] text-gray-300 mb-3">
              <li>&#10003; Unlimited saves</li>
              <li>&#10003; Advanced AI insights</li>
              <li>&#10003; Connection mapping</li>
              <li>&#10003; Daily digests</li>
              <li>&#10003; Export to Notion</li>
            </ul>
            <button className="w-full py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-[10px] font-medium transition-colors">Start Pro Trial</button>
          </div>
          {/* Team */}
          <div className="rounded-xl border border-violet-500/15 bg-gradient-to-br from-violet-500/5 to-transparent p-4">
            <h3 className="text-xs font-semibold">Team</h3>
            <p className="text-gray-500 text-[10px] mb-2">Shared power</p>
            <div className="mb-2"><span className="text-xl font-bold">$29</span><span className="text-gray-500 text-[10px]">/user/mo</span></div>
            <ul className="space-y-1 text-[10px] text-gray-300 mb-3">
              <li>&#10003; Everything in Pro</li>
              <li>&#10003; Shared knowledge base</li>
              <li>&#10003; Team connections</li>
              <li>&#10003; Admin dashboard</li>
              <li>&#10003; Priority support</li>
            </ul>
            <button className="w-full py-1.5 rounded-full border border-white/10 hover:border-white/20 text-[10px] font-medium transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-violet-600/15 rounded-full blur-[80px]" />
      </div>
      <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
        {icons.brain("w-8 h-8 text-violet-400 mx-auto mb-2")}
        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Stop Forgetting. <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Start Connecting.</span>
        </h2>
        <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
          Join thousands using ContextMe as their AI-powered second brain. Free to start.
        </p>
        <Link href="/extract" className="group inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105">
          Get Started for Free
          {icons.arrow("w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform")}
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-6 mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              {icons.brain("w-4 h-4 text-violet-400")}
              <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">ContextMe</span>
            </div>
            <p className="text-gray-500 text-[10px] leading-relaxed">AI second brain that remembers and connects.</p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-1.5 text-gray-300">Product</h4>
            <ul className="space-y-0.5 text-[10px] text-gray-500">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Extension</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-1.5 text-gray-300">Company</h4>
            <ul className="space-y-0.5 text-[10px] text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-1.5 text-gray-300">Legal</h4>
            <ul className="space-y-0.5 text-[10px] text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[10px] text-gray-600">
          <p>&copy; 2026 ContextMe. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
