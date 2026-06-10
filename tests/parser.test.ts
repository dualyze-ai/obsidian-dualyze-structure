import { splitByH2, sanitizeFileName } from "../src/parser";

const SEP = " - ";

describe("sanitizeFileName", () => {
  test("replaces forward slash with hyphen", () => {
    expect(sanitizeFileName("AWS SAM - CI/CD")).toBe("AWS SAM - CI-CD");
  });

  test("replaces backslash with hyphen", () => {
    expect(sanitizeFileName("AWS SAM - CI\\CD")).toBe("AWS SAM - CI-CD");
  });

  test("replaces colon with hyphen", () => {
    expect(sanitizeFileName("AWS SAM - CI:CD")).toBe("AWS SAM - CI-CD");
  });

  test("removes forbidden characters (# ^ [ ] |)", () => {
    expect(sanitizeFileName("AWS #SAM^ [Note] |test")).toBe("AWS SAM Note test");
  });

  test("collapses consecutive spaces into one", () => {
    expect(sanitizeFileName("AWS  SAM  Test")).toBe("AWS SAM Test");
  });

  test("trims leading and trailing spaces", () => {
    expect(sanitizeFileName("  AWS SAM  ")).toBe("AWS SAM");
  });
});

describe("splitByH2", () => {
  const baseNote = `# AWS SAM

Introduction text.

## Deploy

Deploy section content.

## CI/CD

Pipeline content.

## Testing

### Unit Tests

Unit test content.

## Monitoring

Monitoring content.
`;

  test("splits into 4 sections", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections).toHaveLength(4);
  });

  test("rootTitle is correct", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.rootTitle).toBe("AWS SAM");
  });

  test("section headings are correct", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[0].heading).toBe("Deploy");
    expect(result.sections[1].heading).toBe("CI/CD");
    expect(result.sections[2].heading).toBe("Testing");
    expect(result.sections[3].heading).toBe("Monitoring");
  });

  test("file names are correctly sanitized", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[0].noteName).toBe("AWS SAM - Deploy");
    expect(result.sections[1].noteName).toBe("AWS SAM - CI-CD");
    expect(result.sections[2].noteName).toBe("AWS SAM - Testing");
    expect(result.sections[3].noteName).toBe("AWS SAM - Monitoring");
  });

  test("H3 and below stay inside their parent H2 section", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[2].body).toContain("### Unit Tests");
    expect(result.sections[2].body).toContain("Unit test content.");
  });

  test("H3 headings are extracted as subsections", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[2].subsections).toEqual(["Unit Tests"]);
  });

  test("sections without H3 have empty subsections array", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[0].subsections).toEqual([]);
    expect(result.sections[3].subsections).toEqual([]);
  });

  test("returns empty sections array when no H2 headings exist", () => {
    const noH2 = "# Title\n\nJust some text without any H2 headings.";
    const result = splitByH2(noH2, "Title", SEP);
    expect(result.sections).toHaveLength(0);
  });

  test("custom separator is applied", () => {
    const result = splitByH2(baseNote, "AWS SAM", "_");
    expect(result.sections[0].noteName).toBe("AWS SAM_Deploy");
  });

  test("H1 title is not included as a section", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    for (const s of result.sections) {
      expect(s.heading).not.toMatch(/^#/);
    }
  });

  test("lead text before first H2 is not included in any section body", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    for (const s of result.sections) {
      expect(s.body).not.toContain("Introduction text.");
    }
  });

  test("handles Windows line endings (CRLF)", () => {
    const crlfNote = "# Title\r\n\r\n## Section1\r\n\r\nContent1\r\n\r\n## Section2\r\n\r\nContent2";
    const result = splitByH2(crlfNote, "Title", SEP);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].heading).toBe("Section1");
  });

  test("handles empty section body", () => {
    const emptyBody = "# Title\n\n## Section1\n\n## Section2\n\nContent2";
    const result = splitByH2(emptyBody, "Title", SEP);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].body).toBe("");
    expect(result.sections[1].body).toBe("Content2");
  });
});

describe("splitByH2 — internal heading filter (re-run safety)", () => {
  const alreadyProcessed = `# Kyoto Travel Guide

## Structure

- [[Kyoto Travel Guide - Getting Around]]
- [[Kyoto Travel Guide - Top Attractions]]

---

## Original Content

# Kyoto Travel Guide

A practical guide to visiting Kyoto.

---

## Getting Around

Transport content here.

## Top Attractions

Sightseeing content here.
`;

  test("skips ## Structure section on re-run", () => {
    const result = splitByH2(alreadyProcessed, "Kyoto Travel Guide", SEP);
    const headings = result.sections.map((s) => s.heading);
    expect(headings).not.toContain("Structure");
  });

  test("skips ## Original Content section on re-run", () => {
    const result = splitByH2(alreadyProcessed, "Kyoto Travel Guide", SEP);
    const headings = result.sections.map((s) => s.heading);
    expect(headings).not.toContain("Original Content");
  });

  test("still detects real content sections on re-run", () => {
    const result = splitByH2(alreadyProcessed, "Kyoto Travel Guide", SEP);
    const headings = result.sections.map((s) => s.heading);
    expect(headings).toContain("Getting Around");
    expect(headings).toContain("Top Attractions");
  });

  test("section count is correct after filtering internal headings", () => {
    const result = splitByH2(alreadyProcessed, "Kyoto Travel Guide", SEP);
    expect(result.sections).toHaveLength(2);
  });
});

describe("splitByH2 — edge cases", () => {
  test("single H2 section returns exactly 1 section", () => {
    const singleH2 = "# Guide\n\n## Only Section\n\nSome content here.";
    const result = splitByH2(singleH2, "Guide", SEP);
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].heading).toBe("Only Section");
    expect(result.sections[0].body).toBe("Some content here.");
  });

  test("20+ H2 sections are all parsed", () => {
    const headings = Array.from({ length: 22 }, (_, i) => `## Day ${i + 1}\n\nContent for day ${i + 1}.`);
    const note = `# Challenge\n\n${headings.join("\n\n")}`;
    const result = splitByH2(note, "Challenge", SEP);
    expect(result.sections).toHaveLength(22);
    expect(result.sections[0].heading).toBe("Day 1");
    expect(result.sections[21].heading).toBe("Day 22");
  });

  test("20+ H2 sections all have correct note names", () => {
    const headings = Array.from({ length: 22 }, (_, i) => `## Day ${i + 1}\n\nContent.`);
    const note = `# Challenge\n\n${headings.join("\n\n")}`;
    const result = splitByH2(note, "Challenge", SEP);
    expect(result.sections[0].noteName).toBe("Challenge - Day 1");
    expect(result.sections[21].noteName).toBe("Challenge - Day 22");
  });
});
