"use client";

import data from "@/data/psu-components.json";
import { useState } from "react";

/** Placa-mãe, memória, SSD, ventoinhas e USB: estimativa do The Zero, não dado de fabricante. */
export const REST_OF_SYSTEM_W = 75;
/** Fonte trabalhando por volta de 60% da capacidade: folga pra picos, ruído e eficiência. */
export const TARGET_LOAD = 0.6;

export function recommendPsu(cpuW: number, gpuW: number, vendorSystemW: number) {
  const estimate = cpuW + gpuW + REST_OF_SYSTEM_W;
  const byHeadroom = Math.ceil(estimate / TARGET_LOAD / 50) * 50;
  return { estimate, byHeadroom, recommended: Math.max(byHeadroom, vendorSystemW) };
}

export function PsuCalculator() {
  const [gpu, setGpu] = useState(data.gpus[6].name);
  const [cpu, setCpu] = useState(data.cpus[0].name);
  const [customCpu, setCustomCpu] = useState(125);
  const gpuRow = data.gpus.find((g) => g.name === gpu)!;
  const cpuRow = data.cpus.find((c) => c.name === cpu);
  const cpuW = cpuRow ? cpuRow.watts : customCpu;
  const r = recommendPsu(cpuW, gpuRow.watts, gpuRow.systemW);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Placa de vídeo
          <select className="mt-1 w-full rounded border border-border bg-bg p-2" value={gpu} onChange={(e) => setGpu(e.target.value)}>
            {data.gpus.map((g) => (
              <option key={g.name}>{g.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Processador
          <select className="mt-1 w-full rounded border border-border bg-bg p-2" value={cpu} onChange={(e) => setCpu(e.target.value)}>
            {data.cpus.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
            <option value="outro">Outro (digite o consumo)</option>
          </select>
        </label>
        {!cpuRow ? (
          <label className="text-sm">
            Consumo do processador em W (TDP ou Processor Base/Turbo Power, na página do fabricante)
            <input
              type="number"
              min={15}
              max={400}
              className="mt-1 w-full rounded border border-border bg-bg p-2"
              value={customCpu}
              onChange={(e) => setCustomCpu(Number(e.target.value) || 0)}
            />
          </label>
        ) : null}
      </div>
      <div className="mt-6 rounded-lg border border-border p-4">
        <p className="text-2xl font-extrabold">Fonte recomendada: {r.recommended} W</p>
        <p className="mt-2 text-sm text-muted">
          Estimativa de consumo: {cpuW} W (processador) + {gpuRow.watts} W (placa) + {REST_OF_SYSTEM_W} W (resto do PC,
          estimativa nossa) = {r.estimate} W. Com a fonte a ~60% da capacidade: {r.byHeadroom} W. O fabricante da placa
          pede {gpuRow.systemW} W de sistema. Fica o maior dos dois.
        </p>
        <p className="mt-2 text-sm">
          Fontes:{" "}
          <a href={gpuRow.source} target="_blank" rel="noopener noreferrer">página oficial da placa</a>
          {cpuRow ? (
            <>
              {" · "}
              <a href={cpuRow.source} target="_blank" rel="noopener noreferrer">página oficial do processador</a>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
