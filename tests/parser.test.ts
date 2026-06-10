import { splitByH2, sanitizeFileName } from "../src/parser";

const SEP = " - ";

describe("sanitizeFileName", () => {
  test("スラッシュをハイフンに置換する", () => {
    expect(sanitizeFileName("AWS SAM - CI/CD")).toBe("AWS SAM - CI-CD");
  });

  test("バックスラッシュをハイフンに置換する", () => {
    expect(sanitizeFileName("AWS SAM - CI\\CD")).toBe("AWS SAM - CI-CD");
  });

  test("コロンをハイフンに置換する", () => {
    expect(sanitizeFileName("AWS SAM - CI:CD")).toBe("AWS SAM - CI-CD");
  });

  test("禁止文字を除去する（# ^ [ ] |）", () => {
    expect(sanitizeFileName("AWS #SAM^ [Note] |test")).toBe("AWS SAM Note test");
  });

  test("連続スペースを1つに圧縮する", () => {
    expect(sanitizeFileName("AWS  SAM  Test")).toBe("AWS SAM Test");
  });

  test("前後の空白をトリムする", () => {
    expect(sanitizeFileName("  AWS SAM  ")).toBe("AWS SAM");
  });

  test("CI/CD → CI-CD の実例", () => {
    expect(sanitizeFileName("AWS SAM - CI/CD")).toBe("AWS SAM - CI-CD");
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

  test("4つのセクションに分割される", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections).toHaveLength(4);
  });

  test("rootTitleが正しい", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.rootTitle).toBe("AWS SAM");
  });

  test("各セクションの見出しが正しい", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[0].heading).toBe("Deploy");
    expect(result.sections[1].heading).toBe("CI/CD");
    expect(result.sections[2].heading).toBe("Testing");
    expect(result.sections[3].heading).toBe("Monitoring");
  });

  test("ファイル名が正しくサニタイズされる", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[0].noteName).toBe("AWS SAM - Deploy");
    expect(result.sections[1].noteName).toBe("AWS SAM - CI-CD");
    expect(result.sections[2].noteName).toBe("AWS SAM - Testing");
    expect(result.sections[3].noteName).toBe("AWS SAM - Monitoring");
  });

  test("H3以下は親H2ノートの本文に含まれる", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    expect(result.sections[2].body).toContain("### Unit Tests");
    expect(result.sections[2].body).toContain("Unit test content.");
  });

  test("H2が無いノートは空のセクション配列を返す", () => {
    const noH2 = "# Title\n\nJust some text without any H2 headings.";
    const result = splitByH2(noH2, "Title", SEP);
    expect(result.sections).toHaveLength(0);
  });

  test("カスタムセパレータが適用される", () => {
    const result = splitByH2(baseNote, "AWS SAM", "_");
    expect(result.sections[0].noteName).toBe("AWS SAM_Deploy");
  });

  test("H1はセクションに含まれない", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    for (const s of result.sections) {
      expect(s.heading).not.toMatch(/^#/);
    }
  });

  test("H2前のリード文はセクションに含まれない", () => {
    const result = splitByH2(baseNote, "AWS SAM", SEP);
    for (const s of result.sections) {
      expect(s.body).not.toContain("Introduction text.");
    }
  });

  test("Windowsの改行（CRLF）でも動作する", () => {
    const crlfNote = "# Title\r\n\r\n## Section1\r\n\r\nContent1\r\n\r\n## Section2\r\n\r\nContent2";
    const result = splitByH2(crlfNote, "Title", SEP);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].heading).toBe("Section1");
  });

  test("空のセクション本文でも正常動作する", () => {
    const emptyBody = "# Title\n\n## Section1\n\n## Section2\n\nContent2";
    const result = splitByH2(emptyBody, "Title", SEP);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].body).toBe("");
    expect(result.sections[1].body).toBe("Content2");
  });
});
