#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const DEFAULT_CONTENT_DIR = 'src/content';
const DEFAULT_SOURCE_HOST = 'cdn.gooo.ai';
const DEFAULT_RETRY = 2;
const DEFAULT_REMOTE = true;
const DEFAULT_SKIP_EXISTING = true;

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
  console.log(`\n用法:\n  node scripts/r2-upload-external-images.mjs --bucket=<bucket> [可选参数]\n\n可选参数:\n  --content-dir=src/content       要扫描的目录（默认: ${DEFAULT_CONTENT_DIR}）\n  --source-host=cdn.gooo.ai       源图片域名（默认: ${DEFAULT_SOURCE_HOST}）\n  --match-host=<host>             从内容里匹配哪个域名（默认: source-host）\n  --fetch-host=<host>             实际下载使用哪个域名（默认: source-host）\n  --dry-run                       只扫描不上传\n  --retry=2                       下载失败重试次数（默认: ${DEFAULT_RETRY}）\n  --remote=true|false             是否上传到远端 R2（默认: ${DEFAULT_REMOTE}）\n  --skip-existing=true|false      对象已存在时是否跳过（默认: ${DEFAULT_SKIP_EXISTING}）\n  --wrangler-bin=npx              wrangler 命令入口（默认: npx）\n  --help                          查看帮助\n\n示例:\n  node scripts/r2-upload-external-images.mjs --bucket=zenblog-images --dry-run\n  node scripts/r2-upload-external-images.mjs --bucket=zenblog-images --source-host=cdn.gooo.ai\n  node scripts/r2-upload-external-images.mjs --bucket=zenblog-images --match-host=cdn.ninthbit.org --fetch-host=cdn.gooo.ai\n`);
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

function extractUrls(content, matchHost) {
  const urls = [];
  const pattern = /!\[[^\]]*\]\((https?:\/\/[^)\s"']+)(?:\s+"[^"]*")?\)/g;

  let match = pattern.exec(content);
  while (match) {
    try {
      const url = new URL(match[1]);
      if (url.host === matchHost) {
        urls.push(url.toString());
      }
    } catch {
      // 忽略非法 URL
    }

    match = pattern.exec(content);
  }

  return urls;
}

function keyFromUrl(urlString) {
  const url = new URL(urlString);
  const key = decodeURIComponent(url.pathname.replace(/^\/+/, ''));

  if (!key || key.includes('..')) {
    throw new Error(`非法对象 key: ${urlString}`);
  }

  return key;
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio ?? 'inherit',
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`命令执行失败: ${command} ${args.join(' ')}`));
      }
    });
  });
}

