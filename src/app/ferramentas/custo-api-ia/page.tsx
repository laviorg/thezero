import { AiCostCalculator } from "@/components/tools/ai-cost-calculator";
import { ToolPage, type ToolMeta } from "@/components/tools/tool-page";
import data from "@/data/ai-api-prices.json";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const meta: ToolMeta = {
  path: "/ferramentas/custo-api-ia",
  title: "Calculadora de custo de API de IA em reais",
  description: "Quanto custa uma conversa com a API do Gemini: tokens de texto, áudio e vídeo, histórico reenviado a cada turno, em dólar e em reais.",
  lede: "Monte a conversa, escolha o modelo e veja quanto sai por conversa e por mês. Os preços vêm só da página oficial de cada empresa, com a data em que conferimos.",
  cover: "/images/pages/custo-api-ia.png",
  coverAlt: "Arte com o texto Custo de API de IA e a marca The Zero sobre fundo escuro",
  updatedIso: "2026-10-15T20:00:00-03:00",
  faq: [
    { q: "Por que o custo cresce a cada turno?", a: "A API não lembra a conversa sozinha: cada turno reenvia o prompt fixo e todo o histórico como entrada. Numa conversa de 10 turnos, a primeira mensagem é cobrada 10 vezes." },
    { q: "Quantos tokens tem um segundo de áudio?", a: `A página de preços do Gemini usa ${data.audioTokensPerSecond} tokens por segundo de áudio.` },
    { q: "Qual dólar a calculadora usa?", a: `${data.fx.label}. Cartão internacional soma IOF e o spread do banco, então a fatura sai mais cara.` },
    { q: "Cache de contexto e Batch entram na conta?", a: "Não. Os dois baixam o custo de entrada; a calculadora mostra o preço padrão como teto." },
  ],
};

export const metadata: Metadata = buildPageMetadata({ title: meta.title, description: meta.description, path: meta.path, imagePath: meta.cover, imageAlt: meta.coverAlt });

export default function Page() {
  return (
    <ToolPage meta={meta}>
      <AiCostCalculator />
      <h2>Preços usados</h2>
      <p>Tabela completa por modelo em <Link href="/guias/modelos-ia-precos">preços dos modelos de IA</Link>.</p>
    </ToolPage>
  );
}
