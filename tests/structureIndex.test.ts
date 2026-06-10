import { buildStructureIndex } from "../src/structureIndex";
import { ParseResult } from "../src/parser";
import { DEFAULT_SETTINGS, DualyzeSettings } from "../src/types";

const parse: ParseResult = {
  rootTitle: "AWS SAM",
  sections: [
    { heading: "Deploy", body: "Deploy content.", noteName: "AWS SAM - Deploy" },
    { heading: "CI/CD", body: "CI/CD content.", noteName: "AWS SAM - CI-CD" },
    { heading: "Testing", body: "Testing content.", noteName: "AWS SAM - Testing" },
    { heading: "Monitoring", body: "Monitoring content.", noteName: "AWS SAM - Monitoring" },
  ],
};

const originalBody = `# AWS SAM\n\nSome original content here.`;

describe("buildStructureIndex (replace mode)", () => {
  const settings: DualyzeSettings = { ...DEFAULT_SETTINGS, originalContent: "replace" };

  test("H1タイトルが含まれる", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).toContain("# AWS SAM");
  });

  test("## Structure 見出しが含まれる", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).toContain("## Structure");
  });

  test("全セクションへのWikiリンクが含まれる", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).toContain("- [[AWS SAM - Deploy]]");
    expect(result).toContain("- [[AWS SAM - CI-CD]]");
    expect(result).toContain("- [[AWS SAM - Testing]]");
    expect(result).toContain("- [[AWS SAM - Monitoring]]");
  });

  test("replaceモードではOriginal Contentが含まれない", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).not.toContain("## Original Content");
    expect(result).not.toContain("Some original content here.");
  });
});

describe("buildStructureIndex (keep mode)", () => {
  const settings: DualyzeSettings = { ...DEFAULT_SETTINGS, originalContent: "keep" };

  test("keepモードではOriginal Contentセクションが含まれる", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).toContain("## Original Content");
  });

  test("keepモードでは元の本文が含まれる", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).toContain("Some original content here.");
  });

  test("keepモードでも## Structureが含まれる", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    expect(result).toContain("## Structure");
  });

  test("セクション順序: Structure → 区切り線 → Original Content", () => {
    const result = buildStructureIndex(parse, originalBody, settings);
    const structIdx = result.indexOf("## Structure");
    const hrIdx = result.indexOf("---");
    const origIdx = result.indexOf("## Original Content");
    expect(structIdx).toBeLessThan(hrIdx);
    expect(hrIdx).toBeLessThan(origIdx);
  });
});
