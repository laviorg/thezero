/**
 * Inserts a short “Leia também” block on evergreen posts that still lack a
 * cross-format link (guia ↔ review ↔ comparativo ↔ notícia).
 *
 * Targets come from RELATED, an editorial map of slugs that already exist.
 * The script never invents a slug and skips a file that already has the
 * heading. Re-run is safe.
 *
 *   node --experimental-strip-types scripts/link-evergreen.ts --dry-run
 *   node --experimental-strip-types scripts/link-evergreen.ts
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const EVERGREEN = new Set(["review", "guia", "comparativo"]);

/**
 * Ordered targets. The writer only keeps slugs that are not already linked
 * in the body, prefers a format the post does not yet cite, and stops at 2.
 */
const RELATED: Record<string, readonly string[]> = {
  "acessorios-steam-deck-dock-case-sd": [
    "steam-deck-oled-brasil-preco-doi",
    "emular-no-steam-deck-expectativa-real",
  ],
  "action-cam-barata-vs-celular-estabilizado": [
    "celular-melhor-camera-ate-3-mil",
  ],
  "agente-ia-permissoes-que-nao-dar": [
    "o-que-nao-colar-no-chat-de-ia",
    "meta-muse-mac-agente-no-computador",
  ],
  "airpods-vs-galaxy-buds-ecossistema-misto": [
    "fone-cancelamento-ruido-ate-800",
    "beats-360-almofada-trocavel-sem-preco-br",
  ],
  "all-in-one-escritorio-pequeno": [
    "mini-pc-quando-substitui-o-desktop",
    "pc-trabalho-remoto-configuracao-enxuta",
  ],
  "apple-notes-vs-notion-vs-obsidian": [
    "nuvem-gratis-drive-onedrive-icloud",
  ],
  "apple-watch-se-vs-galaxy-watch-fitness": [
    "smartwatch-barato-o-que-medir",
    "galaxy-s25-vs-iphone-16-pra-quem",
  ],
  "braco-articulado-mesa-sem-dor": [
    "cadeira-gamer-vs-escritorio-ate-1500",
    "segunda-tela-vertical-codigo",
  ],
  "cadeira-gamer-vs-escritorio-ate-1500": [
    "braco-articulado-mesa-sem-dor",
  ],
  "capcut-vs-premiere-rush-reels-shorts": [
    "pc-edicao-de-video-ate-6-mil",
  ],
  "capinha-e-pelicula-o-que-protege": [
    "troca-de-tela-original-vs-paralela",
  ],
  "carregador-usb-c-rapido-sem-fritar-bateria": [
    "celular-bateria-que-dura-o-dia",
    "carregamento-sem-fio-calor-e-bateria",
  ],
  "carregamento-sem-fio-calor-e-bateria": [
    "carregador-usb-c-rapido-sem-fritar-bateria",
    "celular-bateria-que-dura-o-dia",
  ],
  "celular-barato-whatsapp-e-banco": [
    "celular-para-idoso-whatsapp-facil",
    "whatsapp-business-vs-app-pessoal",
  ],
  "celular-para-idoso-whatsapp-facil": [
    "celular-barato-whatsapp-e-banco",
    "whatsapp-business-vs-app-pessoal",
  ],
  "chatgpt-vs-gemini-no-celular": [
    "ia-gratis-para-trabalho-2026",
    "tres-ias-que-uso-duas-que-parei",
  ],
  "como-ler-um-patch-day": [
    "pre-venda-de-jogo-desconto-depois",
  ],
  "controle-original-vs-generico-console": [
    "dualsense-vs-xbox-vs-8bitdo-no-pc",
    "ps5-slim-vale-a-pena-2026-brasil",
  ],
  "cooler-torre-ou-water-cooler-aio": [
    "ryzen-5-7600-vs-core-i5-custo-brasil",
    "pasta-termica-quando-trocar",
  ],
  "dock-usb-c-notebook-o-que-nao-economizar": [
    "usb-c-cabo-errado-2026",
  ],
  "dualsense-vs-xbox-vs-8bitdo-no-pc": [
    "controle-original-vs-generico-console",
  ],
  "emular-no-steam-deck-expectativa-real": [
    "steam-deck-oled-brasil-preco-doi",
    "steam-deck-lcd-usado-ainda-vale",
  ],
  "fibra-500-mb-vs-1-gb": [
    "roteador-wifi-6-barato-modem-operadora",
  ],
  "fone-cancelamento-ruido-ate-800": [
    "airpods-vs-galaxy-buds-ecossistema-misto",
    "beats-360-almofada-trocavel-sem-preco-br",
  ],
  "fone-com-fio-ainda-faz-sentido-2026": [
    "fone-tws-ate-300-audio-e-microfone",
    "fone-cancelamento-ruido-ate-800",
  ],
  "fone-tws-ate-300-audio-e-microfone": [
    "fone-com-fio-ainda-faz-sentido-2026",
    "beats-360-almofada-trocavel-sem-preco-br",
  ],
  "fonte-650w-80-plus-o-que-nao-economizar": [
    "fonte-rtx-4060-e-4070-quantos-watts",
    "rtx-4060-vs-5060-brasil",
  ],
  "fonte-rtx-4060-e-4070-quantos-watts": [
    "fonte-650w-80-plus-o-que-nao-economizar",
    "rtx-4060-vs-5060-brasil",
  ],
  "gabinete-fluxo-de-ar-ate-400": [
    "cooler-torre-ou-water-cooler-aio",
    "fonte-650w-80-plus-o-que-nao-economizar",
  ],
  "galaxy-a16-ou-a26-entrada-samsung": [
    "galaxy-a55-vs-edge-50-fusion",
    "celular-ate-2-mil-brasil-2026",
  ],
  "galaxy-a55-vs-edge-50-fusion": [
    "motorola-vs-samsung-intermediario",
    "s25-ultra-200mp-ninguem-usa",
  ],
  "game-pass-ultimate-vs-comprar-jogo": [
    "ps5-vs-series-x-exclusivo-game-pass-preco",
    "xbox-series-s-game-pass-e-netflix",
  ],
  "garantia-estendida-quando-recusar": [
    "iphone-seminovo-brasil-o-que-checar",
    "notebook-usado-empresarial-checklist",
  ],
  "gerenciador-de-senhas-gratis-vs-pago": [
    "antivirus-windows-2026-precisa-pagar",
    "o-que-nao-colar-no-chat-de-ia",
  ],
  "hd-externo-vs-ssd-portatil": [
    "ssd-nvme-1tb-brasil-o-que-olhar",
    "nvme-adaptador-usb-velocidade-real",
  ],
  "headset-ate-500-microfone": [
    "microfone-usb-sem-estudio",
    "fone-tws-ate-300-audio-e-microfone",
  ],
  "ia-gratis-para-trabalho-2026": [
    "chatgpt-vs-gemini-no-celular",
    "tres-ias-que-uso-duas-que-parei",
  ],
  "ipad-10-vs-tablet-android-gap-de-apps": [
    "tablet-ate-1500-estudar-e-netflix",
    "notebook-2-em-1-vale-a-pena",
  ],
  "iphone-eua-vs-loja-br-conta-total": [
    "iphone-18-pro-brasil-hoje-preco",
    "pixel-no-brasil-quando-importar",
  ],
  "iphone-seminovo-brasil-o-que-checar": [
    "trocar-bateria-iphone-brasil-preco-risco",
    "iphone-18-pro-brasil-hoje-preco",
  ],
  "key-de-jogo-barata-risco-de-conta": [
    "steam-vs-epic-vs-xbox-pc-preco",
  ],
  "legion-go-vs-rog-ally": [
    "rog-ally-x-brasil-preco-desempenho",
    "steam-deck-oled-vs-zeenix-pro",
  ],
  "macbook-air-m3-vs-notebook-windows-8-mil": [
    "ultrabook-faculdade-bateria-tela-teclado",
    "mac-mini-m6-ssd-soldado",
  ],
  "microfone-usb-sem-estudio": [
    "headset-ate-500-microfone",
    "webcam-full-hd-para-call",
  ],
  "mini-pc-quando-substitui-o-desktop": [
    "pc-trabalho-remoto-configuracao-enxuta",
    "mac-mini-m6-ssd-soldado",
  ],
  "modelo-menor-ou-pro": [
    "ia-gratis-para-trabalho-2026",
    "chatgpt-vs-gemini-no-celular",
  ],
  "monitor-144hz-full-hd-vs-1440p": [
    "segunda-tela-vertical-codigo",
    "setup-produtividade-overrated",
  ],
  "motorola-vs-samsung-intermediario": [
    "galaxy-a55-vs-edge-50-fusion",
    "motorola-signature-27-hoje",
  ],
  "mouse-gamer-leve-alem-do-marketing": [
    "tapete-de-mouse-grande-vs-pequeno",
    "teclado-mecanico-ate-400-abnt",
  ],
  "notebook-2-em-1-vale-a-pena": [
    "ipad-10-vs-tablet-android-gap-de-apps",
    "ultrabook-faculdade-bateria-tela-teclado",
  ],
  "notebook-usado-empresarial-checklist": [
    "ram-soldada-notebook-arrependimento",
    "ultrabook-faculdade-bateria-tela-teclado",
  ],
  "nothing-phone-brasil-preco-updates": [
    "pixel-no-brasil-quando-importar",
  ],
  "nuvem-gratis-drive-onedrive-icloud": [
    "apple-notes-vs-notion-vs-obsidian",
  ],
  "nvme-adaptador-usb-velocidade-real": [
    "ssd-nvme-1tb-brasil-o-que-olhar",
    "hd-externo-vs-ssd-portatil",
  ],
  "o-que-nao-colar-no-chat-de-ia": [
    "gerenciador-de-senhas-gratis-vs-pago",
    "agente-ia-permissoes-que-nao-dar",
  ],
  "pasta-termica-quando-trocar": [
    "cooler-torre-ou-water-cooler-aio",
    "undervolt-de-gpu",
  ],
  "pc-edicao-de-video-ate-6-mil": [
    "ryzen-5-7600-vs-core-i5-custo-brasil",
    "ssd-nvme-1tb-brasil-o-que-olhar",
  ],
  "pc-trabalho-remoto-configuracao-enxuta": [
    "mini-pc-quando-substitui-o-desktop",
    "macbook-air-m3-vs-notebook-windows-8-mil",
  ],
  "pcie-4-vs-5-ssd-vale-a-diferenca": [
    "ssd-nvme-1tb-brasil-o-que-olhar",
    "mac-mini-m6-ssd-soldado",
  ],
  "pixel-no-brasil-quando-importar": [
    "nothing-phone-brasil-preco-updates",
    "iphone-eua-vs-loja-br-conta-total",
  ],
  "placa-mae-b650-barata-upgrade-ryzen": [
    "ryzen-5-7600-vs-core-i5-custo-brasil",
    "amd-sobe-10-ia-radeon",
  ],
  "power-bank-pc-portatil-wattagem": [
    "rog-ally-x-brasil-preco-desempenho",
    "legion-go-vs-rog-ally",
  ],
  "pre-venda-de-jogo-desconto-depois": [
    "como-ler-um-patch-day",
  ],
  "ps-plus-extra-quem-joga-pouco": [
    "game-pass-ultimate-vs-comprar-jogo",
    "ps5-vs-series-x-exclusivo-game-pass-preco",
  ],
  "ps4-ainda-vale-2026-catalogo": [
    "ps5-slim-vale-a-pena-2026-brasil",
    "ps5-vs-series-x-exclusivo-game-pass-preco",
  ],
  "ps5-slim-vale-a-pena-2026-brasil": [
    "ps5-vs-series-x-exclusivo-game-pass-preco",
    "ssd-no-ps5-upgrade",
  ],
  "ps5-vs-series-x-exclusivo-game-pass-preco": [
    "xbox-series-s-game-pass-e-netflix",
    "dune-awakening-ps5-xbox-hoje",
  ],
  "ram-16-ou-32-gb-2026": [
    "ddr4-vs-ddr5-ainda-vale-montar",
    "ryzen-5-7600-vs-core-i5-custo-brasil",
  ],
  "ram-soldada-notebook-arrependimento": [
    "notebook-usado-empresarial-checklist",
    "macbook-air-m3-vs-notebook-windows-8-mil",
  ],
  "redmi-note-14-custo-beneficio": [
    "motorola-vs-samsung-intermediario",
    "celular-ate-2-mil-brasil-2026",
  ],
  "rog-ally-x-brasil-preco-desempenho": [
    "legion-go-vs-rog-ally",
    "windows-no-handheld-vs-steamos",
  ],
  "roteador-wifi-6-barato-modem-operadora": [
    "fibra-500-mb-vs-1-gb",
    "tomada-inteligente-economia-ou-hype",
  ],
  "ryzen-5-7600-vs-core-i5-custo-brasil": [
    "placa-mae-b650-barata-upgrade-ryzen",
    "amd-sobe-10-ia-radeon",
  ],
  "segunda-tela-vertical-codigo": [
    "monitor-144hz-full-hd-vs-1440p",
    "setup-produtividade-overrated",
  ],
  "smartwatch-barato-o-que-medir": [
    "apple-watch-se-vs-galaxy-watch-fitness",
  ],
  "soundbar-barata-vs-caixa-bluetooth": [
    "tv-55-4k-ate-2500-o-que-nao-cair",
    "fire-tv-stick-vs-chromecast-na-tv",
  ],
  "ssd-no-ps5-upgrade": [
    "ps5-slim-vale-a-pena-2026-brasil",
    "ssd-nvme-1tb-brasil-o-que-olhar",
  ],
  "ssd-nvme-1tb-brasil-o-que-olhar": [
    "pcie-4-vs-5-ssd-vale-a-diferenca",
    "hd-externo-vs-ssd-portatil",
  ],
  "steam-deck-lcd-usado-ainda-vale": [
    "steam-deck-oled-brasil-preco-doi",
    "steam-deck-oled-vs-zeenix-pro",
  ],
  "steam-deck-oled-brasil-preco-doi": [
    "switch-2-vs-steam-deck-oled-preco-brasil",
    "steam-deck-oled-vs-zeenix-pro",
  ],
  "steam-deck-oled-vs-zeenix-pro": [
    "steam-deck-oled-brasil-preco-doi",
    "zeenix-lite-portatil-barato",
  ],
  "steam-vs-epic-vs-xbox-pc-preco": [
    "game-pass-ultimate-vs-comprar-jogo",
    "key-de-jogo-barata-risco-de-conta",
  ],
  "switch-2-hype-vs-frame-rate": [
    "switch-2-vs-steam-deck-oled-preco-brasil",
    "switch-oled-usado-o-que-checar",
  ],
  "switch-2-vs-steam-deck-oled-preco-brasil": [
    "switch-2-hype-vs-frame-rate",
    "steam-deck-oled-brasil-preco-doi",
  ],
  "switch-oled-usado-o-que-checar": [
    "switch-2-hype-vs-frame-rate",
    "switch-2-vs-steam-deck-oled-preco-brasil",
  ],
  "tapete-de-mouse-grande-vs-pequeno": [
    "mouse-gamer-leve-alem-do-marketing",
  ],
  "teclado-caro-atalhos-baratos": [
    "teclado-mecanico-ate-400-abnt",
    "mouse-gamer-leve-alem-do-marketing",
  ],
  "teclado-mecanico-ate-400-abnt": [
    "teclado-caro-atalhos-baratos",
  ],
  "tomada-inteligente-economia-ou-hype": [
    "roteador-wifi-6-barato-modem-operadora",
  ],
  "troca-de-tela-original-vs-paralela": [
    "trocar-bateria-iphone-brasil-preco-risco",
    "iphone-18-pro-brasil-hoje-preco",
  ],
  "trocar-bateria-iphone-brasil-preco-risco": [
    "troca-de-tela-original-vs-paralela",
    "iphone-18-pro-brasil-hoje-preco",
  ],
  "tv-55-4k-ate-2500-o-que-nao-cair": [
    "soundbar-barata-vs-caixa-bluetooth",
    "fire-tv-stick-vs-chromecast-na-tv",
  ],
  "ultrabook-faculdade-bateria-tela-teclado": [
    "macbook-air-m3-vs-notebook-windows-8-mil",
    "notebook-2-em-1-vale-a-pena",
  ],
  "undervolt-de-gpu": [
    "rtx-4060-vs-5060-brasil",
    "rx-7600-vs-rtx-4060-brasil",
  ],
  "usb-c-cabo-errado-2026": [
    "carregador-usb-c-rapido-sem-fritar-bateria",
    "dock-usb-c-notebook-o-que-nao-economizar",
  ],
  "webcam-full-hd-para-call": [
    "microfone-usb-sem-estudio",
    "segunda-tela-vertical-codigo",
  ],
  "whatsapp-business-vs-app-pessoal": [
    "celular-barato-whatsapp-e-banco",
    "kabum-ninja-whatsapp-ia-commerce",
  ],
  "windows-11-pc-fraco-o-que-desligar": [
    "pc-trabalho-remoto-configuracao-enxuta",
    "mini-pc-quando-substitui-o-desktop",
  ],
  "windows-no-handheld-vs-steamos": [
    "rog-ally-x-brasil-preco-desempenho",
    "steam-deck-oled-vs-zeenix-pro",
  ],
  "xbox-series-s-game-pass-e-netflix": [
    "ps5-vs-series-x-exclusivo-game-pass-preco",
    "game-pass-ultimate-vs-comprar-jogo",
  ],
  "zeenix-lite-portatil-barato": [
    "steam-deck-oled-vs-zeenix-pro",
    "rog-ally-x-brasil-preco-desempenho",
  ],
};

