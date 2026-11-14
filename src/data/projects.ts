export type Project = {
  repo: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  featured?: boolean;
  stars?: number;
  forks?: number;
  url?: string;
  updatedAt?: string;
};

/**
 * Curated public repos from github.com/saurav997.
 * Enrich at build time via src/lib/github.ts (stars, language, live description).
 * To add a project: append an entry here — the Projects section reads this file.
 */
export const projects: Project[] = [
  {
    repo: "WorldModel",
    title: "World Models Lab",
    description:
      "Playable Ha & Schmidhuber World Models (2018): ConvVAE + LSTM-MDN + CMA-ES controller with a React lab over a PyTorch CUDA sidecar.",
    language: "TypeScript",
    tags: ["World Models", "VAE", "RL", "PyTorch"],
    featured: true,
  },
  {
    repo: "Dreamer_V3_sim",
    title: "DreamerV3 · Crafter",
    description:
      "From-scratch PyTorch DreamerV3 on the Crafter benchmark, with a browser lab for reconstructions, open-loop rollouts, and achievements.",
    language: "Python",
    tags: ["DreamerV3", "World Models", "RL"],
    featured: true,
  },
  {
    repo: "Reinforcement-Learning-tuned-LLM-Based-Code-Reviewer",
    title: "RL-tuned LLM Code Reviewer",
    description:
      "Reinforcement-learning-tuned LLM pipeline for code review: reward model, eval harness, and metrics for review quality.",
    language: "Python",
    tags: ["LLM", "RLHF", "Code Review"],
    featured: true,
  },
  {
    repo: "100DaysOfCuda",
    title: "100 Days of CUDA",
    description:
      "Day-by-day CUDA kernel practice: building GPU intuition from first principles through increasingly ambitious kernels.",
    language: "Cuda",
    tags: ["CUDA", "GPU", "Systems"],
    featured: true,
  },
  {
    repo: "stylus-lecture-notes",
    title: "Stylus Lecture Notes",
    description:
      "Tablet-first Android app: S Pen ink + lecture audio, Google Drive sync, and on-device English/Hebrew captions.",
    language: "Kotlin",
    tags: ["Android", "Compose", "On-device AI"],
  },
  {
    repo: "TranSlayed",
    title: "TranSlayed",
    description:
      "On-device WhatsApp overlay translator for Android — event-driven bubble diffing, ML Kit translation, latency-first overlays.",
    language: "Kotlin",
    tags: ["Android", "ML Kit", "Accessibility"],
  },
  {
    repo: "PDF-RAG-using-CassandraDB",
    title: "PDF RAG · Cassandra",
    description:
      "Retrieval-augmented generation over PDF corpora with Cassandra as the vector/document store.",
    language: "Python",
    tags: ["RAG", "LLM", "Cassandra"],
  },
  {
    repo: "Hinoki-for-ADHD-Friendly-Time-keeping",
    title: "Hinoki",
    description:
      "A personal desktop desk for ADHD-friendly timekeeping — calm structure for focus sessions.",
    language: "HTML",
    tags: ["Productivity", "Desktop", "UX"],
  },
  {
    repo: "Drone_Emulator",
    title: "Drone Emulator",
    description:
      "Drone emulation workspace for perception and guidance experiments.",
    language: "Python",
    tags: ["Drones", "Simulation"],
  },
  {
    repo: "transformer_translator",
    title: "Transformer Translator",
    description:
      "From-scratch PyTorch Transformer for Italian→English translation with training and BLEU evaluation loops.",
    language: "Jupyter Notebook",
    tags: ["Transformers", "NLP", "PyTorch"],
  },
  {
    repo: "Anime_FaceGen",
    title: "Anime FaceGen",
    description:
      "Generative modeling experiments for anime face synthesis.",
    language: "Jupyter Notebook",
    tags: ["GANs", "Generative"],
  },
  {
    repo: "Algerian_Forest_Fires",
    title: "Algerian Forest Fires",
    description:
      "End-to-end Fire Weather Index prediction with LassoCV on meteorological features and a simple prediction UI.",
    language: "Jupyter Notebook",
    tags: ["ML", "Regression", "Climate"],
  },
  {
    repo: "DQNCartpole",
    title: "DQN CartPole",
    description:
      "Deep Q-Network agent trained on the classic CartPole control task.",
    language: "Python",
    tags: ["DQN", "RL"],
  },
  {
    repo: "04_BattleTanksUE",
    title: "Battle Tanks (UE)",
    description:
      "Open-world Unreal Engine tank game built while learning UE4 AI and gameplay systems.",
    language: "C++",
    tags: ["Unreal", "Game AI"],
  },
  {
    repo: "Stable_Diffusion",
    title: "Stable Diffusion Playground",
    description:
      "Hands-on Stable Diffusion experiments and inference notebooks.",
    language: "Python",
    tags: ["Diffusion", "Generative"],
  },
  {
    repo: "mcqgen",
    title: "MCQ Generator",
    description:
      "LLM-assisted multiple-choice question generation from source material.",
    language: "Jupyter Notebook",
    tags: ["LLM", "Education"],
  },
];
