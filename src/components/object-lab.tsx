"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { SculptureKind } from "@/lib/sculptures";
import { GoldenSpiral } from "@/components/golden-spiral";

const GuidanceStage = dynamic(() => import("@/components/guidance-stage").then((module) => module.GuidanceStage), {
  ssr: false, loading: () => <div className="stage-fallback"><GoldenSpiral /></div>,
});

const objects: { kind: SculptureKind; label: string; title: string; detail: string; action: string; symbol: string }[] = [
  { kind: "violin", label: "Resonance", title: "The art of a feedback loop", detail: "Wood, string, and a lifetime of listening.", action: "Study the resonance", symbol: "♮" },
  { kind: "flight", label: "Flight", title: "Guidance under uncertainty", detail: "A little aerospace, suspended in possibility.", action: "Disturb the flight", symbol: "⌁" },
  { kind: "neural", label: "Intelligence", title: "Connections become understanding", detail: "An imagined world model, one signal at a time.", action: "Send a signal", symbol: "✳" },
  { kind: "learning", label: "Learning", title: "The world answers back", detail: "Act, observe, update. Follow the feedback.", action: "Nudge the loop", symbol: "∞" },
];

export function ObjectLab() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [impulse, setImpulse] = useState(0);
  const [reset, setReset] = useState(0);
  const object = objects[selected];

  return <div className="object-lab" data-object={object.kind}>
    <div className="lab-heading"><span><i aria-hidden="true" /> An instrument study</span><span className="lab-edition">Drag to turn it in your hands</span></div>
    <div className="lab-viewport">
      <div className="orbital-backdrop" aria-hidden="true"><span /><span /><span /></div>
      <GuidanceStage kind={object.kind} paused={paused} impulse={impulse} reset={reset} />
      <div className="lab-orientation" aria-hidden="true"><span>y</span><svg viewBox="0 0 50 50"><path d="M25 5v23l18 10M25 28L7 38" /></svg><span>x / z</span></div>
      <div className="lab-instruction"><svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7h14M6 4 3 7l3 3m8-6 3 3-3 3M5 14h10" /></svg> Drag to explore</div>
      <div className="lab-tools">
        <button type="button" onClick={() => setReset((value) => value + 1)} aria-label="Reset sculpture rotation" title="Reset view">↺</button>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? "Resume sculpture motion" : "Pause sculpture motion"} title={paused ? "Resume motion" : "Pause motion"}>{paused ? "▷" : "Ⅱ"}</button>
      </div>
    </div>
    <div className="lab-caption" aria-live="polite" aria-atomic="true"><div><h2>{object.title}</h2><p>{object.detail}</p></div></div>
    <div className="lab-switcher" role="group" aria-label="Choose a 3D sculpture">
      {objects.map((item, index) => <button key={item.kind} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span aria-hidden="true">{item.symbol}</span>{item.label}</button>)}
    </div>
    <button className="lab-activate" type="button" onClick={() => setImpulse((value) => value + 1)}><span aria-hidden="true">✧</span>{object.action}<span className="activate-hint">Try it</span></button>
  </div>;
}
