#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function toKebabCase(str) {
    return str
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function createProject(title) {
    if (!title) {
        console.error("Usage: npm run new:project \"Project Name\"");
        process.exit(1);
    }

    const slug = toKebabCase(title) || "new-project";
    const contentDir = join(__dirname, "..", "src", "content", "projects");

    if (!existsSync(contentDir)) {
        mkdirSync(contentDir, { recursive: true });
    }

    const filename = join(contentDir, `${slug}.md`);
    if (existsSync(filename)) {
        console.error(`File already exists: ${filename}`);
        process.exit(1);
    }

    const frontmatter = [
        "---",
        `title: "${title.replace(/"/g, '\\"')}"`,
        `description: "Project description..."`,
        `order: 1`,
        `stack: ["React", "TypeScript"]`,
        `# heroImage: "../../assets/project-placeholder.jpg"`,
        `# github: "https://github.com/..."`,
        `# demo: "https://..."`,
        "---",
        "",
        "Write your project details here...",
        "",
    ].join("\n");

    writeFileSync(filename, frontmatter, "utf8");
    console.log(`Created new project: ${filename}`);
}

const [, , ...args] = process.argv;
const title = args.join(" ").trim();
createProject(title);
