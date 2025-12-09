"use client";

import { useEffect, useState, useRef } from "react";

const insights = [
  {
    text: "Product management isn't about managing products. It's about understanding people deeply enough to know what to build next.",
    tag: "On Understanding",
  },
  {
    text: "The best products don't add features. They remove friction. Every line of code should earn its place.",
    tag: "On Building",
  },
  {
    text: "Ship early, but not carelessly. There's a difference between iteration and throwing spaghetti at the wall.",
    tag: "On Shipping",
  },
  {
    text: "Your roadmap is a hypothesis, not a promise. The market will teach you what it actually needs.",
    tag: "On Strategy",
  },
  {
    text: "Users don't want more options. They want the right option at the right moment.",
    tag: "On Simplicity",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [footerFormData, setFooterFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFooterSubmitting, setIsFooterSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowWaitlist(false);
      }
    };

    if (showWaitlist) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [showWaitlist]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWaitlist(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      setTimeout(() => {
        setShowWaitlist(false);
        setSubmitted(false);
        setFormData({ name: "", email: "" });
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFooterSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footerFormData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setFooterSubmitted(true);
      setFooterFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsFooterSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom smooth scroll with easing
  const smoothScrollTo = (targetId: string) => {
    const target = document.getElementById(targetId);
    const scrollContainer = document.querySelector('.scrollbar-hide');

    if (!target || !scrollContainer) return;

    const targetPosition = target.offsetTop - 80; // Offset for nav
    const startPosition = scrollContainer.scrollTop;
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second
    let startTime: number | null = null;

    // Easing function - easeInOutCubic
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      scrollContainer.scrollTop = startPosition + distance * easeProgress;

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  // Handle nav link clicks
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    smoothScrollTo(targetId);
  };

  // Auto-rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
        setIsTransitioning(false);
      }, 400);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* LAYER 1: Background image */}
      <div className="fixed inset-0 z-0">
        {/* Background image - dark abstract mesh */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?q=80&w=3000&auto=format&fit=crop')`,
          }}
        />
        {/* Dark overlay to ensure readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-transparent to-blue-950/30" />
      </div>

      {/* LAYER 2: Frosted glass panel (like Gmail) */}
      <div className="fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 z-10 rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Glass background */}
        <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl" />

        {/* Subtle border */}
        <div className="absolute inset-0 rounded-3xl border border-white/10" />

        {/* Inner glow at edges */}
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]" />

        {/* LAYER 3: Content inside the glass panel - scrollable */}
        <div className="relative h-full overflow-y-auto flex flex-col scrollbar-hide">

          {/* Navigation */}
          <nav className="sticky top-0 z-50 px-4 sm:px-6 md:px-10 py-4 sm:py-5 bg-white/[0.02] backdrop-blur-sm border-b border-white/5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-base sm:text-lg font-medium tracking-tight">
                  The Product First
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-6">
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors"
                >
                  About
                </a>
                <a
                  href="#thoughts"
                  onClick={(e) => handleNavClick(e, 'thoughts')}
                  className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors"
                >
                  Thoughts
                </a>
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all"
                >
                  Join waitlist
                </button>
              </div>
            </div>
          </nav>

          {/* Hero Section - fills viewport minus glass panel insets and nav */}
          <section className="min-h-[90vh] flex items-start px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12">
            <div className="max-w-7xl mx-auto w-full">

              {/* Two column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

                {/* Left side - Hero content */}
                <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

                  {/* Small tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/60">a quiet corner of the internet</span>
                  </div>

                  {/* Main headline */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                    <span className="block text-white">Rethinking what it means</span>
                    <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      to build products
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base md:text-lg text-white/50 mb-3 sm:mb-4 font-light leading-relaxed">
                    Tired of recycled PM advice that sounds smart but doesn&apos;t help? Same. This is where we dig deeper.
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-white/40 mb-6 sm:mb-8 font-light">
                    That gut feeling that there&apos;s a better way to build? Trust it. The best PMs aren&apos;t following frameworks. They&apos;re building their own.
                  </p>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setShowWaitlist(true)}
                      className="px-6 sm:px-8 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all hover:scale-105 text-center"
                    >
                      Join waitlist
                    </button>
                    <a
                      href="#about"
                      onClick={(e) => handleNavClick(e, 'about')}
                      className="px-6 sm:px-8 py-3 rounded-full border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-all text-center"
                    >
                      Learn more
                    </a>
                  </div>
                </div>

                {/* Right side - Insight card */}
                <div className={`transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>

                  {/* Inner glass card */}
                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-8">

                    {/* Card header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="text-xs uppercase tracking-[0.15em] text-white/40">
                        Latest thought
                      </span>
                      <span className={`text-xs uppercase tracking-[0.15em] text-white/30 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                        {insights[currentInsight].tag}
                      </span>
                    </div>

                    {/* Quote */}
                    <div className="min-h-[100px] sm:min-h-[140px] flex items-center">
                      <p className={`text-base sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
                        &ldquo;{insights[currentInsight].text}&rdquo;
                      </p>
                    </div>

                    {/* Progress indicators */}
                    <div className="flex items-center gap-2 mt-4 sm:mt-6">
                      {insights.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsTransitioning(true);
                            setTimeout(() => {
                              setCurrentInsight(i);
                              setIsTransitioning(false);
                            }, 400);
                          }}
                          className={`h-1 rounded-full transition-all duration-500 ${
                            i === currentInsight
                              ? "w-6 sm:w-8 bg-white/60"
                              : "w-2 bg-white/20 hover:bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto border-t border-white/10"></div>
          </div>

          {/* About Section */}
          <section id="about" className="px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">

                {/* Left - Section header */}
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 sm:mb-4 block">About</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                    <span className="text-white">What we&apos;re really doing here</span>
                  </h2>
                  <p className="text-sm sm:text-lg text-white/50 leading-relaxed mb-4 sm:mb-6">
                    You&apos;ve read the books. Done the courses. Tried the frameworks. And still, something doesn&apos;t click. That&apos;s not a you problem.
                  </p>
                  <p className="text-sm sm:text-lg text-white/40 leading-relaxed">
                    The best product thinking doesn&apos;t come from following rules. It comes from asking better questions. That&apos;s what this space is for.
                  </p>
                </div>

                {/* Right - Uncomfortable truths */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <p className="text-sm sm:text-lg text-white/80 leading-relaxed">
                      &ldquo;Most product advice is written for someone else&apos;s company.&rdquo;
                    </p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <p className="text-sm sm:text-lg text-white/80 leading-relaxed">
                      &ldquo;The roadmap is a lie. And that&apos;s okay.&rdquo;
                    </p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <p className="text-sm sm:text-lg text-white/80 leading-relaxed">
                      &ldquo;What if the framework is the problem?&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto border-t border-white/10"></div>
          </div>

          {/* Thoughts Section */}
          <section id="thoughts" className="px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto w-full">
              <div className="mb-8 sm:mb-12">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 sm:mb-4 block">Thoughts</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] sm:leading-[1.1] mb-3 sm:mb-4">
                  <span className="text-white">Recent writings</span>
                </h2>
                <p className="text-sm sm:text-lg text-white/40 max-w-2xl">
                  Short-form ideas, observations, and questions about building products.
                </p>
              </div>

              {/* Thoughts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <span className="text-xs uppercase tracking-[0.15em] text-white/30 mb-3 sm:mb-4 block">
                      {insight.tag}
                    </span>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                      &ldquo;{insight.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto border-t border-white/10"></div>
          </div>

          {/* About Me Section */}
          <section className="px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">

                {/* Left side - Label and intro */}
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 sm:mb-4 block">Behind this</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                    <span className="text-white">Hey, I&apos;m Aditya</span>
                  </h2>
                  <p className="text-sm sm:text-lg text-white/50 leading-relaxed mb-3 sm:mb-4">
                    I build products and think a lot about why some things work and others don&apos;t.
                  </p>
                  <p className="text-sm sm:text-lg text-white/40 leading-relaxed">
                    This space is my attempt to make sense of it all, out loud.
                  </p>
                </div>

                {/* Right side - Card with connect */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-8">
                  <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-base sm:text-xl font-medium text-white/80">AC</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm sm:text-base">Aditya Channe</div>
                      <div className="text-white/40 text-xs sm:text-sm">Product Builder</div>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                    If any of this resonates, I&apos;d love to connect.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.linkedin.com/in/adi-channe/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href="https://adityachanne.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto border-t border-white/10"></div>
          </div>

          {/* Join Section */}
          <section id="join" className="px-4 sm:px-6 md:px-10 pt-12 sm:pt-16 pb-16 sm:pb-20">
            <div className="max-w-3xl mx-auto w-full text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4 sm:mb-6 block">Join</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
                <span className="text-white">Want to think along?</span>
              </h2>
              <p className="text-sm sm:text-lg text-white/40 mb-6 sm:mb-10 max-w-xl mx-auto">
                I&apos;m building this in public. Join the waitlist to get early access when new content drops.
              </p>

              {/* Email signup */}
              {footerSubmitted ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">You&apos;re in</h3>
                  <p className="text-sm sm:text-base text-white/40">We&apos;ll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleFooterSubmit} className="flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={footerFormData.name}
                    onChange={(e) => setFooterFormData({ ...footerFormData, name: e.target.value })}
                    required
                    className="w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.05] border border-white/10 text-sm sm:text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={footerFormData.email}
                    onChange={(e) => setFooterFormData({ ...footerFormData, email: e.target.value })}
                    required
                    className="w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.05] border border-white/10 text-sm sm:text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isFooterSubmitting}
                    className="w-full px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFooterSubmitting ? "Joining..." : "Join waitlist"}
                  </button>
                </form>
              )}
              <p className="text-xs text-white/30 mt-3 sm:mt-4">No spam. Just thoughts worth thinking about.</p>
            </div>
          </section>

          {/* Divider */}
          <div className="px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto border-t border-white/10"></div>
          </div>

          {/* Footer inside glass */}
          <footer className="px-4 sm:px-6 md:px-10 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs text-white/30">
              <span>© 2024 The Product First</span>
              <div className="flex items-center gap-4 sm:gap-6">
                <a href="#" className="hover:text-white/60 transition-colors">Twitter</a>
                <a href="#" className="hover:text-white/60 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white/60 transition-colors">Newsletter</a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            ref={modalRef}
            className="relative w-full max-w-md bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={() => setShowWaitlist(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">You&apos;re in</h3>
                <p className="text-sm sm:text-base text-white/40">We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">Join the waitlist</h3>
                  <p className="text-white/40 text-xs sm:text-sm">Be the first to know when we launch.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm sm:text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm sm:text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-white text-black text-sm sm:text-base font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      "Join waitlist"
                    )}
                  </button>
                </form>

                <p className="text-xs text-white/30 text-center mt-4 sm:mt-6">No spam. Just thoughts worth thinking about.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
