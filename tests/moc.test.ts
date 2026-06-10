import { classify, buildMOC, buildCategorySection } from "../src/moc";
import { ParseResult } from "../src/parser";
import { Section } from "../src/types";

describe("classify", () => {
  test("Deploy → Development に分類される", () => {
    expect(classify("Deploy")).toBe("Development");
  });

  test("Deployment → Development に分類される", () => {
    expect(classify("Deployment")).toBe("Development");
  });

  test("Testing → Development に分類される", () => {
    expect(classify("Testing")).toBe("Development");
  });

  test("Build → Development に分類される", () => {
    expect(classify("Build Optimization")).toBe("Development");
  });

  test("CI/CD → Automation に分類される", () => {
    expect(classify("CI/CD")).toBe("Automation");
  });

  test("Pipeline → Automation に分類される", () => {
    expect(classify("Pipeline Setup")).toBe("Automation");
  });

  test("GitHub Actions → Automation に分類される", () => {
    expect(classify("GitHub Actions Workflow")).toBe("Automation");
  });

  test("Monitoring → Operations に分類される", () => {
    expect(classify("Monitoring")).toBe("Operations");
  });

  test("Logging → Operations に分類される", () => {
    expect(classify("Logging Setup")).toBe("Operations");
  });

  test("CloudWatch → Operations に分類される", () => {
    expect(classify("CloudWatch Alerts")).toBe("Operations");
  });

  test("Architecture → Architecture に分類される", () => {
    expect(classify("Architecture Overview")).toBe("Architecture");
  });

  test("Design → Architecture に分類される", () => {
    expect(classify("Design Patterns")).toBe("Architecture");
  });

  test("未知のキーワード → Uncategorized", () => {
    expect(classify("Random Topic")).toBe("Uncategorized");
  });

  test("大文字小文字を無視してマッチする", () => {
    expect(classify("DEPLOY")).toBe("Development");
    expect(classify("deploy")).toBe("Development");
    expect(classify("dEpLoY")).toBe("Development");
  });
});

describe("buildMOC", () => {
  const parse: ParseResult = {
    rootTitle: "AWS SAM",
    sections: [
      { heading: "Deploy", body: "Deploy content.", noteName: "AWS SAM - Deploy" },
      { heading: "CI/CD", body: "CI/CD content.", noteName: "AWS SAM - CI-CD" },
      { heading: "Testing", body: "Testing content.", noteName: "AWS SAM - Testing" },
      { heading: "Monitoring", body: "Monitoring content.", noteName: "AWS SAM - Monitoring" },
    ],
  };

  let result: string;
  beforeEach(() => {
    result = buildMOC(parse);
  });

  // Structure Summary テスト
  test("Structure Summary: MOC H1タイトルが先頭にある", () => {
    expect(result).toMatch(/^# AWS SAM MOC\n/);
  });

  test("Structure Summary: Generated fromが含まれる", () => {
    expect(result).toContain("Generated from:");
    expect(result).toContain("[[AWS SAM]]");
  });

  test("Structure Summary: Sectionsカウントが正しい", () => {
    expect(result).toContain("Sections: 4");
  });

  test("Structure Summary: Categoriesリストが含まれる", () => {
    expect(result).toContain("Categories:");
    expect(result).toContain("- Development");
    expect(result).toContain("- Automation");
    expect(result).toContain("- Operations");
  });

  test("Structure Summary: Uncategorizedは使用されたカテゴリにのみ表示", () => {
    expect(result).not.toContain("- Uncategorized");
  });

  // カテゴリ分類テスト
  test("Deployが Development に分類される（受け入れ基準5）", () => {
    const devIdx = result.indexOf("## Development");
    const deployLink = result.indexOf("[[AWS SAM - Deploy]]");
    expect(devIdx).toBeGreaterThan(-1);
    expect(deployLink).toBeGreaterThan(devIdx);
  });

  test("CI/CDが Automation に分類される", () => {
    const autoIdx = result.indexOf("## Automation");
    const ciLink = result.indexOf("[[AWS SAM - CI-CD]]");
    expect(autoIdx).toBeGreaterThan(-1);
    expect(ciLink).toBeGreaterThan(autoIdx);
  });

  test("TestingがDevelopmentに分類される", () => {
    const devIdx = result.indexOf("## Development");
    const testLink = result.indexOf("[[AWS SAM - Testing]]");
    expect(devIdx).toBeGreaterThan(-1);
    expect(testLink).toBeGreaterThan(devIdx);
  });

  test("MonitoringがOperationsに分類される", () => {
    const opsIdx = result.indexOf("## Operations");
    const monLink = result.indexOf("[[AWS SAM - Monitoring]]");
    expect(opsIdx).toBeGreaterThan(-1);
    expect(monLink).toBeGreaterThan(opsIdx);
  });

  test("Uncategorizedセクションは使用中のセクションがない場合に表示されない", () => {
    expect(result).not.toContain("## Uncategorized");
  });

  // カテゴリ説明文テスト（受け入れ基準6）
  test("Developmentカテゴリの説明文が挿入される", () => {
    expect(result).toContain("Development, deployment and testing workflow.");
  });

  test("AutomationカテゴリのCI/CD説明文が挿入される", () => {
    expect(result).toContain("CI/CD pipeline automation.");
  });

  test("Operationsカテゴリの説明文が挿入される", () => {
    expect(result).toContain("Monitoring, logging and observability.");
  });

  // カテゴリ順序テスト
  test("カテゴリ順序: Development → Automation → Operations", () => {
    const devIdx = result.indexOf("## Development");
    const autoIdx = result.indexOf("## Automation");
    const opsIdx = result.indexOf("## Operations");
    expect(devIdx).toBeLessThan(autoIdx);
    expect(autoIdx).toBeLessThan(opsIdx);
  });

  test("空のカテゴリは出力されない", () => {
    expect(result).not.toContain("## Architecture");
  });
});

describe("buildMOC - Uncategorized", () => {
  test("分類不能なセクションがUncategorizedに入る", () => {
    const parse: ParseResult = {
      rootTitle: "My Note",
      sections: [
        { heading: "Random Topic", body: "Some content.", noteName: "My Note - Random Topic" },
      ],
    };
    const result = buildMOC(parse);
    expect(result).toContain("## Uncategorized");
    expect(result).toContain("Other notes.");
    expect(result).toContain("[[My Note - Random Topic]]");
  });

  test("UncategorizedのCategories一覧への追加", () => {
    const parse: ParseResult = {
      rootTitle: "My Note",
      sections: [
        { heading: "Random Topic", body: "content.", noteName: "My Note - Random Topic" },
      ],
    };
    const result = buildMOC(parse);
    expect(result).toContain("- Uncategorized");
  });
});

describe("buildCategorySection", () => {
  test("カテゴリ見出しと説明文とリンクが含まれる", () => {
    const items: Section[] = [
      { heading: "Deploy", body: "", noteName: "AWS SAM - Deploy" },
    ];
    const result = buildCategorySection("Development", items);
    expect(result).toContain("## Development");
    expect(result).toContain("Development, deployment and testing workflow.");
    expect(result).toContain("- [[AWS SAM - Deploy]]");
  });

  test("複数アイテムが全てリストに含まれる", () => {
    const items: Section[] = [
      { heading: "Deploy", body: "", noteName: "AWS SAM - Deploy" },
      { heading: "Testing", body: "", noteName: "AWS SAM - Testing" },
    ];
    const result = buildCategorySection("Development", items);
    expect(result).toContain("- [[AWS SAM - Deploy]]");
    expect(result).toContain("- [[AWS SAM - Testing]]");
  });
});
