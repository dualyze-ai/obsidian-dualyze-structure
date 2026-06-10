import { classify, buildMOC, buildCategorySection } from "../src/moc";
import { ParseResult } from "../src/parser";
import { Section } from "../src/types";

describe("classify (reserved for future AI MOC Generator)", () => {
  test("Deploy → Development", () => {
    expect(classify("Deploy")).toBe("Development");
  });

  test("Deployment → Development", () => {
    expect(classify("Deployment")).toBe("Development");
  });

  test("Testing → Development", () => {
    expect(classify("Testing")).toBe("Development");
  });

  test("Build → Development", () => {
    expect(classify("Build Optimization")).toBe("Development");
  });

  test("CI/CD → Automation", () => {
    expect(classify("CI/CD")).toBe("Automation");
  });

  test("Pipeline → Automation", () => {
    expect(classify("Pipeline Setup")).toBe("Automation");
  });

  test("GitHub Actions → Automation", () => {
    expect(classify("GitHub Actions Workflow")).toBe("Automation");
  });

  test("Monitoring → Operations", () => {
    expect(classify("Monitoring")).toBe("Operations");
  });

  test("Logging → Operations", () => {
    expect(classify("Logging Setup")).toBe("Operations");
  });

  test("CloudWatch → Operations", () => {
    expect(classify("CloudWatch Alerts")).toBe("Operations");
  });

  test("Architecture → Architecture", () => {
    expect(classify("Architecture Overview")).toBe("Architecture");
  });

  test("Design → Architecture", () => {
    expect(classify("Design Patterns")).toBe("Architecture");
  });

  test("Unknown keyword → Uncategorized", () => {
    expect(classify("Random Topic")).toBe("Uncategorized");
  });

  test("Case-insensitive matching", () => {
    expect(classify("DEPLOY")).toBe("Development");
    expect(classify("deploy")).toBe("Development");
    expect(classify("dEpLoY")).toBe("Development");
  });

  test("General topics → Uncategorized (cooking, travel, etc.)", () => {
    expect(classify("Ingredients and Equipment")).toBe("Uncategorized");
    expect(classify("Getting Around")).toBe("Uncategorized");
    expect(classify("Wine Pairings")).toBe("Uncategorized");
    expect(classify("Where to Stay")).toBe("Uncategorized");
    expect(classify("Seasonal Events")).toBe("Uncategorized");
  });
});

describe("buildMOC (flat list, v1.0)", () => {
  const parse: ParseResult = {
    rootTitle: "Homemade Pasta Guide",
    sections: [
      { heading: "Ingredients and Equipment", body: "", noteName: "Homemade Pasta Guide - Ingredients and Equipment" },
      { heading: "Making Fresh Dough", body: "", noteName: "Homemade Pasta Guide - Making Fresh Dough" },
      { heading: "Classic Sauce Recipes", body: "", noteName: "Homemade Pasta Guide - Classic Sauce Recipes" },
      { heading: "Wine Pairings", body: "", noteName: "Homemade Pasta Guide - Wine Pairings" },
      { heading: "Storage and Leftovers", body: "", noteName: "Homemade Pasta Guide - Storage and Leftovers" },
    ],
  };

  let result: string;
  beforeEach(() => {
    result = buildMOC(parse);
  });

  // Structure Summary
  test("H1 title at the top", () => {
    expect(result).toMatch(/^# Homemade Pasta Guide MOC\n/);
  });

  test("Generated from with wikilink", () => {
    expect(result).toContain("Generated from:");
    expect(result).toContain("[[Homemade Pasta Guide]]");
  });

  test("Sections count", () => {
    expect(result).toContain("Sections: 5");
  });

  // Flat list
  test("## Sections heading", () => {
    expect(result).toContain("## Sections");
  });

  test("all section links present", () => {
    expect(result).toContain("- [[Homemade Pasta Guide - Ingredients and Equipment]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Making Fresh Dough]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Classic Sauce Recipes]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Wine Pairings]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Storage and Leftovers]]");
  });

  test("no category headings (Development / Automation / etc.)", () => {
    expect(result).not.toContain("## Development");
    expect(result).not.toContain("## Automation");
    expect(result).not.toContain("## Operations");
    expect(result).not.toContain("## Architecture");
    expect(result).not.toContain("## Uncategorized");
  });

  test("no Categories list in header", () => {
    expect(result).not.toContain("Categories:");
  });

  test("works identically for DevOps notes", () => {
    const devOpsParse: ParseResult = {
      rootTitle: "AWS SAM",
      sections: [
        { heading: "Deploy", body: "", noteName: "AWS SAM - Deploy" },
        { heading: "CI/CD", body: "", noteName: "AWS SAM - CI-CD" },
        { heading: "Testing", body: "", noteName: "AWS SAM - Testing" },
        { heading: "Monitoring", body: "", noteName: "AWS SAM - Monitoring" },
      ],
    };
    const r = buildMOC(devOpsParse);
    expect(r).toContain("## Sections");
    expect(r).toContain("- [[AWS SAM - Deploy]]");
    expect(r).toContain("- [[AWS SAM - CI-CD]]");
    expect(r).not.toContain("## Development");
  });
});

describe("buildCategorySection (reserved for future AI MOC Generator)", () => {
  test("contains category heading, description, and links", () => {
    const items: Section[] = [
      { heading: "Deploy", body: "", noteName: "AWS SAM - Deploy" },
    ];
    const result = buildCategorySection("Development", items);
    expect(result).toContain("## Development");
    expect(result).toContain("Development, deployment and testing workflow.");
    expect(result).toContain("- [[AWS SAM - Deploy]]");
  });

  test("multiple items all appear in list", () => {
    const items: Section[] = [
      { heading: "Deploy", body: "", noteName: "AWS SAM - Deploy" },
      { heading: "Testing", body: "", noteName: "AWS SAM - Testing" },
    ];
    const result = buildCategorySection("Development", items);
    expect(result).toContain("- [[AWS SAM - Deploy]]");
    expect(result).toContain("- [[AWS SAM - Testing]]");
  });
});
