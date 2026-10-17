#!/usr/bin/env node
/**
 * Falha se o diff base..head mexe numa capa travada sem autorização.
 *
 * Capa travada = post cujo frontmatter na BASE tem `cover_locked: true`
 * (ou `cover_source: real`). Conta como mexer:
 *  - qualquer arquivo em public/images/posts/<slug>/ que comece com `cover`
 *    (inclui o original `cover.src.*`), alterado ou apagado;
 *  - mudança em `cover`, `coverCredit`, `cover_locked` ou `cover_source`
 *    no frontmatter, ou o .mdx apagado/renomeado.
 *
 * Autorização (qualquer uma):
 *  - rótulo `allow-cover-change` no PR (lido do evento do GitHub Actions)
 *    ou env ALLOW_COVER_CHANGE=1;
 *  - um commit do intervalo com o trailer `Allow-Cover-Change: <slug>` ou
 *    `Allow-Cover-Change: all`.
 *
 *   node scripts/check-cover-locks.mjs <base> <head>
 * O check-posts.mjs chama isto em todo PR que mexe em posts/imagens.
 * Ver docs/cover-lock.md.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import matter from "gray-matter";

const FIELDS = ["cover", "coverCredit", "cover_locked", "cover_source"];

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 << 20 });
const show = (ref, file) => {
  try {
    return git("show", `${ref}:${file}`);
  } catch {
    return null;
  }
};

export function isLocked(data) {
  return Boolean(data) && (data.cover_locked === true || data.cover_source === "real");
}

export function allowedSlugs(messages) {
  const out = new Set();
  for (const msg of messages) {
    for (const m of msg.matchAll(/^Allow-Cover-Change:\s*(.+)$/gim)) {
      for (const s of m[1].split(/[\s,]+/).filter(Boolean)) out.add(s.trim());
    }
  }
  return out;
}

export function coverLockProblems(base, head, env = process.env) {
  const changed = git("diff", "--name-status", "--no-renames", base, head, "--", "content/posts", "public/images/posts")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("\t"));
  const touched = new Map();
  for (const [status, file] of changed) {
    let m = file.match(/^public\/images\/posts\/([^/]+)\/(cover[^/]*)$/);
    if (m) {
      touched.set(m[1], [...(touched.get(m[1]) ?? []), `${status} ${file}`]);
      continue;
    }
    m = file.match(/^content\/posts\/([^/]+)\.mdx$/);
    if (!m) continue;
    const before = show(base, file);
    if (!before) continue;
    const a = matter(before).data;
    if (!isLocked(a)) continue;
    const after = show(head, file);
    if (!after) {
      touched.set(m[1], [...(touched.get(m[1]) ?? []), `${status} ${file}`]);
      continue;
    }
    const b = matter(after).data;
    const diff = FIELDS.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    if (diff.length) touched.set(m[1], [...(touched.get(m[1]) ?? []), `${file} (${diff.join(", ")})`]);
  }

  const allowAll = env.ALLOW_COVER_CHANGE === "1";
  const msgs = git("log", "--format=%B%x00", `${base}..${head}`).split("\0");
  const allow = allowedSlugs(msgs);
  const problems = [];
  for (const [slug, what] of touched) {
    const mdx = show(base, `content/posts/${slug}.mdx`);
    if (!mdx || !isLocked(matter(mdx).data)) continue;
    if (allowAll || allow.has("all") || allow.has(slug)) {
      console.log(`capa travada alterada com autorização: ${slug}`);
      continue;
    }
    problems.push(`${slug}: ${what.join("; ")}`);
  }
  return problems;
}

export const COVER_LOCK_HINT =
  "Para liberar: rótulo `allow-cover-change` no PR (depois rode o job de novo ou edite o corpo do PR) ou trailer `Allow-Cover-Change: <slug>` num commit. Ver docs/cover-lock.md.";

/** Base/head e rótulos do PR quando roda no GitHub Actions; senão merge-base com origin/main. */
export function coverLockRange(env = process.env) {
  if (env.GITHUB_EVENT_PATH && fs.existsSync(env.GITHUB_EVENT_PATH)) {
    const event = JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, "utf8"));
    const pr = event.pull_request;
    if (pr?.base?.sha && pr?.head?.sha) {
      const labels = (pr.labels ?? []).map((l) => l.name);
      return { base: pr.base.sha, head: pr.head.sha, allowAll: labels.includes("allow-cover-change") };
    }
  }
  try {
    const base = git("merge-base", "origin/main", "HEAD").trim();
    return { base, head: "HEAD", allowAll: false };
  } catch {
    return null;
  }
}

export function main(base, head, env = process.env) {
  const problems = coverLockProblems(base, head, env);
  if (problems.length) {
    console.error("Capa travada (cover_locked) alterada sem autorização:");
    for (const p of problems) console.error(`  - ${p}`);
    console.error(COVER_LOCK_HINT);
    return 1;
  }
  console.log("check-cover-locks: ok.");
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [base = "origin/main", head = "HEAD"] = process.argv.slice(2);
  process.exit(main(base, head));
}
