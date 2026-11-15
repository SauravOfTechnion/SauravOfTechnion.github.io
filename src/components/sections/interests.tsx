"use client";

import { useState } from "react";
import {
  MachineLearningMark,
  PhysicalAiMark,
  ReinforcementMark,
  ViolinMark,
} from "@/components/interest-art";
import { interests } from "@/data/interests";
import { ObjectLab } from "@/components/object-lab";
import type { SculptureKind } from "@/lib/sculptures";

const marks = {
  violin: ViolinMark,
  "physical-ai": PhysicalAiMark,
  "machine-learning": MachineLearningMark,
  "reinforcement-learning": ReinforcementMark,
} as const;

const lensToSculpture: Record<(typeof interests)[number]["id"], SculptureKind> = {
  violin: "violin",
  "physical-ai": "flight",
  "machine-learning": "neural",
  "reinforcement-learning": "learning",
};

export function Interests() {
  const [activeKind, setActiveKind] = useState<SculptureKind>("violin");

  return (
    <section
      id="interests"
      className="section-shell interests"
      aria-labelledby="interests-title"
    >
      <div className="manifesto">
        <p className="chapter-label">The through-line</p>
        <h2 id="interests-title">
          A string finds its resonance.
          <br />
          An aircraft finds its path.
          <br />A machine learns its world.
        </h2>
        <p>
          Different systems. The same beautiful problem: sensing what is happening,
          deciding what comes next, and learning from the answer.
        </p>
      </div>
      <div className="instrument-chapter">
        <div className="section-head">
          <div>
            <p className="chapter-label">Beyond the equations</p>
            <h2>
              It starts
              <br />
              with listening.
            </h2>
            <p className="section-lede">
              From the resonance of a string to a machine learning to navigate. These are
              the worlds I keep coming back to — and the 3D instruments that embody them.
            </p>
          </div>
          <p className="section-aside">
            Music taught me to listen. Engineering taught me to ask why. Select any pillar
            below or in the studio switcher to inspect its 3D geometry.
          </p>
        </div>
        <ObjectLab activeKind={activeKind} onKindChange={setActiveKind} />
      </div>
      <div className="interest-grid">
        {interests.map((item, idx) => {
          const Mark = marks[item.id];
          const mappedKind = lensToSculpture[item.id];
          const isActive = activeKind === mappedKind;
          return (
            <article
              key={item.id}
              id={item.id}
              className={`interest-lens${isActive ? " is-active" : ""}`}
              data-tone={item.tone}
              onClick={() => setActiveKind(mappedKind)}
            >
              <div className="interest-lens-head">
                <span className="interest-index">0{idx + 1}</span>
                <button
                  type="button"
                  className="interest-sync-btn"
                  aria-pressed={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveKind(mappedKind);
                  }}
                >
                  {isActive ? "Active in 3D stage" : "Load in 3D stage ↑"}
                </button>
              </div>
              <div className="interest-art">
                <Mark title={item.title} />
              </div>
              <h3>{item.title}</h3>
              <p className="interest-line">{item.line}</p>
              <p>{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
