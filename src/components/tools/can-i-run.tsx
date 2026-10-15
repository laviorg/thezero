"use client";

import games from "@/data/game-requirements.json";
import hw from "@/data/hardware-scores.json";
import { useMemo, useState } from "react";

type Verdict = "acima" | "entre" | "abaixo";

function verdict(score: number, min: number, rec: number): Verdict {
  if (score >= rec) return "acima";
  if (score >= min) return "entre";
  return "abaixo";
}

const LABEL: Record<Verdict, string> = {
  acima: "Atende o recomendado",
  entre: "Entre o mínimo e o recomendado",
  abaixo: "Abaixo do mínimo",
};

export function CanIRun() {
  const [cpu, setCpu] = useState(hw.cpus[0].name);
  const [gpu, setGpu] = useState(hw.gpus[0].name);
  const [ram, setRam] = useState(16);
  const cpuRow = hw.cpus.find((c) => c.name === cpu)!;
  const gpuRow = hw.gpus.find((g) => g.name === gpu)!;

  const rows = useMemo(
    () =>
      games.games.map((game) => {
        const { min, rec } = game.levels;
        const g = verdict(gpuRow.score, min.gpuScore!, rec.gpuScore!);
        const c = verdict(cpuRow.score, min.cpuScore!, rec.cpuScore!);
        const r: Verdict = ram >= rec.ramGB ? "acima" : ram >= min.ramGB ? "entre" : "abaixo";
        const order: Verdict[] = ["abaixo", "entre", "acima"];
        const worst = order[Math.min(order.indexOf(g), order.indexOf(c), order.indexOf(r))];
        return { game, g, c, r, worst };
      }),
    [cpuRow, gpuRow, ram],
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          Processador
          <select className="mt-1 w-full rounded border border-border bg-bg p-2" value={cpu} onChange={(e) => setCpu(e.target.value)}>
            {hw.cpus.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Placa de vídeo
          <select className="mt-1 w-full rounded border border-border bg-bg p-2" value={gpu} onChange={(e) => setGpu(e.target.value)}>
            {hw.gpus.map((g) => (
              <option key={g.name}>{g.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Memória RAM
          <select className="mt-1 w-full rounded border border-border bg-bg p-2" value={ram} onChange={(e) => setRam(Number(e.target.value))}>
            {[4, 8, 12, 16, 32, 64].map((n) => (
              <option key={n} value={n}>
                {n} GB
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-muted">
        <strong>Estimativa.</strong> Seu processador: {cpuRow.score.toLocaleString("pt-BR")} pontos no{" "}
        <a href={cpuRow.source} target="_blank" rel="noopener noreferrer">CPU Mark</a>. Sua placa:{" "}
        {gpuRow.score.toLocaleString("pt-BR")} pontos no{" "}
        <a href={gpuRow.source} target="_blank" rel="noopener noreferrer">G3D Mark</a> (PassMark).
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Jogo</th>
              <th>Estimativa</th>
              <th>Placa / CPU / RAM</th>
              <th>Requisitos oficiais (Steam)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ game, g, c, r, worst }) => (
              <tr key={game.id}>
                <td>{game.name}</td>
                <td>
                  <strong>{LABEL[worst]}</strong>
                </td>
                <td className="text-sm">
                  Placa: {LABEL[g]}
                  <br />
                  CPU: {LABEL[c]}
                  <br />
                  RAM: {LABEL[r]}
                </td>
                <td className="text-sm">
                  Mínimo: {game.levels.min.gpu} ({game.levels.min.gpuScore?.toLocaleString("pt-BR")}), {game.levels.min.cpu} (
                  {game.levels.min.cpuScore?.toLocaleString("pt-BR")}), {game.levels.min.ramGB} GB
                  <br />
                  Recomendado: {game.levels.rec.gpu} ({game.levels.rec.gpuScore?.toLocaleString("pt-BR")}), {game.levels.rec.cpu} (
                  {game.levels.rec.cpuScore?.toLocaleString("pt-BR")}), {game.levels.rec.ramGB} GB
                  {game.note ? <><br />{game.note}</> : null}
                  <br />
                  <a href={game.source} target="_blank" rel="noopener noreferrer">página na Steam</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
