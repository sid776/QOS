import readme from "../../../../README.md?raw";
import quantumResearch from "../../../../docs/QUANTUM_RESEARCH.md?raw";
import devGuide from "../../../../docs/DEV_GUIDE.md?raw";

export type BundledDoc = {
  id: string;
  title: string;
  path: string;
  description: string;
  content: string;
};

export const BUNDLED_DOCS: Record<string, BundledDoc> = {
  readme: {
    id: "readme",
    title: "QuantumOS README",
    path: "README.md",
    description: "Project overview, quickstart, skills, providers, API examples",
    content: readme,
  },
  "quantum-research": {
    id: "quantum-research",
    title: "Quantum Research Notes",
    path: "docs/QUANTUM_RESEARCH.md",
    description: "Research-style architecture and quantum execution model",
    content: quantumResearch,
  },
  "dev-guide": {
    id: "dev-guide",
    title: "Developer Guide (Markdown)",
    path: "docs/DEV_GUIDE.md",
    description: "Technical developer reference from the repository",
    content: devGuide,
  },
};

export function getBundledDoc(id: string): BundledDoc | undefined {
  return BUNDLED_DOCS[id];
}

export function listBundledDocs(): BundledDoc[] {
  return Object.values(BUNDLED_DOCS);
}
