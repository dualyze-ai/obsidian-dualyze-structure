export interface DualyzeSettings {
  /** Output folder for split notes and MOC (relative to vault root; empty = same folder as source note) */
  outputFolder: string;
  /** How to handle the original note body */
  originalContent: "replace" | "keep";
  /** Whether to generate a MOC */
  generateMOC: boolean;
  /** Separator used in generated file names (default: " - ") */
  separator: string;
}

export const DEFAULT_SETTINGS: DualyzeSettings = {
  outputFolder: "Generated",
  originalContent: "keep",
  generateMOC: true,
  separator: " - ",
};

/** One section produced by splitting the source note */
export interface Section {
  /** H2 heading text (without the ## prefix) */
  heading: string;
  /** Section body (everything after the heading line) */
  body: string;
  /** Sanitized file base name: "<RootTitle> - <Heading>" */
  noteName: string;
}

/** MOC category */
export type Category = "Development" | "Automation" | "Operations" | "Architecture" | "Uncategorized";

export interface CreateResult {
  rootTitle: string;
  sections: Section[];
}
