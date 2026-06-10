import { Section, Category, KnowledgeVisualization, DualyzeSettings } from "./types";
import { ParseResult } from "./parser";

// --- Category classification (reserved for future AI MOC Generator) ---

interface CategoryDef {
  category: Category;
  keywords: string[];
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

// --- Knowledge visualization helpers ---

export function sanitizeFlowchartLabel(label: string): string {
  return label.replace(/"/g, "'");
}

function buildTextTree(rootTitle: string, noteNames: string[]): string {
  const lines = noteNames.map((name, i) => {
    const branch = i === noteNames.length - 1 ? "└─" : "├─";
    return `${branch} [[${name}]]`;
  });
  return `${rootTitle}\n${lines.join("\n")}`;
}

function buildMermaidFlowchart(rootTitle: string, sections: Section[]): string {
  const safeRoot = sanitizeFlowchartLabel(rootTitle);
  const lines: string[] = [
    `flowchart LR`,
    `  root["${safeRoot}"]`,
  ];
  sections.forEach((s, i) => {
    const sId = `s${i + 1}`;
    const label = sanitizeFlowchartLabel(s.heading);
    lines.push(`  root --> ${sId}["${label}"]`);
    s.subsections.forEach((sub, j) => {
      const subLabel = sanitizeFlowchartLabel(sub);
      lines.push(`  ${sId} --> ${sId}_${j + 1}["${subLabel}"]`);
    });
  });
  return lines.join("\n");
}

function buildKnowledgeVisualization(parse: ParseResult, mode: KnowledgeVisualization): string {
  if (mode === "none") return "";

  if (mode === "text-tree") {
    const tree = buildTextTree(parse.rootTitle, parse.sections.map((s) => s.noteName));
    return `\n## Knowledge Tree\n\n\`\`\`text\n${tree}\n\`\`\`\n`;
  }

  // mermaid-flowchart
  const flowchart = buildMermaidFlowchart(parse.rootTitle, parse.sections);
  return `\n## Knowledge Map\n\n\`\`\`mermaid\n%%{init: {'flowchart': {'useMaxWidth': true}}}%%\n${flowchart}\n\`\`\`\n`;
}

// --- MOC builder ---

export function buildMOC(parse: ParseResult, settings: DualyzeSettings): string {
  let out = `# ${parse.rootTitle} MOC\n\n`;
  out += `Generated from:\n[[${parse.rootTitle}]]\n\n`;
  out += `Sections: ${parse.sections.length}\n\n`;
  out += `## Overview\n\n`;
  out += `This MOC provides a navigation hub for the structured notes generated from [[${parse.rootTitle}]].\n`;
  out += buildKnowledgeVisualization(parse, settings.knowledgeVisualization);
  out += `\n## Related Notes\n\n`;
  out += parse.sections.map((s) => `- [[${s.noteName}]]`).join("\n") + "\n";
  return out;
}