type Doc = {
  slug: string;
  file: string;
  title: string;
  format: string;
  content: string;
  raw: string;
  href: string;
  linked: Set<string>;
};

function loadDocs(): Doc[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(POSTS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = matter(raw);
      const content = parsed.content;
      const linked = new Set<string>();
      for (const match of content.matchAll(/\]\(\/noticia\/([^)#\s]+)\)/g)) {
        const target = match[1]?.replace(/\/$/, "");
        if (target) linked.add(target);
      }
      return {
        slug,
        file: filePath,
        title: String(parsed.data.title ?? ""),
        format: typeof parsed.data.format === "string" ? parsed.data.format : "noticia",
        content,
        raw,
        href: `/noticia/${slug}`,
        linked,
      };
    });
}

function leadIn(format: string, used: Set<string>) {
  const options =
    format === "noticia"
      ? ["No noticiário,"]
      : format === "comparativo"
        ? ["Para comparar lado a lado,", "Na comparação da casa,"]
        : format === "review"
          ? ["No teste da casa,", "Na análise da casa,"]
          : ["Ainda neste assunto,", "No mesmo tema,"];
  const lead = options.find((item) => !used.has(item)) ?? options[0] ?? "Leia também";
  used.add(lead);
  return lead;
}

function sentence(lead: string, doc: Doc) {
  const end = /[.!?…]$/.test(doc.title) ? "" : ".";
  return `${lead} [${doc.title}](${doc.href})${end}`;
}

function blockFor(docs: Doc[]) {
  const used = new Set<string>();
  const lines = docs.map((doc) => sentence(leadIn(doc.format, used), doc));
  return `## Leia também\n\n${lines.join("\n\n")}`;
}

function choose(post: Doc, bySlug: Map<string, Doc>): Doc[] {
  if (!EVERGREEN.has(post.format)) return [];
  if (post.content.includes("## Leia também")) return [];
  const listed = RELATED[post.slug];
  if (!listed) return [];

  const linkedDocs = [...post.linked]
    .map((slug) => bySlug.get(slug))
    .filter((doc): doc is Doc => Boolean(doc));
  const linkedFormats = new Set(linkedDocs.map((doc) => doc.format));
  const hasNoticia = linkedFormats.has("noticia");
  const hasCross = [...linkedFormats].some(
    (format) => EVERGREEN.has(format) && format !== post.format,
  );
  if (hasNoticia && hasCross) return [];

  const pool = listed
    .map((slug) => bySlug.get(slug))
    .filter((doc): doc is Doc => Boolean(doc))
    .filter((doc) => doc.slug !== post.slug && !post.linked.has(doc.slug));

  const wanted = pool.filter((doc) => {
    if (doc.format === "noticia") return !hasNoticia;
    if (doc.format !== post.format) return !hasCross;
    return post.linked.size < 2 && !hasCross;
  });

  const picked: Doc[] = [];
  const seen = new Set<string>();
  for (const doc of wanted) {
    if (seen.has(doc.slug)) continue;
    seen.add(doc.slug);
    picked.push(doc);
    if (picked.length === 2) break;
  }
  return picked;
}

function insertBlock(content: string, block: string) {
  const sign = content.lastIndexOf("\nThe Zero.");
  if (sign < 0) return `${content.trimEnd()}\n\n${block}\n`;
  const before = content.slice(0, sign).replace(/\s+$/, "");
  const last = before.split(/\n\n/).pop() ?? "";
  const isHub =
    last.length > 0 &&
    last.length < 320 &&
    !last.startsWith("#") &&
    !last.startsWith("<") &&
    /\]\(\/(reviews|computadores|dispositivos|jogos|ia|aplicativos|tecnologia)(\/|\)|\s)/.test(
      last,
    );
  const rest = content.slice(sign + "\nThe Zero.".length);
  if (isHub) {
    const idx = before.lastIndexOf(last);
    const head = before.slice(0, idx).trimEnd();
    return `${head}\n\n${block}\n\n${last}\n\nThe Zero.${rest}`;
  }
  return `${before}\n\n${block}\n\nThe Zero.${rest}`;
}

