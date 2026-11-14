export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  status: "published" | "under-review";
  href?: string;
  note?: string;
};

export const publications: Publication[] = [
  {
    title: "Variable L1 Guidance Strategy for Path Following of UAVs",
    authors: "R. Saurav, Laad Dhruv Sohil, Satadal Ghosh",
    venue: "2020 International Conference on Unmanned Aircraft Systems (ICUAS), IEEE",
    year: "2020",
    status: "published",
    href: "https://doi.org/10.1109/ICUAS48674.2020.9214056",
    note: "First author · Athens, Greece",
  },
  {
    title:
      "Impact of Post-Oxidation Phenomena on Internal Combustion Engine Performance-Emissions…",
    authors: "Saurav Ramachandra Rao et al.",
    venue: "IMechE Part D · JAUTO-26-0200",
    year: "2026",
    status: "under-review",
    note: "Journal manuscript under review",
  },
];
