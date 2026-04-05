#!/usr/bin/env node

import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync, symlinkSync, writeFileSync, readFileSync, lstatSync, unlinkSync, readdirSync } from "fs";
import { resolve, join } from "path";
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

const isSkillsAuthor = (dir) => {
  try {
    const remote = quiet(`git -C "${dir}" remote get-url origin`);
    return remote.includes("tommylower/skills");
  } catch {
    return false;
  }
};

const args = process.argv.slice(2);
const upgradeMode = args.includes("--upgrade");
const infoMode = args.includes("--info");
let name = args.find((a) => !a.startsWith("--"));
let projectDesc = "";

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

  ${blue("skills")} ${dim("(linked at .claude/skills/wip/)")}

  ${dim("wip/design/")}
  ${dim("  ui-principles")}       spacing, type, layout, component standards, slop detection
  ${dim("  gradients")}           oklab/oklch, layering, blend modes, animation recipes
  ${dim("  responsive-design")}   fluid scales, container queries, AI pitfalls, testing
  ${dim("  framer-motion")}       scroll reveals, stagger, hover, accordion patterns
  ${dim("  css-interaction-tips")}button feel, entrance, jitter fix, touch targets
  ${dim("  rams")}                WCAG accessibility + visual consistency audit
  ${dim("  reference-patterns")}  Linear, Vercel, Lovable — real production patterns
  ${dim("  figma-mcp")}           read tokens + layouts from Figma files
  ${dim("  wiretext")}            ASCII wireframes for early layout planning

  ${dim("wip/dev-tools/")}
  ${dim("  agentation")}          design annotation toolbar + MCP agent sync
  ${dim("  dialkit")}             dev-only sliders/spring editors for tuning values

  ${dim("wip/workflows/")}
  ${dim("  claude-workflow")}     plan mode, subagents, verification, context management
  ${dim("  agent-swarm")}         parallel agents, review loops, adversarial dual-review
  ${dim("  codex-review")}        cross-model review via Codex plugin
  ${dim("  agent-interviewer")}   generate personalized agent behavior profile
  ${dim("  conventions")}         code style, naming, file structure, git conventions
  ${dim("  stack")}               default tech choices (next, tailwind, supabase, bun)
  ${dim("  dev-setup")}           dev setup, deployment, env var management

  ${blue("agent context")}
  ${dim(".agents/")}              project, architecture, design, tasks, tools, skills
  ${dim("AGENTS.md")}             single source of truth for all AI tools
  ${dim("tool configs")}          claude, cursor, windsurf, copilot, codex

  ${blue("commands")}
  ${dim("npx wip-scaffold")}             create a new project
  ${dim("npx wip-scaffold --upgrade")}   pull latest skills + update scaffold files
  ${dim("npx wip-scaffold --info")}      this screen
  ${dim("/rams")}                        run accessibility + design review
  ${dim("/interview")}                   generate personalized agent behavior profile

  ${blue("links")}
  ${dim("github.com/tommylower/wip-scaffold")}   scaffold + docs
  ${dim("github.com/tommylower/skills")}       design, dev-tools, workflow skills
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

  projectDesc = await prompt("  what's this project? ");
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
  const templateDir = join(import.meta.dirname, "..", "repo-template");

  if (!existsSync(templateDir)) {
    console.error("  could not find repo-template.");
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

  // ── pull latest skills from GitHub ──

  const skillsPaths = [
    join(target, "skills"),
    join(homedir(), ".skills"),
  ];

  let skillsDir;
  for (const p of skillsPaths) {
    if (existsSync(p)) {
      skillsDir = p;
      break;
    }
  }

  // if skills dir is missing or not a valid git repo, re-clone
  if (!skillsDir) {
    const defaultSkillsPath = join(homedir(), ".skills");
    console.log("  skills directory not found. cloning from GitHub...");
    try {
      run(`git clone https://github.com/tommylower/skills.git "${defaultSkillsPath}"`, { stdio: "pipe" });
      skillsDir = defaultSkillsPath;
      console.log("  cloned skills repo.");
    } catch {
      console.log("  could not clone skills repo (offline?). skipping skills.");
    }
  } else if (!existsSync(join(skillsDir, ".git"))) {
    console.log(`  warning: ${skillsDir} exists but is not a git repo. removing and re-cloning...`);
    try {
      run(`rm -rf "${skillsDir}"`, { stdio: "pipe" });
      run(`git clone https://github.com/tommylower/skills.git "${skillsDir}"`, { stdio: "pipe" });
      console.log("  re-cloned skills repo.");
    } catch {
      console.log("  could not re-clone skills repo. skipping skills.");
      skillsDir = null;
    }
  } else {
    // valid git repo — check for corruption and pull
    try {
      quiet(`git -C "${skillsDir}" fsck --no-dangling`);
    } catch {
      console.log(`  warning: skills repo is corrupted. re-cloning...`);
      try {
        run(`rm -rf "${skillsDir}"`, { stdio: "pipe" });
        run(`git clone https://github.com/tommylower/skills.git "${skillsDir}"`, { stdio: "pipe" });
        console.log("  re-cloned skills repo.");
      } catch {
        console.log("  could not re-clone skills repo. skipping skills.");
        skillsDir = null;
      }
    }

    if (skillsDir) {
      try {
        const before = quiet(`git -C "${skillsDir}" rev-parse HEAD`);
        run(`git -C "${skillsDir}" pull --ff-only`, { stdio: "pipe" });
        const after = quiet(`git -C "${skillsDir}" rev-parse HEAD`);
        if (before !== after) {
          const count = quiet(`git -C "${skillsDir}" log --oneline ${before}..${after} | wc -l`).trim();
          console.log(`  pulled ${count} new commit(s) to skills`);
        } else {
          console.log("  skills already up to date");
        }
      } catch {
        console.log("  could not pull skills (offline or merge needed). using local copy.");
      }
    }
  }

  // verify expected skill directories exist
  if (skillsDir) {
    const expected = ["design", "dev-tools", "workflows"];
    const missing = expected.filter((d) => !existsSync(join(skillsDir, d)));
    if (missing.length > 0) {
      console.log(`  warning: missing skill directories in ~/.skills/: ${missing.join(", ")}`);
      console.log("  try deleting ~/.skills and running --upgrade again to re-clone.");
    }

    const isAuthor = isSkillsAuthor(skillsDir);

    // add README to skills directory if missing (only for non-authors)
    if (!isAuthor) {
      const wipReadmePath = join(skillsDir, "WIP-README.md");
      if (!existsSync(wipReadmePath)) {
        writeFileSync(wipReadmePath, `# wip skills

these skills were added by [wip-scaffold](https://github.com/tommylower/wip-scaffold).
they're symlinked into your project at \`.claude/skills/wip/\`.

## what's here

- **design/** — ui principles, framer motion, gradients, responsive design, accessibility (rams), reference patterns
- **dev-tools/** — agentation, dialkit
- **workflows/** — claude workflow, agent swarm, codex review, agent interviewer, conventions

## not mine?

skills with attribution are noted in their SKILL.md files.
dialkit is by [josh puckett](https://github.com/joshpuckett/dialkit).
agentation is by [tommy lower](https://agentation.dev).

## don't want these?

delete this folder or move individual skills elsewhere.
any skill folder with a SKILL.md inside will work wherever you put it
under \`~/.skills/\` — the structure is flexible.

to stop wip-scaffold from managing this directory, just remove \`~/.skills/\`
and the CLI will skip the skills step.
`);
        console.log("  added WIP-README.md to skills directory");
      }
    }
  }

  if (skillsDir) {
    const claudeSkillsDir = join(target, ".claude", "skills");
    mkdirSync(claudeSkillsDir, { recursive: true });
    const isAuthor = isSkillsAuthor(skillsDir);

    // clean up all existing skill symlinks before relinking
    for (const entry of readdirSync(claudeSkillsDir, { withFileTypes: true })) {
      const linkPath = join(claudeSkillsDir, entry.name);
      try {
        const stat = lstatSync(linkPath);
        if (stat.isSymbolicLink()) {
          unlinkSync(linkPath);
        }
      } catch {
        // skip
      }
    }

    if (isAuthor) {
      // author: link each directory flat (no namespace)
      for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
        try {
          symlinkSync(join(skillsDir, entry.name), join(claudeSkillsDir, entry.name));
          console.log(`  linked ${entry.name} skills`);
        } catch {
          console.log(`  ${entry.name} symlink already exists.`);
        }
      }
    } else {
      // everyone else: link as .claude/skills/wip
      try {
        symlinkSync(skillsDir, join(claudeSkillsDir, "wip"));
        console.log("  linked skills → .claude/skills/wip");
      } catch {
        console.log("  could not create wip symlink");
      }
    }

    console.log(`  skills directory: ${skillsDir}`);
  }

  // ── migrate dev tools in layout.tsx ──

  const layoutPath = join(target, "src/app/layout.tsx");
  if (existsSync(layoutPath)) {
    let layout = readFileSync(layoutPath, "utf-8");
    let layoutChanged = false;

    // remove interface-kit if present (no longer bundled)
    if (layout.includes("interface-kit")) {
      layout = layout.replace(/import\s*\{[^}]*\}\s*from\s*["']interface-kit[^"']*["'];\s*\n?/g, "");
      layout = layout.replace(/\s*\{process\.env\.NODE_ENV === "development" && <InterfaceKit\s*\/>\}\s*\n?/g, "\n");
      layoutChanged = true;
      console.log("  removed interface-kit from layout (no longer bundled)");
    }

    // add dialkit if not present
    if (!layout.includes("dialkit")) {
      // add import after agentation import if it exists, otherwise after last import
      if (layout.includes("agentation")) {
        layout = layout.replace(
          /import\s*\{\s*Agentation\s*\}\s*from\s*["']agentation["'];?\s*\n/,
          (match) => match + `import { DialKit } from "dialkit";\n`
        );
      } else {
        const lastImportIdx = layout.lastIndexOf("import ");
        const lastImportEnd = layout.indexOf("\n", layout.indexOf(";", lastImportIdx));
        layout = layout.slice(0, lastImportEnd + 1) + `import { DialKit } from "dialkit";\n` + layout.slice(lastImportEnd + 1);
      }

      // add component before </body>
      if (layout.includes("Agentation")) {
        layout = layout.replace(
          /(\{process\.env\.NODE_ENV === "development" && <Agentation\s*\/>\})\s*\n/,
          (match) => match + `          {process.env.NODE_ENV === "development" && <DialKit />}\n`
        );
      } else {
        layout = layout.replace(
          /<\/body>/,
          `    {process.env.NODE_ENV === "development" && <DialKit />}\n      </body>`
        );
      }

      layoutChanged = true;
      console.log("  added dialkit to layout");
    }

    // add agentation if not present
    if (!layout.includes("agentation")) {
      const lastImportIdx = layout.lastIndexOf("import ");
      const lastImportEnd = layout.indexOf("\n", layout.indexOf(";", lastImportIdx));
      layout = layout.slice(0, lastImportEnd + 1) + `import { Agentation } from "agentation";\n` + layout.slice(lastImportEnd + 1);

      layout = layout.replace(
        /<\/body>/,
        `    {process.env.NODE_ENV === "development" && <Agentation />}\n      </body>`
      );

      layoutChanged = true;
      console.log("  added agentation to layout");
    }

    if (layoutChanged) {
      writeFileSync(layoutPath, layout);
    }
  }

  // ── update dependencies ──

  const pkgPath = join(target, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const deps = pkg.dependencies || {};
    const devDeps = pkg.devDependencies || {};
    const allDeps = { ...deps, ...devDeps };

    const toAdd = [];
    const toRemove = [];

    if (!allDeps["agentation"]) toAdd.push("agentation");
    if (!allDeps["dialkit"]) toAdd.push("dialkit");
    if (allDeps["interface-kit"]) toRemove.push("interface-kit");

    if (toRemove.length > 0) {
      try {
        run(`bun remove ${toRemove.join(" ")}`, { stdio: "pipe" });
        console.log(`  removed ${toRemove.join(", ")}`);
      } catch {
        console.log(`  could not remove ${toRemove.join(", ")} — remove manually`);
      }
    }

    if (toAdd.length > 0) {
      try {
        run(`bun add ${toAdd.join(" ")}`, { stdio: "pipe" });
        console.log(`  added ${toAdd.join(", ")}`);
      } catch {
        console.log(`  could not add ${toAdd.join(", ")} — install manually`);
      }
    }

    // update existing dev tools to latest versions
    const toUpdate = ["agentation", "dialkit"].filter((p) => allDeps[p]);
    if (toUpdate.length > 0) {
      try {
        run(`bun update ${toUpdate.join(" ")}`, { stdio: "pipe" });
        console.log(`  updated ${toUpdate.join(", ")} to latest`);
      } catch {
        console.log(`  could not update ${toUpdate.join(", ")} — run bun update manually`);
      }
    }
  }

  // ── update landing page ──

  const pagePath = join(target, "src/app/page.tsx");
  const landingTemplate = join(import.meta.dirname, "landing-page.tsx");
  if (existsSync(pagePath) && existsSync(landingTemplate)) {
    const currentPage = readFileSync(pagePath, "utf-8");
    // only replace if it's still the scaffold landing page
    if (currentPage.includes("scaffolded with wip-scaffold") || currentPage.includes("wave created")) {
      cpSync(landingTemplate, pagePath);
      // preserve project description if it was set
      const projectMdPath = join(target, ".agents/project.md");
      if (existsSync(projectMdPath)) {
        const projectMd = readFileSync(projectMdPath, "utf-8");
        const descMatch = projectMd.match(/^>\s*(.+)$/m);
        if (descMatch && descMatch[1] && !descMatch[1].includes("describe this project")) {
          let page = readFileSync(pagePath, "utf-8");
          page = page.replace("{{PROJECT_DESCRIPTION}}", descMatch[1]);
          writeFileSync(pagePath, page);
        }
      }
      console.log("  updated landing page");
    } else {
      console.log("  landing page has been customized — skipping");
    }
  }

  // ── re-install commands (/rams + /interview) ──

  const claudeCommandsDir = join(homedir(), ".claude", "commands");
  mkdirSync(claudeCommandsDir, { recursive: true });

  const ramsSource = skillsDir ? join(skillsDir, "design/rams/SKILL.md") : null;
  if (ramsSource && existsSync(ramsSource)) {
    const ramsDest = join(claudeCommandsDir, "rams.md");
    cpSync(ramsSource, ramsDest, { force: true });
    console.log("  updated /rams command.");
  }

  const interviewSource = skillsDir ? join(skillsDir, "workflows/agent-interviewer/SKILL.md") : null;
  if (interviewSource && existsSync(interviewSource)) {
    const interviewDest = join(claudeCommandsDir, "interview.md");
    cpSync(interviewSource, interviewDest, { force: true });
    console.log("  updated /interview command.");
  }

  console.log(`
  done. upgraded scaffold files only — source code and design files untouched.

  what was updated:
    - skills (pulled latest from GitHub, linked at .claude/skills/wip/)
    - AGENTS.md, tool configs (.claude, .cursor, .windsurfrules, .github)
    - .gitattributes
    - dev tools in layout (agentation + dialkit, removed interface-kit if present)
    - dependencies (added/removed as needed, existing tools updated to latest)
    - landing page (if still the scaffold default)
    - /rams command
    - /interview command

  what was NOT touched:
    - .agents/*.md (your project context)
    - src/ (your code, except layout dev tool lines + scaffold landing page)
    - design/ (your design files)
    - .env

  check what's new: ${dim("https://github.com/tommylower/skills")}
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

step("dev tools", "agentation (annotations) + dialkit (live tuning), dev-only");
run("bun add agentation dialkit");

// add Agentation + DialKit to layout (dev only)
if (existsSync(layoutPath)) {
  let layout = readFileSync(layoutPath, "utf-8");

  if (!layout.includes("agentation")) {
    const lastImportIdx = layout.lastIndexOf("import ");
    const lastImportEnd = layout.indexOf("\n", layout.indexOf(";", lastImportIdx));
    layout = layout.slice(0, lastImportEnd + 1) + `import { Agentation } from "agentation";\nimport { DialKit } from "dialkit";\n` + layout.slice(lastImportEnd + 1);

    // add Agentation + DialKit after Analytics/SpeedInsights, before </body>
    layout = layout.replace(
      /<\/body>/,
      `    {process.env.NODE_ENV === "development" && <Agentation />}\n          {process.env.NODE_ENV === "development" && <DialKit />}\n      </body>`
    );

    writeFileSync(layoutPath, layout);
  }
}

step("shadcn/ui", "accessible component primitives you own");
try {
  run("bunx shadcn@latest init -y -d");
} catch {
  console.log("  shadcn init had issues — run `bunx shadcn@latest init` manually.");
}

step("agent context", ".agents/, AGENTS.md, tool configs for every AI editor");

const templateDir = join(import.meta.dirname, "..", "repo-template");

if (!existsSync(templateDir)) {
  console.log("  could not find repo-template. skipping.");
} else {
  cpSync(templateDir, target, { recursive: true, force: true });
}

// inject project description into templates
const projectMdPath = join(target, ".agents/project.md");
if (existsSync(projectMdPath)) {
  let content = readFileSync(projectMdPath, "utf-8");
  if (projectDesc) {
    content = content.replace("{{PROJECT_DESCRIPTION}}", projectDesc);
  } else {
    content = content.replace("> {{PROJECT_DESCRIPTION}}", "<!-- describe this project here -->");
  }
  writeFileSync(projectMdPath, content);
}

const readmePath = join(target, "README.md");
if (existsSync(readmePath)) {
  let readme = readFileSync(readmePath, "utf-8");
  readme = readme.replace("[project name]", name);
  if (projectDesc) {
    readme = readme.replace("> one-line description of what this is and who it's for.", `> ${projectDesc}`);
  }
  writeFileSync(readmePath, readme);
}

// remove root CLAUDE.md created by create-next-app (ours lives in .claude/CLAUDE.md)
const rootClaudeMd = join(target, "CLAUDE.md");
if (existsSync(rootClaudeMd)) {
  unlinkSync(rootClaudeMd);
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
];

let skillsDir;
for (const p of skillsPaths) {
  if (existsSync(p)) {
    skillsDir = p;
    break;
  }
}

if (!skillsDir) {
  const defaultSkillsPath = join(homedir(), ".skills");
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

  if (isSkillsAuthor(skillsDir)) {
    // author: link each directory flat (no namespace)
    for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      try {
        symlinkSync(join(skillsDir, entry.name), join(claudeSkillsDir, entry.name));
      } catch {}
    }
  } else {
    // everyone else: link as .claude/skills/wip
    const wipLink = join(claudeSkillsDir, "wip");
    try {
      symlinkSync(skillsDir, wipLink);
    } catch {}
  }
}

step("commands", "/rams (accessibility review) + /interview (agent behavior profile)");

const claudeCommandsDir = join(homedir(), ".claude", "commands");
mkdirSync(claudeCommandsDir, { recursive: true });

const ramsSource = skillsDir ? join(skillsDir, "design/rams/SKILL.md") : null;
if (ramsSource && existsSync(ramsSource)) {
  const ramsDest = join(claudeCommandsDir, "rams.md");
  if (!existsSync(ramsDest)) {
    cpSync(ramsSource, ramsDest);
  }
}

const interviewSource = skillsDir ? join(skillsDir, "workflows/agent-interviewer/SKILL.md") : null;
if (interviewSource && existsSync(interviewSource)) {
  const interviewDest = join(claudeCommandsDir, "interview.md");
  cpSync(interviewSource, interviewDest, { force: true });
}

step("metadata", "project name in layout");

if (existsSync(layoutPath)) {
  let layout = readFileSync(layoutPath, "utf-8");
  layout = layout.replace('title: "Create Next App"', `title: "${name}"`);
  layout = layout.replace('description: "Generated by create next app"', `description: "scaffolded with wip-scaffold"`);
  writeFileSync(layoutPath, layout);
}

step("landing page", "WIP welcome page at localhost:3000");

// replace next.js default page with WIP landing
const pagePath = join(target, "src/app/page.tsx");
const landingTemplate = join(import.meta.dirname, "landing-page.tsx");
if (existsSync(landingTemplate)) {
  cpSync(landingTemplate, pagePath);
  // inject project description into landing page
  if (existsSync(pagePath)) {
    let page = readFileSync(pagePath, "utf-8");
    page = page.replace("{{PROJECT_DESCRIPTION}}", projectDesc || "");
    writeFileSync(pagePath, page);
  }
} else {
  console.log("  landing page template not found — skipping.");
}

// shadcn init writes globals.css with theme variables — leave it alone

step("commit", "initial git commit");

try {
  run("git add -A");
  run('git commit -m "init: scaffold via wip-scaffold"');
} catch {
  console.log("  git commit failed — commit manually.");
}

// ── agent interviewer prompt ──

const runInterview = await prompt(`\n  ${blue("personalize agent behavior?")} run a short interview to generate your\n  behavior profile (CLAUDE.md / AGENTS.md). takes ~2 minutes. ${dim("(y/N)")} `);

if (runInterview.toLowerCase() === "y" || runInterview.toLowerCase() === "yes") {
  console.log(`
  ${blue("→")} to generate your behavior profile, run this in your coding agent:

    cd ${name}
    /interview

  the interviewer will ask a few rounds of questions and produce a
  markdown behavior file you can save as AGENTS.md or CLAUDE.md.

  ask for "strict mode" or "V2" to get a tighter version.
`);
} else {
  console.log(`
  ${dim("skipped.")} you can run ${blue("/interview")} anytime in your coding agent to generate
  a personalized agent behavior profile.
`);
}

console.log(`  ${blue("done.")} your project is ready:

    cd ${name}
    bun dev

  open ${dim("http://localhost:3000")}
`);
