import { ParseResult } from "./parser";
import { DualyzeSettings } from "./types";

export function buildStructureIndex(
  parse: ParseResult,
  originalBody: string,
  settings: DualyzeSettings
): string {
  const links = parse.sections.map((s) => `- [[${s.noteName}]]`).join("\n");
  let out = `# ${parse.rootTitle}\n\n## Structure\n\n${links}\n`;
  if (settings.originalContent === "keep") {
    out += `\n---\n\n## Original Content\n\n${originalBody.trim()}\n`;
  }
  return out;
}
