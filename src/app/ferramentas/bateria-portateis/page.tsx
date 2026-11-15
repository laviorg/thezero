import { BatteryCalculator } from "@/components/tools/battery-calculator";
import { ToolPage, type ToolMeta } from "@/components/tools/tool-page";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const meta: ToolMeta = {
  path: "/ferramentas/bateria-portateis",
  title: "Calculadora de bateria de console portátil",
  description: "Quanto dura a bateria do Steam Deck, ROG Ally, Legion Go e outros portáteis: capacidade oficial em Wh dividida pelo consumo que você escolher.",
  lede: "Escolha o portátil ou digite os Wh, ajuste o consumo e veja a autonomia teórica. É a mesma conta que fazemos nas matérias.",
  cover: "/images/pages/bateria-portateis.png",
  coverAlt: "Arte com o texto Bateria de portáteis e a marca The Zero sobre fundo escuro",
  updatedIso: "2026-10-15T20:00:00-03:00",
  faq: [
    { q: "Como calcular a duração da bateria de um portátil?", a: "Divida a capacidade em watt-hora (Wh) pelo consumo do aparelho inteiro em watts (W). 50 Wh a 15 W dão cerca de 3 h 20 min. É uma estimativa: a bateria real entrega um pouco menos que o valor nominal." },
    { q: "Posso usar o TDP do processador como consumo?", a: "Não sozinho. O TDP é só do chip. Tela, memória, Wi-Fi e ventoinha somam alguns watts, então use um valor acima do TDP configurado." },
    { q: "De onde vêm os Wh da lista?", a: "Das matérias do The Zero sobre cada aparelho, que citam a ficha oficial do fabricante. Se o seu modelo não está na lista, digite os Wh da página do fabricante." },
  ],
};

export const metadata: Metadata = buildPageMetadata({ title: meta.title, description: meta.description, path: meta.path, imagePath: meta.cover, imageAlt: meta.coverAlt });

export default function Page() {
  return (
    <ToolPage meta={meta}>
      <BatteryCalculator />
      <h2>Compare os portáteis</h2>
      <p>Tela, chip, bateria e preço lado a lado estão em <Link href="/guias/consoles-portateis">consoles portáteis: a tabela</Link>.</p>
    </ToolPage>
  );
}
