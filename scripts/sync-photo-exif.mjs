#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'photography');

function isMarkdownFile(filePath) {
  return filePath.endsWith('.md') || filePath.endsWith('.mdx');
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && isMarkdownFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function hasValue(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return undefined;
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(1)));
}

function formatFocalLength(value) {
  if (typeof value === 'number') {
    const formatted = formatNumber(value);
    return formatted ? `${formatted}mm` : undefined;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.includes('mm') ? value : `${value}mm`;
  }
  return undefined;
}

function formatAperture(value) {
  if (typeof value === 'number') {
    const formatted = formatNumber(value);
    return formatted ? `f/${formatted}` : undefined;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.startsWith('f/') ? value : `f/${value}`;
  }
  return undefined;
}

function formatShutterSpeed(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    if (value >= 1) {
      const formatted = formatNumber(value);
      return formatted ? `${formatted}s` : undefined;
    }
    const denominator = Math.round(1 / value);
    if (denominator <= 0) return undefined;
    return `1/${denominator}s`;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.endsWith('s') ? value : `${value}s`;
  }
  return undefined;
}

function normalizeIso(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
  }
  return undefined;
}

function pickFirst(...values) {
  for (const value of values) {
    if (hasValue(value)) return value;
  }
  return undefined;
}

async function loadExifParser() {
  try {
    const mod = await import('exifr');
    if (typeof mod?.parse === 'function') {
      return mod;
    }
    if (typeof mod?.default?.parse === 'function') {
      return mod.default;
    }
    if (typeof mod?.['module.exports']?.parse === 'function') {
      return mod['module.exports'];
    }
    return null;
  } catch {
    return null;
  }
}

async function extractExifFromImage(exifr, imagePath) {
  const exifData = await exifr.parse(imagePath, {
    exif: true,
    tiff: true,
    gps: false,
    translateValues: false,
  });

  if (!exifData) return {};

  return {
    brand: pickFirst(exifData.Make),
    model: pickFirst(exifData.Model),
    lens: pickFirst(exifData.LensModel, exifData.Lens, exifData.LensInfo),
    focalLength: formatFocalLength(pickFirst(exifData.FocalLength, exifData.FocalLengthIn35mmFormat)),
    aperture: formatAperture(pickFirst(exifData.FNumber, exifData.ApertureValue)),
    shutterSpeed: formatShutterSpeed(pickFirst(exifData.ExposureTime, exifData.ShutterSpeedValue)),
    iso: normalizeIso(pickFirst(exifData.ISO, exifData.PhotographicSensitivity, exifData.ISOSpeedRatings)),
  };
}

async function syncExifForFile(exifr, filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = matter(raw);
  const imageRelPath = parsed.data?.image;

  if (!hasValue(imageRelPath) || typeof imageRelPath !== 'string') {
    return { status: 'skipped', reason: 'missing_image' };
  }

  if (imageRelPath.startsWith('http://') || imageRelPath.startsWith('https://')) {
    return { status: 'skipped', reason: 'remote_image' };
  }

  const imagePath = path.resolve(path.dirname(filePath), imageRelPath);
  try {
    await fs.access(imagePath);
  } catch {
    return { status: 'failed', reason: `image_not_found:${imageRelPath}` };
  }

  let extracted;
  try {
    extracted = await extractExifFromImage(exifr, imagePath);
  } catch (error) {
    return { status: 'failed', reason: `exif_parse_error:${String(error)}` };
  }

  const existingExif = parsed.data.exif && typeof parsed.data.exif === 'object' ? parsed.data.exif : {};
  const nextExif = { ...existingExif };
  let changed = false;

  for (const [key, value] of Object.entries(extracted)) {
    if (!hasValue(value)) continue;
    if (hasValue(nextExif[key])) continue;
    nextExif[key] = value;
    changed = true;
  }

  if (!changed) {
    return { status: 'skipped', reason: 'no_new_exif' };
  }

  const nextData = {
    ...parsed.data,
    exif: nextExif,
  };
  const nextContent = matter.stringify(parsed.content, nextData);
  await fs.writeFile(filePath, nextContent, 'utf8');
  return { status: 'updated' };
}

async function main() {
  const exifr = await loadExifParser();
  if (!exifr) {
    console.error('[sync-photo-exif] missing dependency: exifr');
    console.error('[sync-photo-exif] run: npm install exifr --save');
    process.exit(1);
  }

  try {
    await fs.access(CONTENT_DIR);
  } catch {
    console.log(`[sync-photo-exif] skip: directory not found -> ${CONTENT_DIR}`);
    process.exit(0);
  }

  const files = await walkFiles(CONTENT_DIR);
  if (files.length === 0) {
    console.log('[sync-photo-exif] skip: no markdown files found');
    process.exit(0);
  }

  const summary = {
    total: files.length,
    updated: 0,
    skipped: 0,
    failed: 0,
  };

  for (const file of files) {
    const result = await syncExifForFile(exifr, file);
    if (result.status === 'updated') {
      summary.updated += 1;
      console.log(`[updated] ${path.relative(ROOT, file)}`);
      continue;
    }

    if (result.status === 'skipped') {
      summary.skipped += 1;
      console.log(`[skipped] ${path.relative(ROOT, file)} (${result.reason})`);
      continue;
    }

    summary.failed += 1;
    console.log(`[failed] ${path.relative(ROOT, file)} (${result.reason})`);
  }

  console.log(
    `[sync-photo-exif] total=${summary.total} updated=${summary.updated} skipped=${summary.skipped} failed=${summary.failed}`,
  );
}

main().catch((error) => {
  console.error('[sync-photo-exif] fatal:', error);
  process.exit(1);
});
