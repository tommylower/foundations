"use client";

import { useState, useEffect } from "react";

const PROJECT_DESCRIPTION = `{{PROJECT_DESCRIPTION}}`;

const PROMPT = PROJECT_DESCRIPTION
  ? `This project is: ${PROJECT_DESCRIPTION}. Delete src/app/page.tsx and build the real landing page. Read AGENTS.md and .agents/design.md first to understand the stack and design direction. Use the existing shadcn/ui components, Tailwind tokens, and Framer Motion for animations. Start with a hero section and build from there.`
  : `Delete src/app/page.tsx and build the real landing page for this project. Read AGENTS.md and .agents/design.md first to understand the stack and design direction. Use the existing shadcn/ui components, Tailwind tokens, and Framer Motion for animations. Start with a hero section and build from there.`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-white transition-colors"
      aria-label="Copy prompt"
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


const stack = [
  ["NEXT.JS", "app router, server components, file routing"],
  ["BUN", "fast runtime, native typescript, quick installs"],
  ["TAILWIND", "utility-first CSS, maps to design tokens"],
  ["SHADCN/UI", "accessible primitives you own as source code"],
  ["FRAMER MOTION", "springs, layout animations, scroll reveals"],
  ["SUPABASE", "postgres, auth, edge functions, realtime"],
  ["TYPESCRIPT", "strict mode, catches problems before runtime"],
  ["OKLCH", "perceptually uniform color, consistent dark mode"],
];

const skills = [
  ["DESIGN", [
    ["ui-principles", "spacing, type, layout, component standards"],
    ["rams", "WCAG accessibility + visual consistency audit"],
    ["framer-motion", "scroll reveals, stagger, hover, accordion patterns"],
    ["responsive-design", "fluid scales, container queries, intrinsic grids"],
    ["gradients", "oklab/oklch, layering, blend modes, animation"],
    ["css-interaction-tips", "button feel, smooth entrances, touch targets"],
    ["reference-patterns", "Linear, Vercel, Lovable production patterns"],
  ]],
  ["DEV TOOLS", [
    ["agentation", "annotation toolbar + MCP agent sync"],
    ["interface-craft", "visual styling overlay, writes back to code"],
    ["dialkit", "sliders + spring editors for tuning values"],
  ]],
  ["WORKFLOWS", [
    ["agent-interviewer", "generate personalized agent behavior profile"],
    ["claude-workflow", "plan mode, subagents, verification loops"],
    ["agent-swarm", "parallel agents, review loops, adversarial review"],
    ["codex-review", "cross-model review via Codex plugin"],
    ["conventions", "code style, naming, file structure, git"],
  ]],
] as const;

