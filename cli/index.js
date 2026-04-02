#!/usr/bin/env node

import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync, symlinkSync, writeFileSync, readFileSync, lstatSync, unlinkSync, realpathSync } from "fs";
import { resolve, join, basename } from "path";
import { homedir } from "os";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const quiet = (cmd, opts = {}) => execSync(cmd, { stdio: "pipe", ...opts }).toString().trim();

const args = process.argv.slice(2);
const upgradeMode = args.includes("--upgrade");
const name = args.find((a) => !a.startsWith("--"));

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

if (!name && !upgradeMode) {
  console.error(`  usage:
    npx wip-scaffold <project-name>     create a new project
    npx wip-scaffold --upgrade           update current project's scaffold files
`);
  process.exit(1);
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

console.log(`\n  creating ${name}...\n`);

// 1. scaffold next.js with bun
run(`bunx create-next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir --no-turbopack --no-import-alias`);

process.chdir(target);

// 2. install deps
console.log("\n  installing dependencies...\n");
run("bun add framer-motion @supabase/supabase-js @vercel/analytics @vercel/speed-insights");
run("bun add -d prettier");

// 2b. add vercel analytics + speed insights to layout
console.log("\n  adding vercel analytics + speed insights...\n");

const layoutPath = join(target, "src/app/layout.tsx");
if (existsSync(layoutPath)) {
  let layout = readFileSync(layoutPath, "utf-8");

  // add imports at the top, after existing imports
  const analyticsImports = `import { Analytics } from "@vercel/analytics/react";\nimport { SpeedInsights } from "@vercel/speed-insights/next";\n`;

  const lastImportIdx = layout.lastIndexOf("import ");
  const lastImportEnd = layout.indexOf("\n", layout.indexOf(";", lastImportIdx));
  layout = layout.slice(0, lastImportEnd + 1) + analyticsImports + layout.slice(lastImportEnd + 1);

  // add components before closing </body>
  layout = layout.replace(
    /\{children\}([\s\S]*?)<\/body>/,
    `{children}\n          <Analytics />\n          <SpeedInsights />\n      </body>`
  );

  writeFileSync(layoutPath, layout);
  console.log("  added <Analytics /> and <SpeedInsights /> to layout.tsx");
}

// 3. init shadcn
console.log("\n  setting up shadcn/ui...\n");
try {
  run("bunx shadcn@latest init -y -d");
} catch {
  console.log("  shadcn init had issues — you may need to run `bunx shadcn@latest init` manually.");
}

// 4. copy repo-template
console.log("\n  copying agent context template...\n");

// find the template — check if we're running from the foundations repo or from npm
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
  console.log("  could not find repo-template. skipping agent context setup.");
  console.log("  you can copy it manually from https://github.com/tommylower/foundations");
} else {
  cpSync(templateDir, target, { recursive: true, force: false });
  console.log("  .agents/, AGENTS.md, .claude/, .cursor/, .windsurfrules, .github/ copied.");
}

// 5. create .env.example
writeFileSync(
  join(target, ".env.example"),
  `# supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
`
);

// 6. create .env.local from example
writeFileSync(
  join(target, ".env.local"),
  readFileSync(join(target, ".env.example"), "utf-8")
);

// 7. add .env.local to .gitignore if not already there
const gitignorePath = join(target, ".gitignore");
if (existsSync(gitignorePath)) {
  const gitignore = readFileSync(gitignorePath, "utf-8");
  if (!gitignore.includes(".env.local")) {
    writeFileSync(gitignorePath, gitignore + "\n.env.local\n");
  }
}

// 8. link skills library
console.log("\n  linking skills library...\n");

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
  // try cloning
  const defaultSkillsPath = join(homedir(), "Desktop/code/tools/skills");
  try {
    console.log("  cloning tommylower/skills...");
    run(`git clone https://github.com/tommylower/skills.git "${defaultSkillsPath}"`, { stdio: "pipe" });
    skillsDir = defaultSkillsPath;
  } catch {
    console.log("  could not clone skills repo. you can set it up later.");
  }
}

if (skillsDir) {
  // symlink into .claude/skills/ for claude code
  const claudeSkillsDir = join(target, ".claude", "skills");
  mkdirSync(claudeSkillsDir, { recursive: true });

  const designSkills = join(skillsDir, "design");
  if (existsSync(designSkills)) {
    try {
      symlinkSync(designSkills, join(claudeSkillsDir, "design"));
      console.log(`  linked design skills from ${skillsDir}`);
    } catch {
      console.log("  could not symlink design skills.");
    }
  }

  console.log(`  skills directory: ${skillsDir}`);
}

// 9. install rams command
console.log("\n  installing /rams command...\n");

const ramsSource = skillsDir ? join(skillsDir, "design/rams/SKILL.md") : null;
const claudeCommandsDir = join(homedir(), ".claude", "commands");

if (ramsSource && existsSync(ramsSource)) {
  mkdirSync(claudeCommandsDir, { recursive: true });
  const ramsDest = join(claudeCommandsDir, "rams.md");
  if (!existsSync(ramsDest)) {
    cpSync(ramsSource, ramsDest);
    console.log("  /rams command installed globally.");
  } else {
    console.log("  /rams already installed.");
  }
} else {
  console.log("  skills not available — skipping /rams install.");
}

// 10. initial commit
console.log("\n  creating initial commit...\n");

try {
  run("git add -A");
  run('git commit -m "init: scaffold via wip-scaffold"');
} catch {
  console.log("  git commit failed — you may need to commit manually.");
}

console.log(`
  done. your project is ready:

    cd ${name}
    bun dev

  open http://localhost:3000

  vercel analytics and speed insights are installed and will
  report automatically once deployed to vercel.

  to enable vercel agent (AI code review + incident investigation):
  https://vercel.com/docs/agent
`);
