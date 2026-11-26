/**
 * Gera derivados WebP das capas locais em public/images/derived/ (gitignored):
 *  - <nome>.webp       mesma proporção, até 1960 px de largura (exibição)
 *  - <nome>.16x9.webp  1200x675  (Discover / NewsArticle)
 *  - <nome>.4x3.webp   1200x900
 *  - <nome>.1x1.webp   1200x1200
 * Roda antes de todo build. Pula arquivos já gerados e mais novos que a capa.
 *
 * A saída é espelhada em .next/cache/derive-covers (cache de build da Vercel):
 * no checkout limpo, os derivados anteriores voltam do cache e só capas
 * novas/alteradas são processadas. Sem isso, cada build regenera o acervo
 * inteiro e o tempo cresce com o número de matérias até estourar o limite.
 * Os jobs rodam com concorrência limitada (DERIVE_COVERS_CONCURRENCY, padrão 8).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const srcDir = path.join(root, "public/images/posts");
const outDir = path.join(root, "public/images/derived/posts");
const cacheDir = path.join(root, ".next/cache/derive-covers");
const RATIOS = { "16x9": [1200, 675], "4x3": [1200, 900], "1x1": [1200, 1200] };
const CONCURRENCY = Math.max(1, Number(process.env.DERIVE_COVERS_CONCURRENCY) || 8);

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    // `cover.src.*` é o original sem marca guardado ao lado da capa travada:
    // não vira derivado público. Ver docs/cover-lock.md.
    else if (/\.(jpe?g|png|webp)$/i.test(e.name) && !/\.src\.[^.]+$/i.test(e.name)) yield p;
  }
}

const fresh = (out, src) =>
  fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

/** Cache é otimização: qualquer falha aqui não pode derrubar o build. */
function restoreCache() {
  try {
    if (fs.existsSync(cacheDir)) {
      fs.cpSync(cacheDir, outDir, { recursive: true, force: false });
    }
  } catch {
    // segue sem cache
  }
}

function saveCache() {
  try {
    fs.cpSync(outDir, cacheDir, { recursive: true, force: true });
  } catch {
    // segue sem cache
  }
}

restoreCache();

const jobs = [];
for (const file of walk(srcDir)) {
  const rel = path.relative(srcDir, file).replace(/\.[^.]+$/, "");
  const base = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(base), { recursive: true });

  const full = `${base}.webp`;
  if (!fresh(full, file)) {
    jobs.push(() =>
      sharp(file).resize({ width: 1960, withoutEnlargement: true }).webp({ quality: 78 }).toFile(full),
    );
  }

  for (const [name, [w, h]] of Object.entries(RATIOS)) {
    const out = `${base}.${name}.webp`;
    if (fresh(out, file)) continue;
    jobs.push(() =>
      sharp(file).resize(w, h, { fit: "cover", position: "attention" }).webp({ quality: 78 }).toFile(out),
    );
  }
}

let made = 0;
let next = 0;
async function worker() {
  while (next < jobs.length) {
    const job = jobs[next++];
    await job();
    made++;
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));

if (made > 0) saveCache();

console.log(`derive-covers: ${made} arquivo(s) gerado(s)`);