function runCommandCapture(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

function buildWranglerCommand(wranglerBin, args) {
  if (wranglerBin === 'npx') {
    return {
      command: 'npx',
      args: ['wrangler', ...args],
    };
  }

  return {
    command: wranglerBin,
    args,
  };
}

async function objectExistsInBucket(bucket, key, options) {
  const checkFile = path.join(options.tempDir, `exists-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const cmdArgs = ['r2', 'object', 'get', `${bucket}/${key}`, `--file=${checkFile}`];
  if (options.remote) cmdArgs.push('--remote');

  const wrapped = buildWranglerCommand(options.wranglerBin, cmdArgs);

  try {
    const result = await runCommandCapture(wrapped.command, wrapped.args);
    if (result.code === 0) {
      return true;
    }

    const output = `${result.stdout}\n${result.stderr}`.toLowerCase();
    if (output.includes('not found') || output.includes('no such object') || output.includes('404')) {
      return false;
    }

    throw new Error(`检测对象是否存在失败: ${wrapped.command} ${wrapped.args.join(' ')}\n${result.stderr || result.stdout}`);
  } finally {
    await fs.rm(checkFile, { force: true });
  }
}

async function fetchWithRetry(url, retries) {
  let lastError;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error;
      if (attempt <= retries) {
        console.warn(`  下载失败（第 ${attempt} 次），准备重试: ${url}`);
      }
    }
  }

  throw lastError;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help === 'true') {
    printHelp();
    return;
  }

  const bucket = args.bucket;
  if (!bucket) {
    console.error('缺少参数: --bucket=<bucket>');
    printHelp();
    process.exit(1);
  }

  const contentDir = path.resolve(args['content-dir'] ?? DEFAULT_CONTENT_DIR);
  const sourceHost = args['source-host'] ?? DEFAULT_SOURCE_HOST;
  const matchHost = args['match-host'] ?? sourceHost;
  const fetchHost = args['fetch-host'] ?? sourceHost;
  const dryRun = args['dry-run'] === 'true';
  const retry = Number.parseInt(args.retry ?? `${DEFAULT_RETRY}`, 10);
  const remote = (args.remote ?? `${DEFAULT_REMOTE}`) !== 'false';
  const skipExisting = (args['skip-existing'] ?? `${DEFAULT_SKIP_EXISTING}`) !== 'false';
  const wranglerBin = args['wrangler-bin'] ?? 'npx';

  const markdownFiles = await walkMarkdownFiles(contentDir);
  const fileUrlMap = new Map();

  for (const filePath of markdownFiles) {
    const raw = await fs.readFile(filePath, 'utf8');
    const urls = extractUrls(raw, matchHost);

    if (urls.length > 0) {
      fileUrlMap.set(filePath, urls);
    }
  }

  const allUrls = [...fileUrlMap.values()].flat();
  const uniqueUrls = [...new Set(allUrls)].sort();

  console.log(`扫描目录: ${contentDir}`);
  console.log(`匹配域名: ${matchHost}`);
  console.log(`下载域名: ${fetchHost}`);
  console.log(`跳过已存在: ${skipExisting}`);
  console.log(`命中文件: ${fileUrlMap.size}`);
  console.log(`命中图片链接: ${allUrls.length}`);
  console.log(`去重后链接: ${uniqueUrls.length}`);

  if (uniqueUrls.length === 0) {
    console.log('未找到需要迁移的图片。');
    return;
  }

  if (dryRun) {
    console.log('\nDry run 模式，不执行上传。');
    uniqueUrls.forEach((url, index) => {
      const key = keyFromUrl(url);
      console.log(`${index + 1}. ${url} -> ${key}`);
    });
    return;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'zenblog-r2-upload-'));
  const failures = [];
  let uploadedCount = 0;
  let skippedCount = 0;

  console.log(`\n开始上传到 R2 bucket: ${bucket}`);
  console.log(`临时目录: ${tempDir}`);

  try {
    for (let index = 0; index < uniqueUrls.length; index += 1) {
      const url = uniqueUrls[index];
      const key = keyFromUrl(url);
      const tempFile = path.join(tempDir, `${index}`);

      process.stdout.write(`[${index + 1}/${uniqueUrls.length}] ${key}\n`);

      try {
        if (skipExisting) {
          const exists = await objectExistsInBucket(bucket, key, { remote, wranglerBin, tempDir });
          if (exists) {
            skippedCount += 1;
            console.log('  已存在，跳过上传');
            continue;
          }
        }

        const sourceUrl = new URL(url);
        sourceUrl.host = fetchHost;
        const data = await fetchWithRetry(sourceUrl.toString(), retry);
        await fs.writeFile(tempFile, data);

        const cmdArgs = ['r2', 'object', 'put', `${bucket}/${key}`, `--file=${tempFile}`];
        if (remote) cmdArgs.push('--remote');
        const wrapped = buildWranglerCommand(wranglerBin, cmdArgs);
        await runCommand(wrapped.command, wrapped.args);
        uploadedCount += 1;
      } catch (error) {
        failures.push({ url, key, error: error instanceof Error ? error.message : String(error) });
        console.error(`  失败: ${url}`);
      }
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  if (failures.length > 0) {
    console.error(`\n完成，但有 ${failures.length} 个失败:`);
    failures.forEach((item, idx) => {
      console.error(`${idx + 1}. ${item.url}`);
      console.error(`   key: ${item.key}`);
      console.error(`   error: ${item.error}`);
    });
    process.exit(1);
  }

  console.log(`\n全部上传完成。上传 ${uploadedCount}，跳过 ${skippedCount}。`);
}

main().catch((error) => {
  console.error('执行失败:', error);
  process.exit(1);
});
