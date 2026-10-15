import { CanIRun } from "@/components/tools/can-i-run";
import { ToolPage, type ToolMeta } from "@/components/tools/tool-page";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const meta: ToolMeta = {
  path: "/ferramentas/meu-pc-roda",
  title: "Meu PC roda? Compare seu PC com os requisitos de 11 jogos",
  description: "Escolha processador, placa de vídeo e RAM e veja uma estimativa contra os requisitos oficiais da Steam de 11 jogos, com a fonte de cada número.",
  lede: "Escolha suas peças e veja, jogo a jogo, se o PC fica abaixo do mínimo, entre o mínimo e o recomendado, ou acima. É uma estimativa: mostramos de onde vem cada número.",
  cover: "/images/pages/meu-pc-roda.png",
  coverAlt: "Arte com o texto Meu PC roda? e a marca The Zero sobre fundo escuro",
  updatedIso: "2026-10-14T20:00:00-03:00",
};

export const metadata: Metadata = buildPageMetadata({ title: meta.title, description: meta.description, path: meta.path, imagePath: meta.cover, imageAlt: meta.coverAlt });

export default function Page() {
  return (
    <ToolPage meta={meta}>
      <CanIRun />
      <h2>Como a estimativa funciona</h2>
      <ul>
        <li>Requisitos: copiados da página oficial de cada jogo na Steam (mínimo e recomendado), consultada em 14/10/2026. Quando a Steam lista mais de uma peça, usamos a primeira citada.</li>
        <li>Comparação: cada peça vira um número do PassMark (G3D Mark pra placa, CPU Mark pra processador), um agregado público de testes enviados por usuários. Se o seu número é igual ou maior que o da peça pedida pelo jogo, contamos como atendido.</li>
        <li>O resultado geral é o pior dos três (placa, processador, RAM).</li>
        <li>Limites: benchmark sintético não é FPS em jogo. Driver, resolução, VRAM, SSD e temperatura mudam o resultado. CPU Mark mede vários núcleos, e jogo depende mais de núcleo único. Use como ponto de partida, não como garantia.</li>
        <li>Requisito &quot;recomendado&quot; não tem resolução nem FPS padronizados: cada estúdio define o seu. Quando a Steam informa, aparece na nota do jogo.</li>
      </ul>
      <p>
        Vai trocar de peça? Veja a <Link href="/ferramentas/calculadora-de-fonte">calculadora de fonte</Link> e o{" "}
        <Link href="/menor-preco">menor preço do dia</Link>.
      </p>
    </ToolPage>
  );
}
