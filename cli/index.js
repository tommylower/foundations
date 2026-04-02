#!/usr/bin/env node

import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync, symlinkSync, writeFileSync, readFileSync, lstatSync, unlinkSync, realpathSync } from "fs";
import { resolve, join, basename } from "path";
import { homedir } from "os";
import { createInterface } from "readline";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const quiet = (cmd, opts = {}) => execSync(cmd, { stdio: "pipe", ...opts }).toString().trim();

const prompt = (question) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => {
    rl.question(question, (a) => { rl.close(); res(a.trim()); });
  });
};

const args = process.argv.slice(2);
const upgradeMode = args.includes("--upgrade");
const infoMode = args.includes("--info");
let name = args.find((a) => !a.startsWith("--"));

const blue = (s) => `\x1b[38;2;56;140;247m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log(blue(`
  ██     ██ ██ ██████
  ██     ██ ██ ██   ██
  ██  █  ██ ██ ██████
  ██ ███ ██ ██ ██
   ███ ███  ██ ██
`));
console.log(dim("  WAVES DONT DIE.") + "  waveinprogress.com\n");

if (infoMode) {
  console.log(`  ${blue("stack")}
  ${dim("next.js (app router)")}  server components, file routing, vercel deploy
  ${dim("bun")}                   fast installs, native typescript
  ${dim("tailwind")}              utility-first, maps to design tokens
  ${dim("shadcn/ui")}             accessible primitives you own as source
  ${dim("framer motion")}         springs, layout animations, scroll reveals
  ${dim("supabase")}              postgres, auth, edge functions, realtime
  ${dim("typescript strict")}     catches problems before runtime
  ${dim("oklch")}                 perceptually uniform color, consistent dark mode

  ${blue("skills")} ${dim("(auto-linked, auto-update)")}
  ${dim("ui-principles")}         spacing, type, layout, component standards, slop detection
  ${dim("gradients")}             oklab/oklch, layering, blend modes, animation recipes
  ${dim("responsive-design")}     fluid clamp() scales, pretext, intrinsic grids
  ${dim("framer-motion")}         scroll reveals, stagger, hover, accordion patterns
  ${dim("css-interaction-tips")}  button feel, entrance, jitter fix, touch targets
  ${dim("rams")}                  WCAG accessibility + visual consistency audit
  ${dim("dialkit")}               dev-only sliders/spring editors for tuning values
  ${dim("reference-patterns")}    Linear, Vercel, Lovable — real production patterns
  ${dim("figma-mcp")}             read tokens + layouts from Figma files
  ${dim("wiretext")}              ASCII wireframes for early layout planning

  ${blue("agent context")}
  ${dim(".agents/")}              project, architecture, design, tasks, tools, skills
  ${dim("AGENTS.md")}             single source of truth for all AI tools
  ${dim("tool configs")}          claude, cursor, windsurf, copilot, codex

  ${blue("commands")}
  ${dim("npx wip-scaffold")}             create a new project
  ${dim("npx wip-scaffold --upgrade")}   update scaffold files (keeps your code)
  ${dim("npx wip-scaffold --info")}      this screen
  ${dim("/rams")}                        run accessibility + design review

  ${blue("links")}
  ${dim("github.com/tommylower/foundations")}   scaffold + docs
  ${dim("github.com/tommylower/skills")}       design + agent skills
  ${dim("waveinprogress.com")}
