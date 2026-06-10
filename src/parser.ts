import { Section } from "./types";

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[\\/:]/g, "-")
    .replace(/[#^\[\]|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ParseResult {
  rootTitle: string;
  sections: Section[];
}

export function splitByH2(content: string, rootTitle: string, separator: string): ParseResult {
  const lines = content.split(/\r?\n/);
  const sections: Section[] = [];
  let current: { heading: string; bodyLines: string[] } | null = null;

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) sections.push(toSection(current, rootTitle, separator));
      current = { heading: m[1].trim(), bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    }
  }
  if (current) sections.push(toSection(current, rootTitle, separator));
  return { rootTitle, sections };
}

function toSection(
  cur: { heading: string; bodyLines: string[] },
  rootTitle: string,
  separator: string
): Section {
  const body = cur.bodyLines.join("\n").replace(/^\n+|\n+$/g, "");
  const noteName = sanitizeFileName(`${rootTitle}${separator}${cur.heading}`);
  return { heading: cur.heading, body, noteName };
}
