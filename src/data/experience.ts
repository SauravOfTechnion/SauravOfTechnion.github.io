import type { SculptureKind } from "@/lib/sculptures";

export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
  tech: string[];
  subsystems: {
    code: string;
    name: string;
    detail: string;
  }[];
  sculpture: {
    kind: SculptureKind;
    badge: string;
    title: string;
    subtitle: string;
    action: string;
    telemetry: string[];
  };
};

export const experience: ExperienceItem[] = [
  {
    org: "JPMorganChase",
    role: "Applied AI Associate · Asset & Wealth Management",
    period: "Nov 2025 – Present",
    highlights: [
      "Building internal LLM agents for trust-document understanding (TrustGPT) and mortgage modification advisory.",
      "Focus on production agent tooling: grounded answers, auditability, and workflow fit for AWM operations.",
    ],
    tech: ["LLM Agents", "RAG", "Python", "Enterprise AI"],
    subsystems: [
      {
        code: "SYS · 01",
        name: "TrustGPT Fiduciary Reasoning",
        detail: "Grounded clause extraction and citation-backed synthesis across complex trust instruments.",
      },
      {
        code: "SYS · 02",
        name: "Mortgage Advisory Copilots",
        detail: "Deterministic guardrails, audit logging, and human-in-the-loop verification for AWM workflows.",
      },
    ],
    sculpture: {
      kind: "jpmorgan",
      badge: "JPM · ASSET & WEALTH",
      title: "Octagonal Vault & Yield Curve",
      subtitle: "8-wedge crest · quant candlesticks · TrustGPT ledger",
      action: "Pulse yield & ledger",
      telemetry: ["AWM · TRUSTGPT", "GROUNDED RAG", "AUDIT TRAIL"],
    },
  },
  {
    org: "BharatSemi / 3rdiTech",
    role: "Senior AI Engineer",
    period: "2024 – 2025",
    location: "India",
    highlights: [
      "Real-time object detection and tracking pipelines in C++/OpenCV/TensorRT on NVIDIA Jetson Orin.",
      "Unreal Engine 5 EO/IR drone simulation environments for perception development and evaluation.",
    ],
    tech: ["C++", "OpenCV", "TensorRT", "Jetson Orin", "Unreal Engine 5"],
    subsystems: [
      {
        code: "SYS · 01",
        name: "Jetson Orin TensorRT Runtime",
        detail: "Zero-copy C++ / CUDA / TensorRT inference pipelines for real-time edge detection & tracking.",
      },
      {
        code: "SYS · 02",
        name: "UE5 EO/IR Synthetic Range",
        detail: "Closed-loop electro-optical and thermal infrared drone flight scenes for edge model stress-testing.",
      },
    ],
    sculpture: {
      kind: "semiconductor",
      badge: "BHARATSEMI · EDGE SILICON",
      title: "64-Pin Tensor SoC & Wafer Die",
      subtitle: "4×4 TensorRT cores · gold QFP pins · EO/IR reticle",
      action: "Clock tensor cores",
      telemetry: ["JETSON ORIN", "TENSORRT FP16", "EO/IR RETICLE"],
    },
  },
  {
    org: "Jaguar Land Rover",
    role: "ADAS Systems Engineer",
    period: "2020 – 2024",
    highlights: [
      "ADAS systems engineering and Unreal Engine 5 simulation for parking assistance (system-in-the-loop).",
      "Patented Octopus / Audionostics engine-sound diagnostics tool.",
      "Requirements Traceability LLM tool connecting Llama 3.2 to DOORS for requirements engineering.",
      "Winner, JLR Global Hackathon 2024.",
    ],
    tech: ["Unreal Engine 5", "ADAS", "Llama 3.2", "DOORS", "Simulation"],
    subsystems: [
      {
        code: "SYS · 01",
        name: "UE5 Parking SIL & DOORS LLM",
        detail: "System-in-the-loop ultrasonic/LiDAR parking environments & Llama 3.2 requirements traceability.",
      },
      {
        code: "SYS · 02",
        name: "Patented Audionostics · Hackathon ’24",
        detail: "Acoustic spectral anomaly detection for powertrains & 1st Place at JLR Global Hackathon 2024.",
      },
    ],
    sculpture: {
      kind: "jlr",
      badge: "JLR · ADAS ENGINEERING",
      title: "Aero-Coupe & 360° LiDAR Field",
      subtitle: "Fastback silhouette · SIL ultrasonic rings · Audionostics",
      action: "Sweep ADAS LiDAR",
      telemetry: ["UE5 SIL LOOP", "PATENTED AUDIO", "HACKATHON ’24"],
    },
  },
];

export const featuredWork = [
  {
    index: "01",
    org: "Jaguar Land Rover",
    title: "Requirements Traceability LLM",
    blurb:
      "Llama 3.2 + IBM DOORS workflow that maps and validates requirements traceability for ADAS programs.",
    tags: ["LLM", "DOORS", "Systems Engineering"],
  },
  {
    index: "02",
    org: "BharatSemi / 3rdiTech",
    title: "EO/IR Drone Simulation",
    blurb:
      "Unreal Engine 5 electro-optical / infrared simulation environments for perception training and eval.",
    tags: ["UE5", "EO/IR", "Perception"],
  },
  {
    index: "03",
    org: "Jaguar Land Rover",
    title: "Parking Assistance SIL",
    blurb:
      "System-in-the-loop Unreal environments for parking-assist ADAS validation.",
    tags: ["ADAS", "Simulation", "SIL"],
  },
  {
    index: "04",
    org: "Jaguar Land Rover · Patented",
    title: "Octopus / Audionostics",
    blurb:
      "Patented engine-sound diagnostics tool for acoustic anomaly detection.",
    tags: ["Patented", "Diagnostics", "Audio"],
  },
] as const;
