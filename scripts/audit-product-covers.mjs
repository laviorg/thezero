#!/usr/bin/env node
/**
 * Auditoria: matéria de produto (review, comparativo, vale a pena, guia de
 * compra ou texto sobre um produto específico) sem foto real na capa.
 *
 * Candidata = format review | comparativo | vale-a-pena, ou título/slug com
 * nome de produto/marca (PRODUCT_RE). Pendente = candidata cujo frontmatter
 * não tem `cover_source: real` e que não está em
 * scripts/data/product-cover-audit.json (notProduct: não é sobre um produto;
 * noOfficialPhoto: sem foto oficial utilizável, com o motivo).
 *
 *   node scripts/audit-product-covers.mjs            # lista e resume
 *   node scripts/audit-product-covers.mjs --strict   # exit 1 se houver pendente
 *   node scripts/audit-product-covers.mjs --json
 * Ver docs/cover-lock.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS = path.join(ROOT, "content", "posts");
const DATA = path.join(ROOT, "scripts", "data", "product-cover-audit.json");

export const PRODUCT_FORMATS = new Set(["review", "comparativo", "vale-a-pena"]);
export const PRODUCT_RE = new RegExp(
  [
    "iphone", "ipad", "macbook", "airpods", "apple watch", "galaxy", "pixel", "redmi", "xiaomi", "poco ",
    "motorola", "moto g", "edge \\d", "nothing phone", "steam deck", "switch", "ps4", "ps5", "playstation",
    "xbox", "series [xs]\\b", "dualsense", "8bitdo", "legion go", "rog ally", "rog xbox", "zeenix", "ayaneo",
    "\\bayn\\b", "odin", "retroid", "anbernic", "gpd", "onexplayer", "msi claw", "rtx ?\\d{4}", "rx ?\\d{4}",
    "ryzen", "core i[3579]", "core ultra", "fire tv", "chromecast", "kindle", "echo dot", "quest \\d",
  ].join("|"),
  "i",
);

export function isProductCandidate({ slug, format, title }) {
  if (PRODUCT_FORMATS.has(format)) return true;
  return PRODUCT_RE.test(title ?? "") || PRODUCT_RE.test((slug ?? "").replaceAll("-", " "));
}

export function hasRealCover(data) {
  return data?.cover_source === "real";
}

export function audit({ postsDir = POSTS, dataFile = DATA } = {}) {
  const exc = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : {};
  const notProduct = exc.notProduct ?? {};
  const noPhoto = exc.noOfficialPhoto ?? {};
  const rows = { real: [], pending: [], notProduct: [], noOfficialPhoto: [] };
  for (const file of fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx")).sort()) {
    const slug = file.replace(/\.mdx$/, "");
    const { data } = matter(fs.readFileSync(path.join(postsDir, file), "utf8"));
    const format = typeof data.format === "string" ? data.format : "noticia";
    const title = typeof data.title === "string" ? data.title : "";
    if (format === "noticia") continue; // notícia já entra com foto da pauta
    if (!isProductCandidate({ slug, format, title })) continue;
    const row = { slug, format, title, cover: data.cover ?? "" };
    if (hasRealCover(data)) rows.real.push(row);
    else if (notProduct[slug]) rows.notProduct.push({ ...row, reason: notProduct[slug] });
    else if (noPhoto[slug]) rows.noOfficialPhoto.push({ ...row, reason: noPhoto[slug] });
    else rows.pending.push(row);
  }
  return rows;
}

function main(argv = process.argv.slice(2)) {
  const rows = audit();
  if (argv.includes("--json")) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    for (const r of rows.pending) console.log(`PENDENTE  ${r.slug}  [${r.format}]  ${r.cover}  — ${r.title}`);
    for (const r of rows.noOfficialPhoto) console.log(`SEM FOTO  ${r.slug}  — ${r.reason}`);
    console.log(
      `audit-product-covers: ${rows.real.length} com foto real, ${rows.pending.length} pendente(s), ` +
        `${rows.noOfficialPhoto.length} sem foto oficial (justificado), ${rows.notProduct.length} fora do escopo (não é produto).`,
    );
  }
  return argv.includes("--strict") && rows.pending.length > 0 ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
