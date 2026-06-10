import { Section, Category } from "./types";
import { ParseResult } from "./parser";

// --- Category classification (reserved for future AI MOC Generator) ---

interface CategoryDef {
  category: Category;
  keywords: string[];
  /** One-line description inserted below the category heading */
  description: string;
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    category: "Development",
    keywords: ["develop", "deploy", "deployment", "build", "code", "unit test", "integration test", "testing"],
    description: "Development, deployment and testing workflow.",
  },
  {
    category: "Automation",
    keywords: ["ci/cd", "pipeline", "github actions", "workflow"],
    description: "CI/CD pipeline automation.",
  },
  {
    category: "Operations",
    keywords: ["monitoring", "logging", "cloudwatch", "alert", "observability"],
    description: "Monitoring, logging and observability.",
  },
  {
    category: "Architecture",
    keywords: ["architecture", "design", "pattern", "structure"],
    description: "Architecture, design and patterns.",
  },
];

const UNCATEGORIZED_DESC = "Other notes.";
const ORDER: Category[] = ["Development", "Automation", "Operations", "Architecture", "Uncategorized"];

export function classify(heading: string): Category {
  const h = heading.toLowerCase();
  for (const def of CATEGORY_DEFS) {
    if (def.keywords.some((k) => h.includes(k))) return def.category;
  }
  return "Uncategorized";
}

function descriptionOf(cat: Category): string {
  return CATEGORY_DEFS.find((d) => d.category === cat)?.description ?? UNCATEGORIZED_DESC;
}

export function buildCategorySection(cat: Category, items: Section[]): string {
  let out = `## ${cat}\n\n`;
  out += `${descriptionOf(cat)}\n\n`;
  out += items.map((s) => `- [[${s.noteName}]]`).join("\n") + "\n";
  return out;
}

// --- MOC builder (v1.0: flat list, no categories) ---

export function buildMOC(parse: ParseResult): string {
  // Structure Summary header
  let out = `# ${parse.rootTitle} MOC\n\n`;
  out += `Generated from:\n[[${parse.rootTitle}]]\n\n`;
  out += `Sections: ${parse.sections.length}\n\n`;

  // Flat section list — works for any topic, not just DevOps
  out += `## Sections\n\n`;
  out += parse.sections.map((s) => `- [[${s.noteName}]]`).join("\n") + "\n";

  return out;
}
