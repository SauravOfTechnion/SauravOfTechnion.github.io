import { FlowField } from "@/components/flow-field";
import { SculpturePod, type PodMode } from "@/components/sculpture-pod";
import { profile } from "@/data/profile";

const heroModes: PodMode[] = [
  {
    kind: "flight",
    shortLabel: "⌁ Flight",
    badge: "GUIDANCE ENVELOPE · L1 LOOP",
    title: "Gyroscopic Flight & Attitude Stage",
    subtitle: "3-axis gimbal horizon · swept-wing UAV · orbital telemetry",
    actionLabel: "Disturb flight envelope",
    telemetry: ["PITCH / ROLL GIMBALS", "VARIABLE L1", "φ = 1.618"],
  },
  {
    kind: "jpmorgan",
    shortLabel: "◈ Finance",
    badge: "JPM · ASSET & WEALTH",
    title: "Octagonal Vault & Yield Curve",
    subtitle: "8-wedge crest · quant candlesticks · TrustGPT ledger",
    actionLabel: "Pulse yield & ledger",
    telemetry: ["AWM · TRUSTGPT", "GROUNDED RAG", "AUDIT TRAIL"],
  },
  {
    kind: "semiconductor",
    shortLabel: "⊞ Silicon",
    badge: "BHARATSEMI · EDGE SILICON",
    title: "64-Pin Tensor SoC & Wafer Die",
    subtitle: "4×4 TensorRT cores · gold QFP pins · EO/IR reticle",
    actionLabel: "Clock tensor cores",
    telemetry: ["JETSON ORIN", "TENSORRT FP16", "EO/IR RETICLE"],
  },
  {
    kind: "jlr",
    shortLabel: "◎ Automotive",
    badge: "JLR · ADAS ENGINEERING",
    title: "Aero-Coupe & 360° LiDAR Field",
    subtitle: "Fastback silhouette · SIL ultrasonic rings · Audionostics",
    actionLabel: "Sweep ADAS LiDAR",
    telemetry: ["UE5 SIL LOOP", "PATENTED AUDIO", "HACKATHON ’24"],
  },
  {
    kind: "violin",
    shortLabel: "♮ Violin",
    badge: "LUTHIER STUDY · 355 MM",
    title: "Studio Violin & Bow Assembly",
    subtitle: "Carved spruce & flamed maple · closed-loop acoustic feedback",
    actionLabel: "Bow the strings",
    telemetry: ["SPRUCE & MAPLE", "4 STRINGS", "CLOSED LOOP"],
  },
];

export function Hero() {
  return (
    <section id="top" className="hero landscape-hero" aria-labelledby="hero-name">
      <FlowField />
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-intro">
            <span className="intro-line" aria-hidden="true" />
            <span>{profile.name}</span>
            <span className="hero-coords" aria-hidden="true">
              32.7768° N · 35.0231° E
            </span>
          </p>
          <h1 id="hero-name">
            Give intelligence
            <br />a world to move.
          </h1>
          <p className="hero-tagline">
            Aerospace engineering. Physical intelligence.
            <br />I build systems that learn from the world,
            <br />
            and act within it.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#projects">
              Explore my work{" "}
              <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 3v14m-5-5 5 5 5-5" />
              </svg>
            </a>
            <a className="btn btn-hero-ghost" href="#experience">
              3D career timeline
            </a>
            <a className="hero-contact" href="#contact">
              Let’s connect
            </a>
          </div>
          <div className="hero-affiliation">
            <span className="affiliation-mark" aria-hidden="true">
              ⌘
            </span>
            <p>
              Next chapter: Technion
              <span>Incoming M.Sc. · Mechanical Engineering (with thesis)</span>
            </p>
          </div>
        </div>

        <div className="hero-stage-col">
          <SculpturePod
            kind="flight"
            badge={heroModes[0].badge}
            title={heroModes[0].title}
            subtitle={heroModes[0].subtitle}
            actionLabel={heroModes[0].actionLabel}
            telemetry={heroModes[0].telemetry}
            modes={heroModes}
            variant="hero"
          />
        </div>
      </div>
      <div className="hero-floor">
        <p>A study in motion, perception, and possibility.</p>
        <a href="#interests">
          Enter the field <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
