"use client";

import { useState, useEffect } from "react";

const PROJECT_DESCRIPTION = `{{PROJECT_DESCRIPTION}}`;
const AGENT_PERSONALITY = `{{AGENT_PERSONALITY}}`;

const PROMPT = `Delete src/app/page.tsx and start building.`;

const INTERVIEW_PROMPT = `Run /interview to generate a personalized behavior profile for AI agents in this project. It's a short adaptive interview that produces a markdown file with concrete operating rules. Save it as AGENTS.md or CLAUDE.md.`;

const presets = [
  { name: "The Architect", desc: "plans first, asks before building" },
  { name: "The Sprinter", desc: "ships fast, minimal friction" },
  { name: "The Craftsman", desc: "detail-obsessed, quality over speed" },
];

const sections = [
  { id: "start", label: "Quick Start" },
  { id: "personality", label: "Agent Personality" },
  { id: "stack", label: "The Stack" },
  { id: "skills", label: "The Skills" },
  { id: "context", label: "Agent Context" },
];

function CopyButton({ text, dark }: { text: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`absolute top-3 right-3 p-1.5 transition-colors ${
        dark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-neutral-900"
      }`}
      aria-label="Copy"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1" />
          <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
        </svg>
      )}
    </button>
  );
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-md transition-colors ${
        dark
          ? "text-neutral-500 hover:text-white hover:bg-neutral-800"
          : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60"
      }`}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="3.5" />
          <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5 8.5a5.5 5.5 0 1 1-6-6 4.5 4.5 0 0 0 6 6Z" />
        </svg>
      )}
    </button>
  );
}

function SideNav({ dark, activeId, onNavigate }: { dark: boolean; activeId: string; onNavigate: (id: string) => void }) {
  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1">
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center gap-3 py-2.5 pr-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(id);
            }}
          >
            <span
              className={`block h-[2px] rounded-full transition-all duration-200 ${
                isActive
                  ? dark
                    ? "w-6 bg-white"
                    : "w-6 bg-neutral-900"
                  : dark
                    ? "w-3 bg-neutral-700 group-hover:w-5 group-hover:bg-neutral-400"
                    : "w-3 bg-neutral-300 group-hover:w-5 group-hover:bg-neutral-500"
              }`}
            />
            <span
              className={`text-[11px] tracking-wide transition-colors duration-200 ${
                isActive
                  ? dark
                    ? "text-white"
                    : "text-neutral-900"
                  : dark
                    ? "text-neutral-600 group-hover:text-neutral-300"
                    : "text-neutral-400 group-hover:text-neutral-600"
              }`}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

const stack = [
  ["Next.js", "app router, server components"],
  ["Bun", "runtime + package manager"],
  ["Tailwind", "utility CSS, design tokens"],
  ["shadcn/ui", "accessible primitives"],
  ["Framer Motion", "springs, layout animations"],
  ["Supabase", "postgres, auth, realtime"],
  ["TypeScript", "strict mode"],
  ["OKLCH", "perceptual color, dark mode"],
];

const skills = [
  ["Design", "ui-principles, rams, framer-motion, responsive-design, gradients, css-interaction-tips, reference-patterns"],
  ["Dev Tools", "agentation, dialkit"],
  ["Workflows", "agent-interviewer, claude-workflow, agent-swarm, codex-review, conventions"],
];

const sectionTag = {
  dark: "bg-[#f84fec]/10 text-[#f84fec]/80 border-[#f84fec]/15",
  light: "bg-[#f84fec]/10 text-[#f84fec]/80 border-[#f84fec]/15",
};

const t = (dark: boolean) =>
  dark
    ? {
        bg: "bg-black",
        selection: "selection:bg-blue-500/20",
        heading: "text-white",
        body: "text-neutral-300",
        muted: "text-neutral-500",
        faint: "text-neutral-600",
        label: "text-neutral-400",
        accent: "text-white",
        cardBg: "bg-neutral-900/60",
        cardBorder: "border-neutral-800",
        codeBg: "bg-black/50",
        codeBorder: "border-neutral-800",
        codeText: "text-neutral-200",
        divider: "bg-neutral-800/80",
        waveCreated: "text-white",
        stackItem: "bg-neutral-900/80 border border-neutral-800",
        contextItem: "bg-neutral-900/80 border border-neutral-800",
      }
    : {
        bg: "bg-[#f5f3ef]",
        selection: "selection:bg-blue-500/15",
        heading: "text-neutral-900",
        body: "text-neutral-600",
        muted: "text-neutral-400",
        faint: "text-neutral-400",
        label: "text-neutral-500",
        accent: "text-neutral-900",
        cardBg: "bg-white/70",
        cardBorder: "border-neutral-300/60",
        codeBg: "bg-white",
        codeBorder: "border-neutral-300/50",
        codeText: "text-neutral-800",
        divider: "bg-neutral-300/50",
        waveCreated: "text-neutral-900",
        stackItem: "bg-white/80 border border-neutral-200",
        contextItem: "bg-white/80 border border-neutral-200",
      };

export default function Home() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("start");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const sectionIds = sections.map((s) => s.id);

    const handleScroll = () => {
      if (isNavigating) return;

      const viewportMiddle = window.innerHeight / 2;

      // find which section's vertical range contains the viewport middle
      let active = sectionIds[0];
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const nextEl = i < sectionIds.length - 1 ? document.getElementById(sectionIds[i + 1]) : null;
        const sectionBottom = nextEl ? nextEl.getBoundingClientRect().top : rect.bottom;

        if (rect.top <= viewportMiddle && sectionBottom > viewportMiddle) {
          active = sectionIds[i];
          break;
        }
      }

      // if scrolled to very bottom, activate last section
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 20) {
        active = sectionIds[sectionIds.length - 1];
      }

      // if scrolled to very top, activate first section
      if (window.scrollY < 100) {
        active = sectionIds[0];
      }

      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, isNavigating]);

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    setIsNavigating(true);
    if (id === "start") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    // release scroll tracking after animation completes
    setTimeout(() => setIsNavigating(false), 800);
  };

  const c = t(dark);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${c.bg} font-mono ${c.selection} transition-colors duration-300`}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>

      <SideNav dark={dark} activeId={activeSection} onNavigate={handleNavigate} />

      {/* ── toggle ── */}
      <div className="fixed top-4 left-4 z-50 lg:left-6 lg:top-6">
        <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8 sm:pt-12 pb-16">

        {/* ── header ── */}
        <div className="mb-10">
          <p className="text-[15px] tracking-[0.08em] uppercase mb-8">
            <span className="inline-block animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent bg-gradient-to-r from-[#f84fec]/40 via-[#f84fec] to-[#f84fec]/40">wave</span>
            <span className={c.waveCreated}> created.</span>
          </p>

          <div className="space-y-2">
            {PROJECT_DESCRIPTION && (
              <div className="flex gap-3">
                <span className={`${c.muted} text-[13px] w-24 shrink-0`}>project</span>
                <span className={`${c.heading} text-[13px]`}>{PROJECT_DESCRIPTION}</span>
              </div>
            )}
            <div className="flex gap-3">
              <span className={`${c.muted} text-[13px] w-24 shrink-0`}>personality</span>
              {AGENT_PERSONALITY ? (
                <span className="text-[13px] font-medium text-[#f84fec]">{AGENT_PERSONALITY}</span>
              ) : (
                <span className={`${c.muted} text-[13px]`}>not set</span>
              )}
            </div>
          </div>
        </div>

        {/* ── quick start ── */}
        <div id="start" className="scroll-mt-[9999px]">
          <div className="mb-5">
            <span className={`text-[11px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 rounded border ${dark ? sectionTag.dark : sectionTag.light}`}>
              Quick Start
            </span>
          </div>
        </div>
        <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg p-5`}>
          <p className={`${c.body} text-[13px] leading-relaxed mb-4`}>
            This is a scaffold. Your stack, tools, and agent context are ready.
            Agentation and DialKit are active in dev mode.
            Delete this page and start building.
          </p>
          <div className={`relative ${c.codeBg} border ${c.codeBorder} rounded-md p-4 pr-10`}>
            <p className={`text-[13px] ${c.codeText} leading-relaxed`}>
              {PROMPT}
            </p>
            <CopyButton text={PROMPT} dark={dark} />
          </div>

        </div>

        <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg p-5 mt-3`}>
          <p className={`${c.heading} text-[13px] font-medium mb-3`}>Dev tools active on this page</p>
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <span className={`${c.muted} text-[13px] mt-0.5`}>&bull;</span>
              <p className={`${c.body} text-[13px] leading-relaxed`}>
                <span className={c.accent}>Agentation</span> is the toolbar in the bottom right.
                It lets AI agents leave visual annotations on your UI. Pins, highlights, notes on
                specific elements. When an agent reviews your design, this is how it shows you what
                it sees.
              </p>
            </div>
            <div className="flex gap-3">
              <span className={`${c.muted} text-[13px] mt-0.5`}>&bull;</span>
              <p className={`${c.body} text-[13px] leading-relaxed`}>
                <span className={c.accent}>DialKit</span> is a floating control panel for tuning
                values live. Sliders, color pickers, spring editors. Adjust animations, spacing,
                or any parameter in real time without touching code.
              </p>
            </div>
          </div>
          <p className={`${c.muted} text-xs leading-relaxed`}>
            Both are dev-only. Wrapped in <span className={c.accent}>NODE_ENV === &quot;development&quot;</span> and
            stripped from production builds. Learn more
            at <a href="https://agentation.dev" target="_blank" rel="noopener noreferrer" className="text-[#f84fec] hover:underline">agentation.dev</a> and <a href="https://dialkit.dev" target="_blank" rel="noopener noreferrer" className="text-[#f84fec] hover:underline">dialkit.dev</a>.
            For a full visual styling suite, check out <a href="https://www.interfacecraft.dev" target="_blank" rel="noopener noreferrer" className="text-[#f84fec] hover:underline">interfacecraft.dev</a>.
          </p>
        </div>

        <div className="my-12" />

        {/* ── personality ── */}
        <div id="personality" className="scroll-mt-24">
          <div className="mb-5">
            <span className={`text-[11px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 rounded border ${dark ? sectionTag.dark : sectionTag.light}`}>
              Agent Personality
            </span>
          </div>

          {AGENT_PERSONALITY ? (
            <>
              <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg overflow-hidden`}>
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f84fec]/60" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f84fec]" />
                    </span>
                    <span className={`${c.heading} text-[14px] font-medium`}>{AGENT_PERSONALITY}</span>
                  </div>
                  <span className={`text-[11px] tracking-wide ${c.muted}`}>active</span>
                </div>
              </div>
              <p className={`${c.muted} text-xs mt-4`}>
                Want to change it? Run one of these in your terminal:
              </p>
              <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg overflow-hidden mt-3`}>
                <div className={`flex items-center justify-between px-5 py-3 border-b ${c.cardBorder}`}>
                  <span className={`${c.body} text-[13px]`}>Run a new interview</span>
                  <div className="relative">
                    <code className={`${c.codeText} text-xs`}>/interview</code>
                  </div>
                </div>
                {presets.map((p, i) => (
                  <div key={p.name} className={`flex items-center justify-between px-5 py-3 ${i < presets.length - 1 ? `border-b ${c.cardBorder}` : ""}`}>
                    <div className="flex items-baseline gap-2">
                      <span className={`${c.body} text-[13px]`}>{p.name}</span>
                      <span className={`${c.muted} text-xs`}>{p.desc}</span>
                    </div>
                    <code className={`${c.codeText} text-xs`}>/interview --preset {p.name.toLowerCase().replace(/\s/g, "-")}</code>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={`${c.body} text-[13px] leading-relaxed mb-5`}>
                Your agent doesn&apos;t have a personality yet. Run the interview to teach it
                how you work, or pick a preset to start immediately.
              </p>

              {/* interview CTA */}
              <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg p-5 mb-4`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`${c.heading} text-[13px] font-medium mb-1.5`}>Run the interview</p>
                    <p className={`${c.muted} text-xs leading-relaxed`}>
                      A short adaptive conversation that generates concrete behavior rules
                      tailored to how you think and work. Takes ~2 minutes.
                    </p>
                  </div>
                </div>
                <div className={`relative ${c.codeBg} border ${c.codeBorder} rounded-md p-3 pr-10 mt-4`}>
                  <code className={`${c.codeText} text-[13px]`}>/interview</code>
                  <CopyButton text="/interview" dark={dark} />
                </div>
              </div>

              {/* presets */}
              <p className={`${c.muted} text-xs mb-3`}>Or start with a preset:</p>
              <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg overflow-hidden`}>
                {presets.map((p, i) => (
                  <div key={p.name} className={`group relative px-5 py-3.5 ${i < presets.length - 1 ? `border-b ${c.cardBorder}` : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2.5">
                        <span className={`${c.heading} text-[13px]`}>{p.name}</span>
                        <span className={`${c.muted} text-xs`}>{p.desc}</span>
                      </div>
                      <div className="relative">
                        <code className={`${c.codeText} text-xs`}>/interview --preset {p.name.toLowerCase().replace(/\s/g, "-")}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="my-12" />

        {/* ── stack ── */}
        <div id="stack" className="scroll-mt-24">
          <div className="mb-5">
            <span className={`text-[11px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 rounded border ${dark ? sectionTag.dark : sectionTag.light}`}>
              The Stack
            </span>
          </div>
          <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg overflow-hidden`}>
            {stack.map(([name, desc], i) => (
              <div
                key={name}
                className={`flex items-baseline justify-between px-5 py-3.5 ${
                  i < stack.length - 1 ? `border-b ${c.cardBorder}` : ""
                }`}
              >
                <span className={`${c.heading} text-[13px] shrink-0`}>{name}</span>
                <span className={`${c.muted} text-xs text-right`}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="my-12" />

        {/* ── skills ── */}
        <div id="skills" className="scroll-mt-24">
          <div className="mb-5">
            <span className={`text-[11px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 rounded border ${dark ? sectionTag.dark : sectionTag.light}`}>
              The Skills
            </span>
          </div>
          <p className={`${c.body} text-[13px] leading-relaxed mb-5`}>
            Markdown knowledge packs linked into{" "}
            <span className={c.accent}>.claude/skills/</span>. Agents
            reference these automatically for design patterns, tooling, and workflows.
          </p>
          <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg overflow-hidden`}>
            {skills.map(([category, items], i) => (
              <div
                key={category}
                className={`px-5 py-3.5 ${
                  i < skills.length - 1 ? `border-b ${c.cardBorder}` : ""
                }`}
              >
                <span className={`${c.heading} text-[13px]`}>{category}</span>
                <p className={`${c.muted} text-xs leading-relaxed mt-1.5`}>{items}</p>
              </div>
            ))}
          </div>
          <p className={`${c.faint} text-xs mt-4`}>
            Run <span className={c.label}>npx wip-scaffold --info</span> for the full reference.
          </p>
        </div>

        <div className="my-12" />

        {/* ── agent context ── */}
        <div id="context" className="scroll-mt-24">
          <div className="mb-5">
            <span className={`text-[11px] tracking-[0.12em] uppercase font-medium px-2.5 py-1 rounded border ${dark ? sectionTag.dark : sectionTag.light}`}>
              Agent Context
            </span>
          </div>
          <p className={`${c.body} text-[13px] leading-relaxed mb-5`}>
            Your project ships with structured context that any AI coding tool can read.
            These files tell agents what your project is, how it&apos;s built, and how to work on it.
          </p>
          <div className={`${c.cardBg} border ${c.cardBorder} rounded-lg overflow-hidden`}>
            {[
              [".agents/", "project, architecture, design, tasks"],
              ["AGENTS.md", "single entry point for all AI tools"],
              ["Tool configs", ".claude, .cursor, .windsurf, .github"],
              ["design/", "design tokens, visual direction"],
            ].map(([name, desc], i, arr) => (
              <div
                key={name}
                className={`flex items-baseline justify-between px-5 py-3.5 ${
                  i < arr.length - 1 ? `border-b ${c.cardBorder}` : ""
                }`}
              >
                <span className={`${c.heading} text-[13px] shrink-0`}>{name}</span>
                <span className={`${c.muted} text-xs text-right`}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── footer ── */}
        <div className={`h-px ${c.divider} mt-12 mb-6`} />
        <div className={`flex items-center justify-between text-[11px] ${c.faint} tracking-[0.04em]`}>
          <span>scaffolded with wip-scaffold</span>
          <a
            href="https://waveinprogress.com"
            className={`transition-colors ${dark ? "hover:text-neutral-400" : "hover:text-neutral-600"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            waveinprogress.com
          </a>
        </div>

      </div>
    </div>
  );
}
