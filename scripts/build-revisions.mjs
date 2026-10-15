/**
 * src/data/revisions.json: revisões editoriais reais de cada matéria, a partir
 * do histórico git de content/posts/<slug>.mdx (commits depois do primeiro).
 * Só entram commits cujo assunto indica mudança editorial; autoria, capa, alt,
 * links de afiliado, redirecionamentos e noindex não contam.
 * Sem histórico git (clone raso), mantém o arquivo anterior.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const OUT = "src/data/revisions.json";
const RULES = [
  [/acentua|sem acento/i, "Correção de acentuação"],
  [/veredito/i, "Card de veredito adicionado ao topo"],
  [/s[ée]rie vale a pena|conte[úu]do:|expande mat[ée]ria|atualiza(do|ção)? (o |a )?(texto|mat)|rewrite|reescrev/i, "Texto atualizado"],
  [/\bpre[çc]os? (atualiz|do dia)|prices\.json/i, "Preço atualizado"],
  [/seo\((posts|ctr)\)|seoTitle|t[íi]tulos?\/descri/i, "Título e descrição revisados"],
  [/fix: (clarify|tighten)|corrige (dado|n[úu]mero|texto)/i, "Correção no texto"],
];

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}

try {
  if (git(["rev-parse", "--is-shallow-repository"]).trim() === "true") throw new Error("clone raso");
  const out = {};
  for (const file of fs.readdirSync("content/posts").filter((f) => f.endsWith(".mdx"))) {
    const log = git(["log", "--follow", "--format=%cI%x09%s", "--", `content/posts/${file}`]).trim().split("\n").filter(Boolean).reverse();
    const entries = [];
    for (const line of log.slice(1)) {
      const [date, subject] = line.split("\t");
      const rule = RULES.find(([re]) => re.test(subject));
      if (!rule) continue;
      const pr = subject.match(/\(#(\d+)\)\s*$/)?.[1];
      entries.push({ date, note: rule[1], ...(pr ? { pr: Number(pr) } : {}) });
    }
    if (entries.length) out[file.replace(/\.mdx$/, "")] = entries;
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`build-revisions: ${Object.keys(out).length} matéria(s) com revisão`);
} catch (error) {
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, "{}\n");
  console.warn(`build-revisions: mantendo ${OUT} (${error.message})`);
}
