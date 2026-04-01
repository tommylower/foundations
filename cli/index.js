#!/usr/bin/env node

import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync, symlinkSync, writeFileSync, readFileSync } from "fs";
import { resolve, join, basename } from "path";
import { homedir } from "os";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const quiet = (cmd, opts = {}) => execSync(cmd, { stdio: "pipe", ...opts }).toString().trim();

const name = process.argv[2];

if (!name) {
  console.error("\n  usage: npx wip-create-designbase <project-name>\n");
  process.exit(1);
}

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
run("bun add framer-motion @supabase/supabase-js");
run("bun add -d prettier");

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
  run('git commit -m "init: scaffold via wip-create-designbase"');
} catch {
  console.log("  git commit failed — you may need to commit manually.");
}

console.log(`
  done. your project is ready:

    cd ${name}
    bun dev

  open http://localhost:3000
`);
