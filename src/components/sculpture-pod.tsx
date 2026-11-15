"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { GoldenSpiral } from "@/components/golden-spiral";
import type { SculptureKind } from "@/lib/sculptures";

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

export type PodMode = {
  kind: SculptureKind;
  shortLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  telemetry: string[];
};

type SculpturePodProps = {
  kind: SculptureKind;
  badge: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  variant?: "experience" | "orbit" | "hero";
  telemetry?: string[];
  modes?: PodMode[];
};

export function SculpturePod({
  kind,
  badge,
  title,
  subtitle,
  actionLabel,
  variant = "experience",
  telemetry,
  modes,
}: SculpturePodProps) {
  const [selectedKind, setSelectedKind] = useState<SculptureKind>(kind);
  const [paused, setPaused] = useState(false);
  const [impulse, setImpulse] = useState(0);
  const [reset, setReset] = useState(0);

  const activeMode = modes?.find((m) => m.kind === selectedKind);
  const currentKind = activeMode ? activeMode.kind : kind;
  const currentBadge = activeMode ? activeMode.badge : badge;
  const currentTitle = activeMode ? activeMode.title : title;
  const currentSubtitle = activeMode ? activeMode.subtitle : subtitle;
  const currentAction = activeMode ? activeMode.actionLabel : actionLabel;
  const currentTelemetry = activeMode ? activeMode.telemetry : telemetry;

  return (
    <div className={`sculpture-pod sculpture-pod--${variant}`} data-kind={currentKind}>
      <div className="pod-head">
        <span className="pod-badge">
          <i aria-hidden="true" />
          {currentBadge}
        </span>
        <span className="pod-hint">3D · Drag to inspect</span>
      </div>

      <div className="pod-viewport">
        <div className="pod-rings" aria-hidden="true">
          <span />
          <span />
        </div>
        <GuidanceStage
          kind={currentKind}
          paused={paused}
          impulse={impulse}
          reset={reset}
          label={`Interactive 3D sculpture: ${currentTitle}`}
        />
        <div className="pod-tools">
          <button
            type="button"
            onClick={() => setReset((v) => v + 1)}
            aria-label={`Reset ${currentTitle} 3D view`}
            title="Reset rotation"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            aria-label={paused ? `Resume ${currentTitle} motion` : `Pause ${currentTitle} motion`}
            title={paused ? "Resume motion" : "Pause motion"}
          >
            {paused ? "▷" : "Ⅱ"}
          </button>
        </div>
      </div>

      {modes && modes.length > 1 ? (
        <div className="pod-modes" role="group" aria-label="Switch Hero 3D sculpture">
          {modes.map((m) => (
            <button
              key={m.kind}
              type="button"
              aria-pressed={currentKind === m.kind}
              onClick={() => {
                setSelectedKind(m.kind);
                setImpulse((v) => v + 1);
              }}
            >
              {m.shortLabel}
            </button>
          ))}
        </div>
      ) : null}

      {currentTelemetry && currentTelemetry.length > 0 ? (
        <div className="pod-telemetry" aria-label="Instrument telemetry">
          {currentTelemetry.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}

      <div className="pod-foot">
        <div className="pod-meta">
          <p className="pod-title">{currentTitle}</p>
          <p className="pod-subtitle">{currentSubtitle}</p>
        </div>
        <button
          type="button"
          className="pod-action"
          onClick={() => setImpulse((v) => v + 1)}
        >
          <span aria-hidden="true">✧</span>
          {currentAction}
        </button>
      </div>
    </div>
  );
}