const INTERVIEW_PROMPT = `Run /interview to generate a personalized behavior profile for AI agents in this project. It's a short adaptive interview that produces a markdown file with concrete operating rules — save it as AGENTS.md or CLAUDE.md.`;

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white/10">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
      `}</style>
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">

        {/* header */}
        <div className="text-center">
          <p className="text-[11px] tracking-[0.08em] uppercase">
            <span className="inline-block animate-shimmer bg-[length:200%_100%] bg-clip-text text-transparent bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#1e3a8a]">wave</span>
            <span className="text-white"> created.</span>
          </p>
          <p className="text-white text-[11px] tracking-[0.08em] uppercase mt-1">
            happy building.
          </p>
          {PROJECT_DESCRIPTION && (
            <p className="text-neutral-500 text-xs mt-4 max-w-sm mx-auto leading-relaxed">
              {PROJECT_DESCRIPTION}
            </p>
          )}
        </div>

        {/* divider */}
        <div className="h-px bg-neutral-800 mt-10 mb-10" />

        {/* stack */}
        <p className="text-[11px] tracking-[0.08em] text-neutral-500 uppercase mb-6">
          STACK
        </p>
        <div className="space-y-0">
          {stack.map(([name, desc], i) => (
            <div
              key={name}
              className="flex items-baseline gap-4 py-2.5 border-b border-neutral-800/60 last:border-b-0"
            >
              <span className="text-neutral-600 text-[11px] tabular-nums w-5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-neutral-200 text-sm tracking-wide w-36 shrink-0">
                {name}
              </span>
              <span className="text-neutral-500 text-xs">
                {desc}
              </span>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="h-px bg-neutral-800 mt-10 mb-10" />

        {/* agent interviewer */}
        <p className="text-[11px] tracking-[0.08em] text-neutral-500 uppercase mb-6">
          PERSONALIZE YOUR AGENT
        </p>
        <div className="text-sm text-neutral-400 space-y-4 leading-relaxed">
          <p>
            Run <span className="text-neutral-200">/interview</span> in Claude Code to generate a
            personalized behavior profile. A short adaptive interview asks what you hate in AI behavior,
            how much pushback you want, how uncertainty should be handled, and converts your answers into
            concrete operating rules.
          </p>
          <p>
            The output is a portable markdown file you save as <span className="text-neutral-200">AGENTS.md</span>,{" "}
            <span className="text-neutral-200">CLAUDE.md</span>, or any filename your tool reads.
            Works across Claude Code, Cursor, Windsurf, Codex, and anything else that reads project instructions.
          </p>
          <p className="text-neutral-500 text-xs">
            There&apos;s also a stricter V2 variant that pushes harder for specificity.
          </p>
        </div>
        <div className="relative bg-neutral-900/50 border border-neutral-800 rounded-md p-4 pr-10 mt-4">
          <p className="text-[13px] text-neutral-300 leading-relaxed">
            {INTERVIEW_PROMPT}
          </p>
          <CopyButton text={INTERVIEW_PROMPT} />
        </div>

        {/* divider */}
        <div className="h-px bg-neutral-800 mt-10 mb-10" />

        {/* skills */}
        <p className="text-[11px] tracking-[0.08em] text-neutral-500 uppercase mb-6">
          SKILLS
        </p>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          Markdown knowledge packs auto-linked into this project. Agents reference these
          for design patterns, dev tools, and workflow strategies.
        </p>
        <div className="space-y-6">
          {skills.map(([category, items]) => (
            <div key={category}>
              <p className="text-neutral-200 text-xs tracking-wide uppercase mb-3">{category}</p>
              <div className="space-y-0">
                {(items as readonly (readonly [string, string])[]).map(([name, desc]) => (
                  <div
                    key={name}
                    className="flex items-baseline gap-4 py-2 border-b border-neutral-800/40 last:border-b-0"
                  >
                    <span className="text-neutral-300 text-xs tracking-wide w-40 shrink-0">
                      {name}
                    </span>
                    <span className="text-neutral-500 text-xs">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="h-px bg-neutral-800 mt-10 mb-10" />

        {/* dev tools explainer */}
        <p className="text-[11px] tracking-[0.08em] text-neutral-500 uppercase mb-6">
          DEV TOOLS
        </p>
        <div className="text-sm text-neutral-400 space-y-5 leading-relaxed">
          <div>
            <p className="text-neutral-200 text-xs tracking-wide uppercase mb-2">Agentation</p>
            <p>
              Look in the <span className="text-neutral-200">bottom right corner</span>.
              That&apos;s the agentation toolbar &mdash; a design annotation tool
              that lets AI agents give visual feedback directly in your browser.
              Agents can drop pins, highlight elements, and leave notes on your
              UI as you build.
            </p>
          </div>
          <div>
            <p className="text-neutral-200 text-xs tracking-wide uppercase mb-2">Interface Kit</p>
            <p>
              A visual styling overlay &mdash; edit styles directly in the browser
              and it writes back to your code. Select any element, tweak spacing,
              colors, or typography live, and the changes persist to your source files.
            </p>
          </div>
          <p className="text-neutral-500 text-xs">
            Both are dev-only. They disappear in production builds.
          </p>
        </div>

        {/* divider */}
        <div className="h-px bg-neutral-800 mt-10 mb-10" />

        {/* get started */}
        <p className="text-[11px] tracking-[0.08em] text-neutral-500 uppercase mb-4">
          GET STARTED
        </p>
        <p className="text-sm text-neutral-400 mb-4">
          Copy this prompt and give it to Claude to start building:
        </p>
        <div className="relative bg-neutral-900/50 border border-neutral-800 rounded-md p-4 pr-10">
          <p className="text-[13px] text-neutral-300 leading-relaxed">
            {PROMPT}
          </p>
          <CopyButton text={PROMPT} />
        </div>

        {/* footer */}
        <div className="h-px bg-neutral-800 mt-10 mb-6" />
        <div className="flex items-center justify-between text-[11px] text-neutral-600 tracking-[0.04em]">
          <span>scaffolded with wip-scaffold</span>
          <a
            href="https://waveinprogress.com"
            className="hover:text-neutral-400 transition-colors"
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
