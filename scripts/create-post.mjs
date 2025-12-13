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

function formatDateForFrontmatter(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createPost(title) {
  if (!title) {
    console.error("Usage: npm run new:post \"Post title\"");
    process.exit(1);
  }

  const slug = toKebabCase(title) || "new-post";
  const date = new Date();
  const pubDate = formatDateForFrontmatter(date);

  const contentDir = join(__dirname, "..", "src", "content", "blog");
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
    `description: ""`,
    `pubDate: "${pubDate}"`,
    'heroImage: "../../assets/blog-placeholder-1.jpg"',
    "showOnHome: false",
    "---",
    "",
    "",
  ].join("\n");

  writeFileSync(filename, frontmatter, "utf8");
  console.log(`Created new post: ${filename}`);
}

const [, , ...args] = process.argv;
const title = args.join(" ").trim();
createPost(title);

