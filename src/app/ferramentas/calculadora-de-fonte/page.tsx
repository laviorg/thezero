import { PsuCalculator, REST_OF_SYSTEM_W } from "@/components/tools/psu-calculator";
import { ToolPage, type ToolMeta } from "@/components/tools/tool-page";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const meta: ToolMeta = {
  path: "/ferramentas/calculadora-de-fonte",
  title: "Calculadora de fonte: quantos watts seu PC precisa",
  description: "Calcule a fonte do PC com o consumo oficial da placa de vídeo e do processador, folga pra picos e a recomendação do fabricante.",
  lede: "Escolha a placa de vídeo e o processador. A conta usa o consumo publicado pelo fabricante, soma o resto do PC e deixa a fonte trabalhando com folga.",
  cover: "/images/pages/calculadora-de-fonte.png",
  coverAlt: "Arte com o texto Calculadora de fonte e a marca The Zero sobre fundo escuro",
  updatedIso: "2026-10-14T20:00:00-03:00",
};

export const metadata: Metadata = buildPageMetadata({ title: meta.title, description: meta.description, path: meta.path, imagePath: meta.cover, imageAlt: meta.coverAlt });

export default function Page() {
  return (
    <ToolPage meta={meta}>
      <PsuCalculator />
      <h2>De onde vêm os números</h2>
      <ul>
        <li>Placa de vídeo: Total Graphics Power (NVIDIA) ou Typical Board Power (AMD) e a potência de sistema recomendada, tirados da página oficial de cada placa em 14/10/2026. Modelos de parceiros com overclock de fábrica podem gastar mais: confira a página do modelo exato.</li>
        <li>Processador: TDP padrão da página oficial da AMD. Pra outros processadores, digite o valor da página do fabricante (na Intel, use o Maximum Turbo Power pra ficar do lado seguro).</li>
        <li>Resto do PC: {REST_OF_SYSTEM_W} W pra placa-mãe, memória, SSD, ventoinhas e USB. É uma estimativa nossa, não dado de fabricante.</li>
        <li>Folga: a conta põe a fonte perto de 60% da capacidade, o que absorve picos rápidos da placa de vídeo e mantém a fonte na faixa de boa eficiência. Se o fabricante da placa pedir mais, vale o número dele.</li>
      </ul>
      <h2>Watts não é tudo</h2>
      <p>
        Uma fonte genérica de 650 W pode entregar menos que uma boa de 550 W. Prefira marca conhecida, certificação 80 Plus (Bronze pra cima) e os conectores que a placa pede. Mais no guia{" "}
        <Link href="/noticia/fonte-650w-80-plus-o-que-nao-economizar">fonte 650 W: onde não economizar</Link> e em{" "}
        <Link href="/noticia/fonte-rtx-4060-e-4070-quantos-watts">quantos watts pra RTX 4060 e 4070</Link>.
      </p>
    </ToolPage>
  );
}
