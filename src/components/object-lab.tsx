"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { SculptureKind } from "@/lib/sculptures";
import { GoldenSpiral } from "@/components/golden-spiral";

const GuidanceStage = dynamic(
  () => import("@/components/guidance-stage").then((module) => module.GuidanceStage),
  {
    ssr: false,
    loading: () => (
      <div className="stage-fallback">
        <GoldenSpiral />
      </div>
    ),
  },
);

export const labObjects: {
  kind: SculptureKind;
  label: string;
  title: string;
  detail: string;
  action: string;
  symbol: string;
  group: "core" | "domain";
}[] = [
  {
    kind: "violin",
    label: "Resonance",
    title: "The art of a feedback loop",
    detail: "Original 355 mm Blender spruce & flamed-maple violin with separate bow.",
    action: "Bow the strings",
    symbol: "♮",
    group: "core",
  },
  {
    kind: "flight",
    label: "Flight",
    title: "Guidance under uncertainty",
    detail: "Three-axis attitude gimbals, swept-wing airframe, and lookahead trajectory.",
    action: "Disturb the flight",
    symbol: "⌁",
    group: "core",
  },
  {
    kind: "neural",
    label: "Intelligence",
    title: "Connections become understanding",
    detail: "Iridescent world-model core surrounded by a 72-node synaptic sphere.",
    action: "Send a signal",
    symbol: "✳",
    group: "core",
  },
  {
    kind: "learning",
    label: "Learning",
    title: "The world answers back",
    detail: "Closed-loop policy knot with five autonomous trajectory agents.",
    action: "Nudge the loop",
    symbol: "∞",
    group: "core",
  },
  {
    kind: "jpmorgan",
    label: "Finance",
    title: "Octagonal vault & yield architecture",
    detail: "JPMorgan-inspired 8-wedge emblem, quant candlesticks, and TrustGPT ledger.",
    action: "Pulse yield & ledger",
    symbol: "◈",
    group: "domain",
  },
  {
    kind: "semiconductor",
    label: "Silicon",
    title: "Edge AI wafer & 64-pin Tensor SoC",
    detail: "4×4 TensorRT compute cores, gold QFP pins, and EO/IR optical reticle.",
    action: "Clock tensor cores",
    symbol: "⊞",
    group: "domain",
  },
  {
    kind: "jlr",
    label: "Automotive",
    title: "Aero-coupe & 360° ADAS LiDAR",
    detail: "Sculpted grand-tourer silhouette, alloy wheels, and Audionostics wave ring.",
    action: "Sweep ADAS LiDAR",
    symbol: "◎",
    group: "domain",
  },
];

type ObjectLabProps = {
  activeKind?: SculptureKind;
  onKindChange?: (kind: SculptureKind) => void;
};

export function ObjectLab({ activeKind, onKindChange }: ObjectLabProps) {
  const [internalKind, setInternalKind] = useState<SculptureKind>("violin");
  const [paused, setPaused] = useState(false);
  const [impulse, setImpulse] = useState(0);
  const [reset, setReset] = useState(0);

  const currentKind = activeKind ?? internalKind;
  const object = labObjects.find((o) => o.kind === currentKind) ?? labObjects[0];

  const handleSelect = (kind: SculptureKind) => {
    setInternalKind(kind);
    onKindChange?.(kind);
    setImpulse((v) => v + 1);
  };

  return (
    <div className="object-lab" data-object={object.kind}>
      <div className="lab-heading">
        <span>
          <i aria-hidden="true" /> Interactive 3D instrument study
        </span>
        <span className="lab-edition">Drag to turn in your hands · 7 sculptures</span>
      </div>
      <div className="lab-viewport">
        <div className="orbital-backdrop" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <GuidanceStage kind={object.kind} paused={paused} impulse={impulse} reset={reset} />
        <div className="lab-orientation" aria-hidden="true">
          <span>y</span>
          <svg viewBox="0 0 50 50">
            <path d="M25 5v23l18 10M25 28L7 38" />
          </svg>
          <span>x / z</span>
        </div>
        <div className="lab-instruction">
          <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 7h14M6 4 3 7l3 3m8-6 3 3-3 3M5 14h10" />
          </svg>{" "}
          Drag to rotate · Arrow keys
        </div>
        <div className="lab-tools">
          <button
            type="button"
            onClick={() => setReset((value) => value + 1)}
            aria-label="Reset sculpture rotation"
            title="Reset view"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? "Resume sculpture motion" : "Pause sculpture motion"}
            title={paused ? "Resume motion" : "Pause motion"}
          >
            {paused ? "▷" : "Ⅱ"}
          </button>
        </div>
      </div>
      <div className="lab-caption" aria-live="polite" aria-atomic="true">
        <div>
          <h2>{object.title}</h2>
          <p>{object.detail}</p>
        </div>
      </div>
      <div className="lab-switcher" role="group" aria-label="Choose a 3D sculpture">
        {labObjects.map((item) => (
          <button
            key={item.kind}
            type="button"
            aria-pressed={object.kind === item.kind}
            onClick={() => handleSelect(item.kind)}
            data-group={item.group}
          >
            <span aria-hidden="true">{item.symbol}</span>
            {item.label}
          </button>
        ))}
      </div>
      <button
        className="lab-activate"
        type="button"
        onClick={() => setImpulse((value) => value + 1)}
      >
        <span aria-hidden="true">✧</span>
        {object.action}
        <span className="activate-hint">Trigger 3D response</span>
      </button>
    </div>
  );
}
