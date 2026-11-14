export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
  tech: string[];
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
  },
];

export const featuredWork = [
  {
    title: "Requirements Traceability LLM",
    blurb:
      "Llama 3.2 + IBM DOORS workflow that maps and validates requirements traceability for ADAS programs.",
    tags: ["LLM", "DOORS", "Systems Engineering"],
  },
  {
    title: "EO/IR Drone Simulation",
    blurb:
      "Unreal Engine 5 electro-optical / infrared simulation environments for perception training and eval.",
    tags: ["UE5", "EO/IR", "Perception"],
  },
  {
    title: "Parking Assistance SIL",
    blurb:
      "System-in-the-loop Unreal environments for parking-assist ADAS validation.",
    tags: ["ADAS", "Simulation", "SIL"],
  },
  {
    title: "Octopus / Audionostics",
    blurb:
      "Patented engine-sound diagnostics tool for acoustic anomaly detection.",
    tags: ["Patented", "Diagnostics", "Audio"],
  },
] as const;
