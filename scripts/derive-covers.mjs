/**
 * Gera derivados WebP das capas locais em public/images/derived/ (gitignored):
 *  - <nome>.webp       mesma proporção, até 1960 px de largura (exibição)
 *  - <nome>.16x9.webp  1200x675  (Discover / NewsArticle)
 *  - <nome>.4x3.webp   1200x900
 *  - <nome>.1x1.webp   1200x1200
 * Roda antes de todo build. Pula arquivos já gerados e mais novos que a capa.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const srcDir = path.join(root, "public/images/posts");
const outDir = path.join(root, "public/images/derived/posts");
const RATIOS = { "16x9": [1200, 675], "4x3": [1200, 900], "1x1": [1200, 1200] };

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

let made = 0;
for (const file of walk(srcDir)) {
  const rel = path.relative(srcDir, file).replace(/\.[^.]+$/, "");
  const base = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const jobs = [];
  const full = `${base}.webp`;
  if (!fresh(full, file)) {
    jobs.push(
      sharp(file).resize({ width: 1960, withoutEnlargement: true }).webp({ quality: 78 }).toFile(full),
    );
  }
  for (const [name, [w, h]] of Object.entries(RATIOS)) {
    const out = `${base}.${name}.webp`;
    if (fresh(out, file)) continue;
    jobs.push(
      sharp(file).resize(w, h, { fit: "cover", position: "attention" }).webp({ quality: 78 }).toFile(out),
    );
  }
  if (jobs.length) {
    await Promise.all(jobs);
    made += jobs.length;
  }
}
console.log(`derive-covers: ${made} arquivo(s) gerado(s)`);
