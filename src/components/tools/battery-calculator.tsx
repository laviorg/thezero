"use client";

import data from "@/data/handhelds.json";
import { useState } from "react";

const PRESETS = data.items.filter((i) => typeof i.wh === "number");

export function BatteryCalculator() {
  const [preset, setPreset] = useState(PRESETS[0]?.name ?? "");
  const [wh, setWh] = useState(PRESETS[0]?.wh ?? 50);
  const [watts, setWatts] = useState(15);
  const hours = watts > 0 ? wh / watts : 0;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const field = "mt-1 w-full rounded border border-border bg-bg p-2 tabular-nums";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">Portátil
          <select className={field} value={preset} onChange={(e) => {
            setPreset(e.target.value);
            const row = PRESETS.find((p) => p.name === e.target.value);
            if (row?.wh) setWh(row.wh);
          }}>
            {PRESETS.map((p) => <option key={p.name}>{p.name}</option>)}
            <option value="outro">Outro (digite os Wh)</option>
          </select>
        </label>
        <label className="text-sm">Bateria (Wh)
          <input type="number" min={1} step="0.01" className={field} value={wh} onChange={(e) => { setWh(Number(e.target.value) || 0); setPreset("outro"); }} />
        </label>
        <label className="text-sm">Consumo do aparelho inteiro (W)
          <input type="number" min={1} max={60} className={field} value={watts} onChange={(e) => setWatts(Number(e.target.value) || 0)} />
        </label>
      </div>
      <div className="mt-6 rounded-lg border border-border p-4 font-mono text-sm tabular-nums">
        <p>{wh} Wh ÷ {watts} W = <strong className="text-base">{h} h {String(m).padStart(2, "0")} min</strong></p>
        <p className="mt-2 font-sans text-xs text-muted">
          Estimativa teórica. A bateria real entrega um pouco menos que a capacidade nominal, e o consumo muda com brilho da tela, Wi-Fi, ventoinha e o jogo. Use o consumo do sistema todo (TDP do chip + tela + resto), não só o TDP.
        </p>
      </div>
    </div>
  );
}
