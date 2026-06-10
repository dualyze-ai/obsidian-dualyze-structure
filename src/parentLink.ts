import { Section } from "./types";

export function buildSplitNoteContent(section: Section, rootTitle: string): string {
  const fm = `---\nparent: "[[${rootTitle}]]"\n---\n`;
  const heading = `\n# ${section.heading}\n`;
  const body = section.body ? `\n${section.body}\n` : "\n";
  return fm + heading + body;
}