`);
  process.exit(0);
}

if (!name && !upgradeMode) {
  console.log(dim("  design-first scaffold. next.js, tailwind, supabase, agent context."));
  console.log(dim("  --upgrade") + dim(" to update  ") + dim("--info") + dim(" for full reference\n"));

  name = await prompt("  project name: ");
  if (!name) {
    console.error("\n  no name provided.\n");
    process.exit(1);
  }
  console.log();
}

// ─── upgrade mode ──────────────────────────────────────────────────────────────

if (upgradeMode) {
  const target = process.cwd();

  // sanity check: are we in a scaffolded project?
  if (!existsSync(join(target, "AGENTS.md"))) {
    console.error("\n  not a scaffolded project (no AGENTS.md found). run from the project root.\n");
    process.exit(1);
  }

  console.log("\n  upgrading scaffold files...\n");

  // find template
  const templatePaths = [
    join(import.meta.dirname, "..", "repo-template"),
    join(homedir(), "Desktop/code/tools/foundations/repo-template"),
  ];

  let templateDir;
  for (const p of templatePaths) {
    if (existsSync(p)) {
      templateDir = p;
      break;
    }
  }

  if (!templateDir) {
    console.error("  could not find repo-template. clone foundations first.");
    process.exit(1);
  }

  // ── files that are always safe to overwrite (never contain user content) ──

  const alwaysOverwrite = [
    "AGENTS.md",
    ".claude/CLAUDE.md",
    ".cursor/rules",
    ".windsurfrules",
    ".github/copilot-instructions.md",
    ".github/codex-instructions.md",
    ".gitattributes",
  ];

  for (const file of alwaysOverwrite) {
    const src = join(templateDir, file);
    const dest = join(target, file);
    if (existsSync(src)) {
      mkdirSync(join(dest, ".."), { recursive: true });
      cpSync(src, dest, { force: true });
      console.log(`  updated ${file}`);
    }
  }

  // ── files that should only be created if missing (user fills these in) ──

  const createIfMissing = [
    ".agents/README.md",
    ".agents/project.md",
    ".agents/architecture.md",
    ".agents/design.md",
    ".agents/tasks.md",
    ".agents/tools.md",
    ".agents/skills.md",
    "design/README.md",
  ];

  for (const file of createIfMissing) {
    const src = join(templateDir, file);
    const dest = join(target, file);
    if (existsSync(src) && !existsSync(dest)) {
      mkdirSync(join(dest, ".."), { recursive: true });
      cpSync(src, dest);
      console.log(`  created ${file} (was missing)`);
    }
  }

  // ── re-link skills symlink ──

  const skillsPaths = [
    join(target, "skills"),
    join(homedir(), ".skills"),
    join(homedir(), "Desktop/code/tools/skills"),
  ];

  let skillsDir;
  for (const p of skillsPaths) {
    if (existsSync(p)) {
      skillsDir = p;
      break;
    }
  }

  if (skillsDir) {
    const claudeSkillsDir = join(target, ".claude", "skills");
    mkdirSync(claudeSkillsDir, { recursive: true });

    const symlinkPath = join(claudeSkillsDir, "design");
    const designSkills = join(skillsDir, "design");

    // remove broken or outdated symlink so we can re-create it
    try {
      const stat = lstatSync(symlinkPath);
      if (stat.isSymbolicLink()) {
        unlinkSync(symlinkPath);
      }
    } catch {
      // doesn't exist, that's fine
    }

    if (!existsSync(symlinkPath) && existsSync(designSkills)) {
      try {
        symlinkSync(designSkills, symlinkPath);
        console.log(`  linked design skills from ${skillsDir}`);
      } catch {
        console.log("  skills symlink already exists.");
      }
    }

    console.log(`  skills directory: ${skillsDir}`);
  }

  // ── re-install /rams ──

  const ramsSource = skillsDir ? join(skillsDir, "design/rams/SKILL.md") : null;
  const claudeCommandsDir = join(homedir(), ".claude", "commands");

  if (ramsSource && existsSync(ramsSource)) {
    mkdirSync(claudeCommandsDir, { recursive: true });
    const ramsDest = join(claudeCommandsDir, "rams.md");
    cpSync(ramsSource, ramsDest, { force: true });
    console.log("  updated /rams command.");
  }

  console.log(`
  done. upgraded scaffold files only — source code and design files untouched.

  what was updated:
    - AGENTS.md, tool configs (.claude, .cursor, .windsurfrules, .github)
    - .gitattributes
    - skills symlink
    - /rams command

  what was NOT touched:
    - .agents/*.md (your project context)
    - src/ (your code)
    - design/ (your design files)
    - package.json, node_modules, .env
`);
  process.exit(0);
}

// ─── create mode ───────────────────────────────────────────────────────────────

const target = resolve(process.cwd(), name);

if (existsSync(target)) {
  console.error(`\n  "${name}" already exists.\n`);
  process.exit(1);
}

const step = (label, detail) => console.log(`\n  ${blue("→")} ${label}  ${dim(detail)}\n`);

step("scaffolding", "next.js app router, typescript strict, tailwind");
run(`bunx create-next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir --no-turbopack --no-import-alias`);

process.chdir(target);

step("dependencies", "framer motion, supabase, vercel analytics");
run("bun add framer-motion @supabase/supabase-js @vercel/analytics @vercel/speed-insights");
run("bun add -d prettier");

step("analytics", "page views + real-user performance, auto-reports on vercel");

const layoutPath = join(target, "src/app/layout.tsx");
if (existsSync(layoutPath)) {
  let layout = readFileSync(layoutPath, "utf-8");

  const analyticsImports = `import { Analytics } from "@vercel/analytics/react";\nimport { SpeedInsights } from "@vercel/speed-insights/next";\n`;

  const lastImportIdx = layout.lastIndexOf("import ");
  const lastImportEnd = layout.indexOf("\n", layout.indexOf(";", lastImportIdx));
  layout = layout.slice(0, lastImportEnd + 1) + analyticsImports + layout.slice(lastImportEnd + 1);

  layout = layout.replace(
    /\{children\}([\s\S]*?)<\/body>/,
    `{children}\n          <Analytics />\n          <SpeedInsights />\n      </body>`
  );

  writeFileSync(layoutPath, layout);
}

step("shadcn/ui", "accessible component primitives you own");
try {
  run("bunx shadcn@latest init -y -d");
} catch {
  console.log("  shadcn init had issues — run `bunx shadcn@latest init` manually.");
}

step("agent context", ".agents/, AGENTS.md, tool configs for every AI editor");

const templatePaths = [
  join(import.meta.dirname, "..", "repo-template"),
  join(homedir(), "Desktop/code/tools/foundations/repo-template"),
];

let templateDir;
for (const p of templatePaths) {
  if (existsSync(p)) {
    templateDir = p;
    break;
  }
}

if (!templateDir) {
  console.log("  could not find repo-template. skipping.");
} else {
  cpSync(templateDir, target, { recursive: true, force: false });
}

step("environment", ".env.example + .env.local with supabase placeholders");

writeFileSync(
  join(target, ".env.example"),
  `# supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
`
);

writeFileSync(
  join(target, ".env.local"),
  readFileSync(join(target, ".env.example"), "utf-8")
);

const gitignorePath = join(target, ".gitignore");
if (existsSync(gitignorePath)) {
  const gitignore = readFileSync(gitignorePath, "utf-8");
  if (!gitignore.includes(".env.local")) {
    writeFileSync(gitignorePath, gitignore + "\n.env.local\n");
  }
}

step("skills", "design knowledge library, auto-updates when you add new skills");

const skillsPaths = [
  join(target, "skills"),
  join(homedir(), ".skills"),
  join(homedir(), "Desktop/code/tools/skills"),
];

let skillsDir;
for (const p of skillsPaths) {
  if (existsSync(p)) {
    skillsDir = p;
    break;
  }
}

if (!skillsDir) {
  const defaultSkillsPath = join(homedir(), "Desktop/code/tools/skills");
  try {
    run(`git clone https://github.com/tommylower/skills.git "${defaultSkillsPath}"`, { stdio: "pipe" });
    skillsDir = defaultSkillsPath;
  } catch {
    console.log("  could not clone skills repo. set up later.");
  }
}

if (skillsDir) {
  const claudeSkillsDir = join(target, ".claude", "skills");
  mkdirSync(claudeSkillsDir, { recursive: true });

  const designSkills = join(skillsDir, "design");
  if (existsSync(designSkills)) {
    try {
      symlinkSync(designSkills, join(claudeSkillsDir, "design"));
    } catch {}
  }
}

step("/rams", "accessibility + visual design review command");

const ramsSource = skillsDir ? join(skillsDir, "design/rams/SKILL.md") : null;
const claudeCommandsDir = join(homedir(), ".claude", "commands");

if (ramsSource && existsSync(ramsSource)) {
  mkdirSync(claudeCommandsDir, { recursive: true });
  const ramsDest = join(claudeCommandsDir, "rams.md");
  if (!existsSync(ramsDest)) {
    cpSync(ramsSource, ramsDest);
  }
}

step("landing page", "WIP welcome page at localhost:3000, delete when ready");

// replace next.js default page with WIP landing
const pagePath = join(target, "src/app/page.tsx");
writeFileSync(pagePath, `export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
      <pre className="text-[#388cf7] text-sm leading-tight mb-8">
{\`  ██     ██ ██ ██████
  ██     ██ ██ ██   ██
  ██  █  ██ ██ ██████
  ██ ███ ██ ██ ██
   ███ ███  ██ ██\`}
      </pre>
      <p className="text-neutral-400 text-sm tracking-wide mb-1">WAVES DONT DIE.</p>
      <a
        href="https://waveinprogress.com"
        className="text-neutral-500 text-xs hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        waveinprogress.com
      </a>
      <div className="mt-12 text-neutral-600 text-xs text-center space-y-1">
        <p>scaffolded with wip-scaffold</p>
        <p>delete this file and start building</p>
      </div>
    </div>
  );
}
`);

// clean up default next.js css (remove template styles, keep tailwind directives)
const globalsPath = join(target, "src/app/globals.css");
if (existsSync(globalsPath)) {
  const globals = readFileSync(globalsPath, "utf-8");
  // keep only tailwind directives and css variables, strip everything else
  const lines = globals.split("\n");
  const kept = [];
  let inTailwind = false;
  for (const line of lines) {
    if (line.startsWith("@import") || line.startsWith("@tailwind") || line.startsWith("@layer")) inTailwind = true;
    if (inTailwind || line.trim() === "" || line.startsWith(":root") || line.startsWith("@media") || line.includes("--")) {
      kept.push(line);
    }
  }
  // just write clean tailwind imports
  writeFileSync(globalsPath, `@import "tailwindcss";\n`);
}

step("commit", "initial git commit");

try {
  run("git add -A");
  run('git commit -m "init: scaffold via wip-scaffold"');
} catch {
  console.log("  git commit failed — commit manually.");
}

console.log(`
  ${blue("done.")} your project is ready:

    cd ${name}
    bun dev

  open ${dim("http://localhost:3000")}
`);
