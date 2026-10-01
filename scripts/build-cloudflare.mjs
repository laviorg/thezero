import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const patches = [
  {
    file: "src/app/ads.txt/route.ts",
    from: 'export const dynamic = "force-dynamic";',
    to: 'export const dynamic = "force-static";',
  },
  {
    file: "src/app/news-sitemap.xml/route.ts",
    from: "export const revalidate = 300;\n",
    to: 'export const dynamic = "force-static";\n',
  },
];

const originals = new Map();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text);
}

function applyPatches() {
  const page = read("src/app/busca/page.tsx");
  if (!page.includes("searchParams")) {
    throw new Error(
      "src/app/busca/page.tsx não é a página SSR. O build da Cloudflare não vai sobrescrever.",
    );
  }
  originals.set("src/app/busca/page.tsx", page);
  write("src/app/busca/page.tsx", read("src/app/busca/page.cloudflare.tsx"));

  for (const patch of patches) {
    const source = read(patch.file);
    if (!source.includes(patch.from)) {
      throw new Error(`Não achei o trecho esperado em ${patch.file}`);
    }
    originals.set(patch.file, source);
    write(patch.file, source.replace(patch.from, patch.to));
  }
}

function restore() {
  for (const [rel, source] of originals) write(rel, source);
}

function run(command, args, env) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

let exitCode = 1;
try {
  applyPatches();
  exitCode = await run("npx", ["next", "build"], { CF_STATIC_EXPORT: "1" });
  if (exitCode === 0) {
    exitCode = await run(
      "node",
      [
        "--experimental-strip-types",
        "--import",
        "./scripts/register-alias.mjs",
        "scripts/write-cloudflare-assets.mjs",
      ],
      { NODE_ENV: "production", CF_STATIC_EXPORT: "1" },
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  exitCode = 1;
} finally {
  restore();
}

process.exit(exitCode);
