import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { articleImageUrls } from "../src/lib/article-images.ts";
import { getAllPosts } from "../src/lib/posts.ts";
import { APEX_HOST, PATH_REDIRECTS } from "../src/lib/redirects.ts";
import {
  buildNewsSitemapXml,
  selectGoogleNewsPosts,
} from "../src/lib/news-sitemap.ts";
import { absoluteUrl, site } from "../src/lib/site.ts";

const root = process.cwd();
const outDir = path.join(root, "out");

const FILE_LIMIT = 20_000;
const BYTE_LIMIT = 25 * 1024 * 1024;

function redirectsFile() {
  const lines = [`https://${APEX_HOST}/* https://www.${APEX_HOST}/:splat 308`];
  for (const rule of PATH_REDIRECTS) {
    lines.push(`${rule.source} ${rule.destination} 308`);
    if (!rule.source.endsWith("/")) {
      lines.push(`${rule.source}/ ${rule.destination} 308`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function headersFile() {
  return `/rss.xml
  Content-Type: application/rss+xml; charset=utf-8
  Cache-Control: public, max-age=3600
/ads.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=300, must-revalidate
  X-Content-Type-Options: nosniff
/sitemap.xml
  Content-Type: application/xml; charset=utf-8
/robots.txt
  Content-Type: text/plain; charset=utf-8
/news-manifest.json
  Content-Type: application/json; charset=utf-8
  Cache-Control: public, max-age=300
  X-Robots-Tag: noindex
/search-index.json
  Content-Type: application/json; charset=utf-8
  Cache-Control: public, max-age=300
  X-Robots-Tag: noindex
`;
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

if (!fs.existsSync(outDir)) {
  console.error("out/ não existe. Rode o next build antes.");
  process.exit(1);
}

const posts = getAllPosts();
fs.writeFileSync(
  path.join(outDir, "search-index.json"),
  JSON.stringify(posts),
);

const manifest = {
  publication: site.name,
  posts: posts.map((post) => ({
    loc: absoluteUrl(post.href),
    title: post.title,
    dateIso: post.dateIso,
    format: post.format,
    images: articleImageUrls(post),
  })),
};
fs.writeFileSync(
  path.join(outDir, "news-manifest.json"),
  JSON.stringify(manifest),
);
fs.writeFileSync(path.join(outDir, "_redirects"), redirectsFile());
fs.writeFileSync(path.join(outDir, "_headers"), headersFile());

const started = performance.now();
const newsEntries = selectGoogleNewsPosts(manifest.posts).map((post) => ({
  loc: post.loc,
  title: post.title,
  publicationDate: post.dateIso,
  images: post.images,
}));
const xml = buildNewsSitemapXml(newsEntries, manifest.publication);
const elapsed = performance.now() - started;

const files = walk(outDir);
let largest = { bytes: 0, file: "" };
for (const file of files) {
  const bytes = fs.statSync(file).size;
  if (bytes > largest.bytes) largest = { bytes, file };
}

const failures = [];
if (files.length > FILE_LIMIT) {
  failures.push(`${files.length} arquivos, acima de ${FILE_LIMIT}`);
}
if (largest.bytes > BYTE_LIMIT) {
  failures.push(
    `${path.relative(root, largest.file)} tem ${largest.bytes} bytes, acima de ${BYTE_LIMIT}`,
  );
}

console.log(
  `cloudflare export: ${files.length} arquivos, maior ${path.relative(root, largest.file)} (${largest.bytes} bytes)`,
);
console.log(
  `news-sitemap amostra: ${elapsed.toFixed(2)} ms, ${newsEntries.length} urls, ${xml.length} bytes`,
);
console.log(`search-index: ${posts.length} matérias`);

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}
