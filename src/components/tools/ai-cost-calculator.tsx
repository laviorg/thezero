"use client";

import data from "@/data/ai-api-prices.json";
import { useState } from "react";

const usd = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", maximumFractionDigits: 4 });
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Cada turno reenvia o histórico: o turno n paga como entrada o prompt
 * fixo + n vezes a mensagem nova + (n − 1) respostas anteriores.
 */
export function conversationCost(o: {
  systemTokens: number; textIn: number; audioSec: number; videoTokens: number; outTokens: number; turns: number;
  price: { input: { text: number; audio: number; video: number }; output: number }; audioTps: number;
}) {
  let inText = 0, inAudio = 0, inVideo = 0;
  for (let n = 1; n <= o.turns; n++) {
    inText += o.systemTokens + n * o.textIn + (n - 1) * o.outTokens;
    inAudio += n * o.audioSec * o.audioTps;
    inVideo += n * o.videoTokens;
  }
  const out = o.turns * o.outTokens;
  const cost = (inText * o.price.input.text + inAudio * o.price.input.audio + inVideo * o.price.input.video + out * o.price.output) / 1e6;
  return { inText, inAudio, inVideo, out, cost };
}

export function AiCostCalculator() {
  const [model, setModel] = useState(data.models[0].id);
  const [systemTokens, setSystem] = useState(1000);
  const [textIn, setTextIn] = useState(300);
  const [audioSec, setAudio] = useState(0);
  const [videoTokens, setVideo] = useState(0);
  const [outTokens, setOut] = useState(500);
  const [turns, setTurns] = useState(10);
  const [conversations, setConvs] = useState(1000);
  const row = data.models.find((m) => m.id === model)!;
  const r = conversationCost({ systemTokens, textIn, audioSec, videoTokens, outTokens, turns, price: row, audioTps: data.audioTokensPerSecond });
  const total = r.cost * conversations;
  const field = "mt-1 w-full rounded border border-border bg-bg p-2 tabular-nums";
  const num = (set: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(Math.max(0, Number(e.target.value) || 0));

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">Modelo
          <select className={field} value={model} onChange={(e) => setModel(e.target.value)}>
            {data.models.map((m) => <option key={m.id} value={m.id}>{m.provider} {m.id}</option>)}
          </select>
        </label>
        <label className="text-sm">Turnos por conversa<input type="number" className={field} value={turns} onChange={num(setTurns)} /></label>
        <label className="text-sm">Prompt fixo (tokens, reenviado a cada turno)<input type="number" className={field} value={systemTokens} onChange={num(setSystem)} /></label>
        <label className="text-sm">Texto do usuário por turno (tokens)<input type="number" className={field} value={textIn} onChange={num(setTextIn)} /></label>
        <label className="text-sm">Áudio por turno (segundos; {data.audioTokensPerSecond} tokens/s)<input type="number" className={field} value={audioSec} onChange={num(setAudio)} /></label>
        <label className="text-sm">Vídeo/imagem por turno (tokens)<input type="number" className={field} value={videoTokens} onChange={num(setVideo)} /></label>
        <label className="text-sm">Resposta por turno (tokens, inclui raciocínio)<input type="number" className={field} value={outTokens} onChange={num(setOut)} /></label>
        <label className="text-sm">Conversas por mês<input type="number" className={field} value={conversations} onChange={num(setConvs)} /></label>
      </div>
      <div className="mt-6 rounded-lg border border-border p-4 font-mono text-sm tabular-nums">
        <p>Entrada: {r.inText.toLocaleString("pt-BR")} texto · {r.inAudio.toLocaleString("pt-BR")} áudio · {r.inVideo.toLocaleString("pt-BR")} vídeo</p>
        <p>Saída: {r.out.toLocaleString("pt-BR")} tokens</p>
        <p className="mt-2">Por conversa: {usd.format(r.cost)} ≈ {brl.format(r.cost * data.fx.usdBrl)}</p>
        <p className="text-base font-semibold">Por mês: {usd.format(total)} ≈ {brl.format(total * data.fx.usdBrl)}</p>
        <p className="mt-2 font-sans text-xs text-muted">
          Preço por 1 milhão de tokens: entrada {usd.format(row.input.text)} (texto), {usd.format(row.input.audio)} (áudio), {usd.format(row.input.video)} (vídeo); saída {usd.format(row.output)}. Fonte: <a className="underline" href={row.source}>página oficial de preços</a>, conferida em {row.checked.split("-").reverse().join("/")}. {"note" in row ? row.note : ""} Dólar: {data.fx.label}. Sem cache de contexto nem Batch, que baixam o custo.
        </p>
      </div>
    </div>
  );
}
