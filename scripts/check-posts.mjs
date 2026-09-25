#!/usr/bin/env node
/**
 * Conferência de qualidade dos posts MDX.
 *
 *   node scripts/check-posts.mjs --all
 *   node scripts/check-posts.mjs content/posts/exemplo.mdx
 *   node scripts/check-posts.mjs            # posts alterados neste branch
 *
 * Frontmatter: gray-matter (o mesmo parser de src/lib/posts.ts).
 * Largura da capa: sharp, se o pacote carregar; senão, o cabeçalho do arquivo.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PUBLIC_DIR = path.join(ROOT, "public");
const MIN_COVER_WIDTH = 1200;
/** Depois disso a data de publicação é “futuro distante” (calendário de Brasília). */
const MAX_FUTURE_DAYS = 30;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const URL_RE = /(?:https?:\/\/|\/\/)[^\s<>)"']+/gi;
const MD_IMAGE_RE =
  /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
const HTML_IMAGE_RE = /<img\b([^>]*?)\/?>/gi;

function loadTaxonomy() {
  const categoriesSrc = fs.readFileSync(
    path.join(ROOT, "src", "lib", "categories.ts"),
    "utf8",
  );
  const formatSrc = fs.readFileSync(
    path.join(ROOT, "src", "lib", "post-format.ts"),
    "utf8",
  );

  const categoryBlock = categoriesSrc.match(
    /export const CATEGORY_SLUGS = \[([\s\S]*?)\] as const;/,
  );
  const formatBlock = formatSrc.match(
    /export const POST_FORMATS = \[([\s\S]*?)\] as const;/,
  );
  const categorySlugs = categoryBlock
    ? [...categoryBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
    : [];
  const formats = formatBlock
    ? [...formatBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
    : [];

  const subcategories = new Map();
  for (const match of categoriesSrc.matchAll(
    /subcategory\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g,
  )) {
    const parent = match[1];
    const slug = match[2];
    if (!subcategories.has(parent)) subcategories.set(parent, new Set());
    subcategories.get(parent).add(slug);
  }

  if (categorySlugs.length === 0) {
    throw new Error(
      "Não consegui ler CATEGORY_SLUGS em src/lib/categories.ts.",
    );
  }
  if (subcategories.size === 0) {
    throw new Error(
      "Não consegui ler as subcategorias em src/lib/categories.ts.",
    );
  }
  if (formats.length === 0) {
    throw new Error("Não consegui ler POST_FORMATS em src/lib/post-format.ts.");
  }
  for (const parent of subcategories.keys()) {
    if (!categorySlugs.includes(parent)) {
      throw new Error(
        `subcategory() com editoria desconhecida no código: ${parent}.`,
      );
    }
  }

  return { categorySlugs, subcategories, formats };
}

async function loadSharp() {
  try {
    const mod = await import("sharp");
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

function validCalendarDay(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function saoPauloYmd(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addCalendarDays(ymd, days) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * @returns {{ ymd: string } | { error: string }}
 */
function parsePublicationDate(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return {
      error:
        "data de publicação inválida: o campo date precisa ser texto ISO entre aspas (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss-03:00).",
    };
  }
  const raw = value.trim();
  const dateOnly = raw.match(DATE_ONLY);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    if (!validCalendarDay(year, month, day)) {
      return { error: `data de publicação inválida: "${raw}".` };
    }
    return { ymd: raw };
  }

  const dateTime = raw.match(DATE_TIME);
  if (!dateTime) {
    return {
      error: `data de publicação inválida: "${raw}". Use YYYY-MM-DD ou um timestamp ISO com fuso.`,
    };
  }
  const year = Number(dateTime[1]);
  const month = Number(dateTime[2]);
  const day = Number(dateTime[3]);
  const hour = Number(dateTime[4]);
  const minute = Number(dateTime[5]);
  const second = Number(dateTime[6]);
  if (
    !validCalendarDay(year, month, day) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return { error: `data de publicação inválida: "${raw}".` };
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { error: `data de publicação inválida: "${raw}".` };
  }
  return { ymd: saoPauloYmd(parsed) };
}

function stripHidden(text) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function htmlAttr(source, name) {
  const match = source.match(
    new RegExp(
      `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`,
      "i",
    ),
  );
  if (!match) return undefined;
  return match[1] ?? match[2] ?? match[3] ?? "";
}

function bodyImages(body) {
  const text = stripHidden(body);
  const images = [];
  for (const match of text.matchAll(MD_IMAGE_RE)) {
    images.push({ alt: match[1] ?? "", src: match[2] ?? "" });
  }
  for (const match of text.matchAll(HTML_IMAGE_RE)) {
    const tag = match[1] ?? "";
    const src = htmlAttr(tag, "src");
    if (!src) continue;
    const alt = htmlAttr(tag, "alt");
    images.push({ alt: alt ?? "", src, missingAltAttr: alt === undefined });
  }
  return images;
}

function stringValues(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) {
    for (const item of value) stringValues(item, out);
  } else if (value && typeof value === "object" && !(value instanceof Date)) {
    for (const item of Object.values(value)) stringValues(item, out);
  }
  return out;
}

function apexLinks(text) {
  const found = [];
  for (const match of stripHidden(text).matchAll(URL_RE)) {
    let raw = match[0].replace(/[.,;:!?]+$/g, "");
    if (raw.startsWith("//")) raw = `https:${raw}`;
    let url;
    try {
      url = new URL(raw);
    } catch {
      continue;
    }
    if (url.hostname.toLowerCase() === "thezero.com.br") found.push(raw);
  }
  return [...new Set(found)];
}

function isInside(parent, child) {
  const rel = path.relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

/**
 * @returns {{ kind: "local", abs: string, web: string } | { kind: "remote", web: string } | { kind: "invalid", web: string }}
 */
function resolvePublicAsset(src) {
  const web = src.trim().split("#")[0]?.split("?")[0] ?? "";
  let decoded = web;
  try {
    decoded = decodeURIComponent(web);
  } catch {
    decoded = web;
  }
  if (!decoded || /^(?:https?:)?\/\//i.test(decoded) || /^[a-z]+:/i.test(decoded)) {
    return { kind: "remote", web: src.trim() };
  }
  const rel = decoded.replace(/^\/+/, "");
  if (!rel || rel.split("/").includes("..")) {
    return { kind: "invalid", web: src.trim() };
  }
  const abs = path.resolve(PUBLIC_DIR, rel);
  if (!isInside(PUBLIC_DIR, abs)) return { kind: "invalid", web: src.trim() };
  return { kind: "local", abs, web: `/${rel}` };
}

function validSize(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return undefined;
  if (width < 1 || height < 1 || width > 20000 || height > 20000) return undefined;
  return { width, height };
}

function parseImageHeader(buf) {
  if (buf.length >= 24 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") {
    const size = validSize(buf.readUInt32BE(16), buf.readUInt32BE(20));
    return size ? { ...size, format: "png" } : undefined;
  }

  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X" && buf.length >= 30) {
      const size = validSize(1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3));
      return size ? { ...size, format: "webp" } : undefined;
    }
    if (chunk === "VP8 " && buf.length >= 30) {
      const size = validSize(
        buf.readUInt16LE(26) & 0x3fff,
        buf.readUInt16LE(28) & 0x3fff,
      );
      return size ? { ...size, format: "webp" } : undefined;
    }
    if (chunk === "VP8L" && buf.length >= 25) {
      const bits = buf.readUInt32LE(21);
      const size = validSize((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1);
      return size ? { ...size, format: "webp" } : undefined;
    }
  }

  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === undefined) break;
      if (
        marker === 0xd8 ||
        marker === 0xd9 ||
        marker === 0x01 ||
        (marker >= 0xd0 && marker <= 0xd7)
      ) {
        offset += 2;
        continue;
      }
      if (offset + 3 >= buf.length) break;
      const segment = buf.readUInt16BE(offset + 2);
      if (segment < 2) break;
      if (marker >= 0xc0 && marker <= 0xc3) {
        const size = validSize(buf.readUInt16BE(offset + 7), buf.readUInt16BE(offset + 5));
        return size ? { ...size, format: "jpeg" } : undefined;
      }
      offset += 2 + segment;
    }
  }

  return undefined;
}

