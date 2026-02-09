#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_CONTENT_DIR = 'src/content';
const DEFAULT_FROM_HOST = 'cdn.gooo.ai';

function parseArgs(argv) {
  const args = {};

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;

    const [rawKey, rawValue] = arg.slice(2).split('=');
    if (!rawKey) continue;

    const key = rawKey.trim();
    const value = rawValue === undefined ? 'true' : rawValue.trim();
    args[key] = value;
  }

  return args;
}

function printHelp() {
  console.log(`\n用法:\n  node scripts/replace-image-host.mjs --to-host=<host> [可选参数]\n\n可选参数:\n  --content-dir=src/content   要扫描的目录（默认: ${DEFAULT_CONTENT_DIR}）\n  --from-host=cdn.gooo.ai     旧域名（默认: ${DEFAULT_FROM_HOST}）\n  --to-host=img.example.com   新域名（必填）\n  --apply                     写入文件；默认只预览\n  --help                      查看帮助\n\n示例:\n  node scripts/replace-image-host.mjs --to-host=img.ninthbit.org\n  node scripts/replace-image-host.mjs --to-host=img.ninthbit.org --apply\n`);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function walkMarkdownFiles(dir) {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...await walkMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      result.push(fullPath);
    }
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help === 'true') {
    printHelp();
    return;
  }

  const toHost = args['to-host'];
  if (!toHost) {
    console.error('缺少参数: --to-host=<host>');
    printHelp();
    process.exit(1);
  }

  const contentDir = path.resolve(args['content-dir'] ?? DEFAULT_CONTENT_DIR);
  const fromHost = args['from-host'] ?? DEFAULT_FROM_HOST;
  const apply = args.apply === 'true';

  const pattern = new RegExp(`https?:\\/\\/${escapeRegExp(fromHost)}\\/`, 'g');
  const replacement = `https://${toHost}/`;

  const files = await walkMarkdownFiles(contentDir);
  const changed = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const matches = raw.match(pattern);

    if (!matches || matches.length === 0) {
      continue;
    }

    const next = raw.replace(pattern, replacement);

    if (apply) {
      await fs.writeFile(filePath, next, 'utf8');
    }

    changed.push({ filePath, count: matches.length });
  }

  if (changed.length === 0) {
    console.log('没有发现需要替换的链接。');
    return;
  }

  const total = changed.reduce((sum, item) => sum + item.count, 0);
  console.log(`${apply ? '已写入' : '预览'} ${changed.length} 个文件，替换 ${total} 处链接。`);

  changed.forEach((item, index) => {
    console.log(`${index + 1}. ${item.filePath} (${item.count} 处)`);
  });

  if (!apply) {
    console.log('\n当前为预览模式，添加 --apply 才会写入文件。');
  }
}

main().catch((error) => {
  console.error('执行失败:', error);
  process.exit(1);
});
