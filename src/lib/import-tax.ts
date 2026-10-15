import tax from "@/data/import-tax.json";

export const importTax = tax;
export type Uf = keyof typeof tax.icms.rates;

/** II do Remessa Conforme (PF, desde 12/05/2026) ou 60% fora do programa. Valores em US$. */
export function importDutyUsd(customsValueUsd: number, certified: boolean) {
  if (!certified) return customsValueUsd * tax.ii.naoCertificado;
  if (customsValueUsd <= tax.ii.ateUsd) return customsValueUsd * tax.ii.aliquotaAte;
  return Math.max(0, customsValueUsd * tax.ii.aliquotaAcima - tax.ii.deducaoUsd);
}

/** ICMS "por dentro": (bens + frete + seguro + II) / (1 − alíquota) × alíquota. */
export function icmsUsd(customsValueUsd: number, iiUsd: number, rate: number) {
  return ((customsValueUsd + iiUsd) / (1 - rate)) * rate;
}

export function importTotal(productUsd: number, freightUsd: number, uf: Uf, certified: boolean, fx: number) {
  const customs = productUsd + freightUsd;
  const ii = importDutyUsd(customs, certified);
  const rate = tax.icms.rates[uf];
  const icms = icmsUsd(customs, ii, rate);
  const totalUsd = customs + ii + icms;
  return { customs, ii, icms, rate, totalUsd, totalBrl: totalUsd * fx };
}