function readHeaderDimensions(filePath) {
  const fd = fs.openSync(filePath, "r");
  try {
    const stat = fs.fstatSync(fd);
    const size = Math.min(stat.size, 8 * 1024 * 1024);
    const buf = Buffer.alloc(size);
    fs.readSync(fd, buf, 0, size, 0);
    return parseImageHeader(buf);
  } finally {
    fs.closeSync(fd);
  }
}

async function readDimensions(filePath, sharp) {
  if (sharp) {
    try {
      const meta = await sharp(filePath).rotate().metadata();
      if (meta.width && meta.height && meta.format) {
        return { width: meta.width, height: meta.height, format: meta.format };
      }
    } catch {
      // sharp não leu; tenta o cabeçalho.
    }
  }
  try {
    return readHeaderDimensions(filePath);
  } catch {
    return undefined;
  }
}

function extensionKind(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "jpeg";
  if (ext === ".png") return "png";
  if (ext === ".webp") return "webp";
  return "";
}

function formatMatches(extKind, actual) {
  if (!extKind || !actual) return false;
  if (extKind === "jpeg") return actual === "jpeg" || actual === "jpg";
  return extKind === actual;
}

function requiredFrontmatterIssues(data, taxonomy) {
  const issues = [];
  const missing = [];
  if (typeof data.title !== "string" || data.title.trim() === "") missing.push("title");
  if (typeof data.excerpt !== "string" || data.excerpt.trim() === "") missing.push("excerpt");
  if (data.date == null || data.date === "") missing.push("date");
  else if (typeof data.date === "string" && data.date.trim() === "") missing.push("date");
  if (typeof data.category !== "string" || data.category.trim() === "") missing.push("category");
  if (missing.length > 0) {
    issues.push(
      `frontmatter sem campo obrigatório: ${missing.join(", ")}. O site exige title, excerpt, date e category.`,
    );
  }

  if (typeof data.category === "string" && data.category.trim() !== "") {
    const category = data.category.trim();
    if (!taxonomy.categorySlugs.includes(category)) {
      issues.push(
        `category "${category}" inválida. Use: ${taxonomy.categorySlugs.join(", ")}.`,
      );
    } else if (typeof data.subcategory === "string" && data.subcategory.trim() !== "") {
      const subcategory = data.subcategory.trim();
      const allowed = taxonomy.subcategories.get(category);
      if (!allowed?.has(subcategory)) {
        const list = allowed ? [...allowed].join(", ") : "(nenhuma)";
        issues.push(
          `subcategory "${subcategory}" não pertence a "${category}". Use: ${list}.`,
        );
      }
    }
  }

  if (data.format != null && data.format !== "") {
    if (typeof data.format !== "string" || !taxonomy.formats.includes(data.format)) {
      issues.push(
        `format "${String(data.format)}" inválido. Use: ${taxonomy.formats.join(", ")} (ou omita para noticia).`,
      );
    }
  }

  return issues;
}

