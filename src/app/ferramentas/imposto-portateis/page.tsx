import { ImportTaxCalculator } from "@/components/tools/import-tax-calculator";
import { ToolPage, type ToolMeta } from "@/components/tools/tool-page";
import { importTax } from "@/lib/import-tax";
import { buildPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

const meta: ToolMeta = {
  path: "/ferramentas/imposto-portateis",
  title: "Calculadora de imposto pra importar portátil",
  description: "Quanto custa importar um console ou PC portátil: Imposto de Importação do Remessa Conforme e ICMS do seu estado, com a fonte oficial de cada alíquota.",
  lede: "Digite o preço em dólar, o frete e o seu estado. A conta segue a regra da Receita Federal e a tabela de ICMS dos estados, com a data de cada fonte.",
  cover: "/images/pages/imposto-portateis.png",
  coverAlt: "Arte com o texto Imposto de portáteis e a marca The Zero sobre fundo escuro",
  updatedIso: "2026-10-15T20:00:00-03:00",
  faq: [
    { q: "Qual o imposto pra importar um portátil acima de US$ 50?", a: "Em loja certificada no Remessa Conforme, para pessoa física, o Imposto de Importação é de 60% sobre o valor aduaneiro (produto + frete + seguro), com desconto de US$ 30 no imposto. Fora do programa, é 60% sem desconto. Regra da Receita Federal para declarações a partir de 12/05/2026." },
    { q: "Como o ICMS é calculado?", a: "O ICMS é cobrado \"por dentro\": a base é (produto + frete + seguro + II) dividida por (1 − alíquota). A alíquota vai de 17% a 20% conforme o estado, segundo a tabela do Comsefaz." },
    { q: "Qual dólar a calculadora usa?", a: "Por padrão, a PTAX de venda do Banco Central do dia indicado na página. A Receita usa a taxa de câmbio do dia do registro, então o valor final pode mudar um pouco. Você pode trocar o dólar no campo." },
    { q: "Compras até US$ 50 pagam imposto?", a: "Em loja do Remessa Conforme, o II é zero até US$ 50 de valor aduaneiro desde 12/05/2026, mas o ICMS do estado continua sendo cobrado." },
  ],
};

export const metadata: Metadata = buildPageMetadata({ title: meta.title, description: meta.description, path: meta.path, imagePath: meta.cover, imageAlt: meta.coverAlt });

const pct = (v: number) => `${Math.round(v * 100)}%`;

export default function Page() {
  const rates = Object.entries(importTax.icms.rates).sort(([a], [b]) => a.localeCompare(b));
  return (
    <ToolPage meta={meta}>
      <ImportTaxCalculator />
      <h2>De onde vêm os números</h2>
      <ul>
        <li>Imposto de Importação: <a href={importTax.ii.source}>{importTax.ii.sourceLabel}</a>, conferido em 15/10/2026. {importTax.ii.regime}.</li>
        <li>ICMS por estado: <a href={importTax.icms.source}>{importTax.icms.sourceLabel}</a>, conferido em 15/10/2026. {importTax.icms.notes.PA}</li>
        <li>Dólar: {importTax.fx.label}.</li>
      </ul>
      <h2>ICMS de importação por estado</h2>
      <table>
        <thead><tr><th>UF</th><th>Alíquota</th></tr></thead>
        <tbody>
          {rates.map(([uf, r]) => <tr key={uf}><td>{uf}</td><td className="tabular-nums">{pct(r)}</td></tr>)}
        </tbody>
      </table>
      <p>A conta é estimativa: não inclui taxa de despacho dos Correios ou da transportadora nem variação do câmbio até o registro da declaração.</p>
    </ToolPage>
  );
}
