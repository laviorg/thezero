/**
 * Atualiza src/data/fx.json com a PTAX de venda mais recente do Banco Central
 * (API Olinda, grátis). Sem rede, mantém o arquivo anterior com a data dele.
 */
import fs from "node:fs";

const file = "src/data/fx.json";
const pad = (n) => String(n).padStart(2, "0");
const fmt = (d) => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${d.getFullYear()}`;
const end = new Date();
const start = new Date(end.getTime() - 10 * 86400000);
const url =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@i,dataFinalCotacao=@f)" +
  `?@i='${fmt(start)}'&@f='${fmt(end)}'&$format=json&$select=cotacaoVenda,dataHoraCotacao`;

try {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const data = await res.json();
  const last = data.value?.at(-1);
  if (!last?.cotacaoVenda) throw new Error("sem cotação");
  const out = {
    usdBrl: last.cotacaoVenda,
    date: last.dataHoraCotacao.slice(0, 10),
    label: "PTAX de venda do Banco Central",
    source: "https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes",
    iof: { cartao: 0.035, source: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/D12499.htm", label: "Decreto nº 12.499/2025, art. 15-B, VII" },
  };
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  console.log(`fetch-fx: US$ 1 = R$ ${out.usdBrl} (${out.date})`);
} catch (error) {
  console.warn(`fetch-fx: mantendo ${file} (${error.message})`);
}