async function checkPost(filePath, ctx) {
  const rel = path.relative(ROOT, filePath);
  const slug = path.basename(filePath).replace(/\.mdx?$/, "");
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return [`${rel}: arquivo não encontrado.`];
  }

  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [`${rel}: frontmatter inválido (${message}).`];
  }

  const data = parsed.data ?? {};
  const issues = [];

  if (typeof data.title === "string" && data.title.trim().endsWith(".")) {
    issues.push(`title termina com ponto final: ${JSON.stringify(data.title.trim())}.`);
  }

  const coverAlt = typeof data.coverAlt === "string" ? data.coverAlt.trim() : "";
  if (!coverAlt) issues.push("falta coverAlt ou está vazio.");

  const images = bodyImages(parsed.content ?? "");
  for (const image of images) {
    const alt = (image.alt ?? "").trim();
    if (!alt || image.missingAltAttr) {
      issues.push(`imagem no corpo sem alt: ${image.src || "(sem src)"}.`);
    }
  }

  const cover = typeof data.cover === "string" ? data.cover.trim() : "";
  if (cover) {
    const asset = resolvePublicAsset(cover);
    if (asset.kind !== "local") {
      issues.push(`capa ${JSON.stringify(cover)} não existe em public/.`);
    } else if (!fs.existsSync(asset.abs) || !fs.statSync(asset.abs).isFile()) {
      issues.push(`capa ${JSON.stringify(asset.web)} não existe em public/.`);
    } else {
      const extKind = extensionKind(asset.abs);
      const dims = await readDimensions(asset.abs, ctx.sharp);
      if (!extKind) {
        issues.push(`capa ${JSON.stringify(asset.web)} não é jpg, png ou webp.`);
      } else if (!dims?.width || !dims.format) {
        issues.push(
          `capa ${JSON.stringify(asset.web)}: não foi possível ler a largura (mínimo ${MIN_COVER_WIDTH}px).`,
        );
      } else if (!formatMatches(extKind, dims.format)) {
        issues.push(`capa ${JSON.stringify(asset.web)} não é jpg, png ou webp.`);
      } else if (dims.width < MIN_COVER_WIDTH) {
        issues.push(
          `capa ${JSON.stringify(asset.web)} tem ${dims.width}px de largura (mínimo ${MIN_COVER_WIDTH}px).`,
        );
      }
    }
  }

  const seenMissing = new Set();
  for (const image of images) {
    if (!image.src) continue;
    const asset = resolvePublicAsset(image.src);
    const key = asset.kind === "local" ? asset.web : image.src;
    if (seenMissing.has(key)) continue;
    if (asset.kind !== "local") {
      seenMissing.add(key);
      issues.push(`imagem no corpo não existe em public/: ${image.src}.`);
      continue;
    }
    if (!fs.existsSync(asset.abs) || !fs.statSync(asset.abs).isFile()) {
      seenMissing.add(key);
      issues.push(`imagem no corpo não existe em public/: ${asset.web}.`);
    }
  }

  const linkSources = [parsed.content ?? "", ...stringValues(data)];
  const links = [...new Set(linkSources.flatMap((text) => apexLinks(text)))];
  for (const link of links) {
    issues.push(`link para thezero.com.br sem www: ${link}.`);
  }

  issues.push(...requiredFrontmatterIssues(data, ctx.taxonomy));

  if (typeof data.date === "string" && data.date.trim() !== "") {
    const publication = parsePublicationDate(data.date);
    if ("error" in publication) issues.push(publication.error);
    else if (publication.ymd > ctx.futureLimit) {
      issues.push(
        `data de publicação no futuro distante: ${publication.ymd} (limite ${ctx.futureLimit}, ${MAX_FUTURE_DAYS} dias à frente no calendário de Brasília).`,
      );
    }
  } else if (data.date != null && typeof data.date !== "string") {
    issues.push(
      "data de publicação inválida: o campo date precisa ser texto ISO entre aspas (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss-03:00).",
    );
  }

  if (issues.length === 0) return [];
  return issues.map((issue) => `${rel} (${slug}): ${issue}`);
}

function listAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((name) => path.join(POSTS_DIR, name))
    .sort();
}

function gitLines(args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

function changedPaths() {
  let base = null;
  for (const ref of ["origin/main", "main"]) {
    const lines = gitLines(["merge-base", "HEAD", ref]);
    if (lines?.[0]) {
      base = lines[0];
      break;
    }
  }
  if (!base) return null;
  const specs = ["content/posts", "public/images/posts"];
  const diff = gitLines([
    "diff",
    "--name-only",
    "--diff-filter=ACMR",
    base,
    "--",
    ...specs,
  ]);
  const untracked = gitLines([
    "ls-files",
    "--others",
    "--exclude-standard",
    "--",
    ...specs,
  ]);
  if (!diff || !untracked) return null;
  return [...new Set([...diff, ...untracked])];
}

function postsReferencingImage(absImage) {
  const rel = path.relative(PUBLIC_DIR, absImage).split(path.sep).join("/");
  const web = `/${rel}`;
  return listAllPosts().filter((file) => fs.readFileSync(file, "utf8").includes(web));
}

function resolveInput(arg) {
  if (path.isAbsolute(arg)) return path.normalize(arg);
  const fromCwd = path.resolve(process.cwd(), arg);
  if (fs.existsSync(fromCwd)) return fromCwd;
  return path.resolve(ROOT, arg);
}

function postsFromPaths(inputs) {
  const posts = new Set();
  const errors = [];
  for (const input of inputs) {
    const abs = resolveInput(input);
    if (!fs.existsSync(abs)) {
      errors.push(`arquivo não encontrado: ${input}.`);
      continue;
    }
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      for (const file of fs.readdirSync(abs)) {
        if (file.endsWith(".mdx") || file.endsWith(".md")) {
          posts.add(path.join(abs, file));
        }
      }
      continue;
    }
    if (abs.endsWith(".mdx") || abs.endsWith(".md")) {
      posts.add(abs);
      continue;
    }
    if (isInside(path.join(PUBLIC_DIR, "images", "posts"), abs) || isInside(PUBLIC_DIR, abs)) {
      const related = postsReferencingImage(abs);
      if (related.length === 0) {
        console.log(`Nenhum post referencia ${path.relative(ROOT, abs)}.`);
      }
      for (const file of related) posts.add(file);
      continue;
    }
    errors.push(`caminho ignorado (não é post nem imagem em public/): ${input}.`);
  }
  return { posts: [...posts].sort(), errors };
}