function apply(raw: string, content: string, block: string) {
  const nextContent = insertBlock(content, block);
  const end = raw.indexOf("\n---", 3);
  if (end < 0) throw new Error("frontmatter ausente");
  const fm = raw.slice(0, end + 4);
  const sep = raw.slice(end + 4).match(/^\n*/)?.[0] ?? "\n";
  const body = nextContent.trimStart();
  return `${fm}${sep}${body}${body.endsWith("\n") ? "" : "\n"}`;
}

function main() {
  const dry = process.argv.includes("--dry-run");
  const docs = loadDocs();
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));

  for (const [slug, targets] of Object.entries(RELATED)) {
    if (!bySlug.has(slug)) throw new Error(`Origem inexistente: ${slug}`);
    for (const target of targets) {
      if (!bySlug.has(target)) throw new Error(`Alvo inexistente: ${slug} → ${target}`);
    }
  }

  let updated = 0;
  const lines: string[] = [];
  for (const post of docs) {
    const picks = choose(post, bySlug);
    if (picks.length === 0) continue;
    lines.push(`${post.slug} (${post.format}, já linka ${post.linked.size})`);
    lines.push(`    ${blockFor(picks).replaceAll("\n", "\n    ")}`);
    if (!dry) {
      fs.writeFileSync(post.file, apply(post.raw, post.content, blockFor(picks)));
    }
    updated += 1;
  }
  console.log(lines.join("\n"));
  console.log(`\n# posts ${updated}${dry ? " (dry-run)" : " atualizados"}`);
}

if (process.argv[1]?.includes("link-evergreen")) main();
