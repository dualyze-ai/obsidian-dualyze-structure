import { buildSplitNoteContent } from "../src/parentLink";
import { Section } from "../src/types";

describe("buildSplitNoteContent", () => {
  const section: Section = {
    heading: "Deploy",
    body: "AWS SAM のデプロイ方法について。",
    noteName: "AWS SAM - Deploy",
  };

  test("frontmatterにparentリンクが含まれる", () => {
    const content = buildSplitNoteContent(section, "AWS SAM");
    expect(content).toContain('parent: "[[AWS SAM]]"');
  });

  test("frontmatterがYAMLブロックで囲まれている", () => {
    const content = buildSplitNoteContent(section, "AWS SAM");
    expect(content).toMatch(/^---\n/);
    expect(content).toContain("\n---\n");
  });

  test("H1見出しが元のH2テキストから生成される", () => {
    const content = buildSplitNoteContent(section, "AWS SAM");
    expect(content).toContain("\n# Deploy\n");
  });

  test("本文が含まれる", () => {
    const content = buildSplitNoteContent(section, "AWS SAM");
    expect(content).toContain("AWS SAM のデプロイ方法について。");
  });

  test("本文が空のセクションでも正常動作する", () => {
    const emptySection: Section = {
      heading: "Empty",
      body: "",
      noteName: "Root - Empty",
    };
    const content = buildSplitNoteContent(emptySection, "Root");
    expect(content).toContain('parent: "[[Root]]"');
    expect(content).toContain("\n# Empty\n");
  });

  test("出力フォーマットの順序: frontmatter → H1 → body", () => {
    const content = buildSplitNoteContent(section, "AWS SAM");
    const fmIdx = content.indexOf("---");
    const h1Idx = content.indexOf("# Deploy");
    const bodyIdx = content.indexOf("AWS SAM のデプロイ方法");
    expect(fmIdx).toBeLessThan(h1Idx);
    expect(h1Idx).toBeLessThan(bodyIdx);
  });
});
