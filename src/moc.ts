import { Section, Category } from "./types";
import { ParseResult } from "./parser";

interface CategoryDef {
  category: Category;
  keywords: string[];
  /** 見出し直下に自動挿入する説明文 */
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

export function buildMOC(parse: ParseResult): string {
  const groups = new Map<Category, Section[]>();
  for (const s of parse.sections) {
    const cat = classify(s.heading);
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(s);
  }

  const usedCategories: Category[] = ORDER.filter((cat) => {
    const items = groups.get(cat);
    return items && items.length > 0;
  });

  // Structure Summary ヘッダー
  const categoryList = usedCategories.map((c) => `- ${c}`).join("\n");
  let out = `# ${parse.rootTitle} MOC\n\n`;
  out += `Generated from:\n[[${parse.rootTitle}]]\n\n`;
  out += `Sections: ${parse.sections.length}\n\n`;
  out += `Categories:\n${categoryList}\n`;

  // カテゴリセクション（将来拡張: buildCategorySection 単位で後から追加可能）
  for (const cat of usedCategories) {
    const items = groups.get(cat)!;
    out += `\n${buildCategorySection(cat, items)}`;
  }

  return out;
}
