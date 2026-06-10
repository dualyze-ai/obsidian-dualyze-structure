export interface DualyzeSettings {
  /** Output folder for split notes, index, and MOC (relative to vault root) */
  outputFolder: string;
  /** Whether to generate a MOC */
  generateMOC: boolean;
  /** Separator used in generated file names (default: " - ") */
  separator: string;
}

export const DEFAULT_SETTINGS: DualyzeSettings = {
  outputFolder: "Generated",
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
