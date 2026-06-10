import { ParseResult } from "./parser";

export function buildStructureIndex(parse: ParseResult): string {
  const links = parse.sections.map((s) => `- [[${s.noteName}]]`).join("\n");
  return `# ${parse.rootTitle} Index\n\nSource: [[${parse.rootTitle}]]\n\n## Sections\n\n${links}\n`;
}
