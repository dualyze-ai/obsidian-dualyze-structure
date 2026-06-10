/**
 * "spaced" → "Title Index" / "Title MOC"
 * "dot"    → "Title.structure" / "Title.moc"
 */
export type NamingStyle = "spaced" | "dot";

export interface DualyzeSettings {
  /** Output folder for split notes, index, and MOC (relative to vault root) */
  outputFolder: string;
  /** Whether to generate a MOC */
  generateMOC: boolean;
  /** Separator used in generated file names (default: " - ") */
  separator: string;
  /** Naming convention for Index and MOC files */
  namingStyle: NamingStyle;
  /** Knowledge visualization style in MOC */
  knowledgeVisualization: KnowledgeVisualization;
}

export const DEFAULT_SETTINGS: DualyzeSettings = {
  outputFolder: "Generated",
  generateMOC: true,
  separator: " - ",
  namingStyle: "spaced",
  knowledgeVisualization: "mermaid-flowchart",
};

/** Returns the base name (no extension) for the index file */
export function indexFileName(rootTitle: string, style: NamingStyle): string {
  return style === "dot" ? `${rootTitle}.structure` : `${rootTitle} Index`;
}

/** Returns the base name (no extension) for the MOC file */
export function mocFileName(rootTitle: string, style: NamingStyle): string {
  return style === "dot" ? `${rootTitle}.moc` : `${rootTitle} MOC`;
}

/** One section produced by splitting the source note */
export interface Section {
  /** H2 heading text (without the ## prefix) */
  heading: string;
  /** Section body (everything after the heading line) */
  body: string;
  /** Sanitized file base name: "<RootTitle> - <Heading>" */
  noteName: string;
  /** H3 headings found inside this section (used for Knowledge Map depth) */
  subsections: string[];
}

/** Knowledge visualization style in MOC */
export type KnowledgeVisualization = "none" | "text-tree" | "mermaid-flowchart";

/** MOC category */
export type Category = "Development" | "Automation" | "Operations" | "Architecture" | "Uncategorized";

export interface CreateResult {
  rootTitle: string;
  sections: Section[];
}