function printHelp() {
  console.log(`Uso: node scripts/check-posts.mjs [--all] [arquivos...]

Conferência de posts em content/posts/*.mdx.
Sem argumentos, usa os posts (e imagens de public/images/posts) alterados em relação a main.
--all confere todos os posts.

Falhas (mensagem em português, exit 1):
  title com ponto final
  coverAlt ausente ou vazio, ou imagem no corpo sem alt
  capa fora de public/, formato diferente de jpg/png/webp, ou largura < ${MIN_COVER_WIDTH}px
  imagem do corpo fora de public/
  link para thezero.com.br sem www
  frontmatter obrigatório ausente ou inválido (title, excerpt, date, category; subcategory e format quando preenchidos)
  data de publicação inválida ou mais de ${MAX_FUTURE_DAYS} dias no futuro (Brasília)`);
}

async function main(argv = process.argv.slice(2)) {
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return 0;
  }

  const all = argv.includes("--all");
  const inputs = argv.filter((arg) => arg !== "--all");
  const taxonomy = loadTaxonomy();
  const sharp = await loadSharp();
  const today = saoPauloYmd(new Date());
  const ctx = {
    taxonomy,
    sharp,
    futureLimit: addCalendarDays(today, MAX_FUTURE_DAYS),
  };

  let files = [];
  const errors = [];
  if (all) {
    files = listAllPosts();
  } else if (inputs.length > 0) {
    const selected = postsFromPaths(inputs);
    files = selected.posts;
    errors.push(...selected.errors);
  } else {
    const changed = changedPaths();
    if (!changed) {
      console.error("Não consegui listar os arquivos alterados no git. Passe os .mdx ou use --all.");
      return 1;
    }
    if (changed.length === 0) {
      console.log("Nenhum post alterado. Use --all para conferir todos.");
      return 0;
    }
    const selected = postsFromPaths(changed.map((rel) => path.join(ROOT, rel)));
    files = selected.posts;
    errors.push(...selected.errors);
  }

  const reports = [...errors];
  for (const file of files) {
    reports.push(...(await checkPost(file, ctx)));
  }

  if (reports.length === 0) {
    console.log(`OK: ${files.length} post(s) conferido(s).`);
    return 0;
  }

  for (const line of reports) console.error(line);
  const failingPosts = new Set(
    reports
      .map((line) => line.match(/^(content\/posts\/\S+\.mdx?)\s/)?.[1])
      .filter(Boolean),
  );
  console.error("");
  console.error(
    `Falhou: ${reports.length} problema(s) em ${failingPosts.size || reports.length} arquivo(s). ${files.length} post(s) conferido(s).`,
  );
  return 1;
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    },
  );
}

export {
  addCalendarDays,
  apexLinks,
  bodyImages,
  checkPost,
  loadTaxonomy,
  main,
  parseImageHeader,
  parsePublicationDate,
  resolvePublicAsset,
  saoPauloYmd,
};
