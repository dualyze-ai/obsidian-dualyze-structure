import { classify, buildMOC, buildCategorySection, sanitizeFlowchartLabel } from "../src/moc";
import { ParseResult } from "../src/parser";
import { Section, DualyzeSettings, DEFAULT_SETTINGS } from "../src/types";

function makeSettings(knowledgeVisualization: DualyzeSettings["knowledgeVisualization"]): DualyzeSettings {
  return { ...DEFAULT_SETTINGS, knowledgeVisualization };
}

const pastaParse: ParseResult = {
  rootTitle: "Homemade Pasta Guide",
  sections: [
    { heading: "Ingredients and Equipment", body: "", noteName: "Homemade Pasta Guide - Ingredients and Equipment", subsections: [] },
    { heading: "Making Fresh Dough",        body: "", noteName: "Homemade Pasta Guide - Making Fresh Dough",        subsections: [] },
    { heading: "Classic Sauce Recipes",     body: "", noteName: "Homemade Pasta Guide - Classic Sauce Recipes",     subsections: [] },
    { heading: "Wine Pairings",             body: "", noteName: "Homemade Pasta Guide - Wine Pairings",             subsections: [] },
    { heading: "Storage and Leftovers",     body: "", noteName: "Homemade Pasta Guide - Storage and Leftovers",     subsections: [] },
  ],
};

const kyotoParse: ParseResult = {
  rootTitle: "Kyoto Travel Guide",
  sections: [
    { heading: "Getting Around",  body: "", noteName: "Kyoto Travel Guide - Getting Around",  subsections: [] },
    { heading: "Top Attractions", body: "", noteName: "Kyoto Travel Guide - Top Attractions", subsections: [] },
    { heading: "Food and Dining", body: "", noteName: "Kyoto Travel Guide - Food and Dining", subsections: [] },
    { heading: "Where to Stay",   body: "", noteName: "Kyoto Travel Guide - Where to Stay",   subsections: [] },
    { heading: "Seasonal Events", body: "", noteName: "Kyoto Travel Guide - Seasonal Events", subsections: [] },
  ],
};

// ---------------------------------------------------------------------------
// classify (reserved for future AI MOC Generator)
// ---------------------------------------------------------------------------

describe("classify (reserved for future AI MOC Generator)", () => {
  test("Deploy → Development",           () => expect(classify("Deploy")).toBe("Development"));
  test("Deployment → Development",       () => expect(classify("Deployment")).toBe("Development"));
  test("Testing → Development",          () => expect(classify("Testing")).toBe("Development"));
  test("Build → Development",            () => expect(classify("Build Optimization")).toBe("Development"));
  test("CI/CD → Automation",             () => expect(classify("CI/CD")).toBe("Automation"));
  test("Pipeline → Automation",          () => expect(classify("Pipeline Setup")).toBe("Automation"));
  test("GitHub Actions → Automation",    () => expect(classify("GitHub Actions Workflow")).toBe("Automation"));
  test("Monitoring → Operations",        () => expect(classify("Monitoring")).toBe("Operations"));
  test("Logging → Operations",           () => expect(classify("Logging Setup")).toBe("Operations"));
  test("CloudWatch → Operations",        () => expect(classify("CloudWatch Alerts")).toBe("Operations"));
  test("Architecture → Architecture",    () => expect(classify("Architecture Overview")).toBe("Architecture"));
  test("Design → Architecture",          () => expect(classify("Design Patterns")).toBe("Architecture"));
  test("Unknown keyword → Uncategorized",() => expect(classify("Random Topic")).toBe("Uncategorized"));

  test("case-insensitive", () => {
    expect(classify("DEPLOY")).toBe("Development");
    expect(classify("dEpLoY")).toBe("Development");
  });

  test("general topics → Uncategorized", () => {
    expect(classify("Ingredients and Equipment")).toBe("Uncategorized");
    expect(classify("Getting Around")).toBe("Uncategorized");
    expect(classify("Wine Pairings")).toBe("Uncategorized");
    expect(classify("Where to Stay")).toBe("Uncategorized");
    expect(classify("Seasonal Events")).toBe("Uncategorized");
  });
});

// ---------------------------------------------------------------------------
// sanitizeFlowchartLabel
// ---------------------------------------------------------------------------

describe("sanitizeFlowchartLabel", () => {
  test("replaces double quotes with single quotes", () => {
    expect(sanitizeFlowchartLabel('He said "Hello"')).toBe("He said 'Hello'");
  });
  test("plain text unchanged", () => {
    expect(sanitizeFlowchartLabel("Getting Around")).toBe("Getting Around");
  });
  test("colons are kept as-is", () => {
    expect(sanitizeFlowchartLabel("Key: Value")).toBe("Key: Value");
  });
  test("brackets are kept as-is", () => {
    expect(sanitizeFlowchartLabel("Step [1]")).toBe("Step [1]");
  });
});

// ---------------------------------------------------------------------------
// buildMOC — shared structure (all modes)
// ---------------------------------------------------------------------------

describe("buildMOC — shared structure", () => {
  test.each(["mermaid-flowchart", "text-tree", "none"] as const)("H1 title (%s)", (mode) => {
    expect(buildMOC(pastaParse, makeSettings(mode))).toMatch(/^# Homemade Pasta Guide MOC\n/);
  });

  test.each(["mermaid-flowchart", "text-tree", "none"] as const)("Generated from (%s)", (mode) => {
    const r = buildMOC(pastaParse, makeSettings(mode));
    expect(r).toContain("Generated from:\n[[Homemade Pasta Guide]]");
  });

  test.each(["mermaid-flowchart", "text-tree", "none"] as const)("Sections count (%s)", (mode) => {
    expect(buildMOC(pastaParse, makeSettings(mode))).toContain("Sections: 5");
  });

  test.each(["mermaid-flowchart", "text-tree", "none"] as const)("## Overview (%s)", (mode) => {
    const r = buildMOC(pastaParse, makeSettings(mode));
    expect(r).toContain("## Overview");
    expect(r).toContain("This MOC provides a navigation hub for the structured notes generated from [[Homemade Pasta Guide]].");
  });

  test.each(["mermaid-flowchart", "text-tree", "none"] as const)("## Related Notes as bullet list (%s)", (mode) => {
    const r = buildMOC(pastaParse, makeSettings(mode));
    expect(r).toContain("## Related Notes");
    for (const s of pastaParse.sections) {
      expect(r).toContain(`- [[${s.noteName}]]`);
    }
  });
});

// ---------------------------------------------------------------------------
// buildMOC — mermaid-flowchart mode
// ---------------------------------------------------------------------------

describe("buildMOC — mermaid-flowchart", () => {
  let result: string;
  beforeEach(() => { result = buildMOC(kyotoParse, makeSettings("mermaid-flowchart")); });

  test("has ## Knowledge Map heading", () => {
    expect(result).toContain("## Knowledge Map");
  });

  test("has mermaid code fence", () => {
    expect(result).toContain("```mermaid");
  });

  test("starts with %%{init}%% then flowchart LR", () => {
    const mermaidBlock = result.match(/```mermaid\n([\s\S]*?)\n```/)?.[1] ?? "";
    expect(mermaidBlock).toMatch(/^%%\{init:/);
    expect(mermaidBlock).toContain("flowchart LR");
  });

  test("root node uses quoted label format", () => {
    expect(result).toContain('root["Kyoto Travel Guide"]');
  });

  test("sections have safe node IDs with quoted labels", () => {
    expect(result).toContain('s1["Getting Around"]');
    expect(result).toContain('s2["Top Attractions"]');
    expect(result).toContain('s5["Seasonal Events"]');
  });

  test("arrows connect root to each section", () => {
    expect(result).toContain("root --> s1");
    expect(result).toContain("root --> s5");
  });

  test("H2 order is maintained (s1 before s5)", () => {
    const s1idx = result.indexOf("s1[");
    const s5idx = result.indexOf("s5[");
    expect(s1idx).toBeLessThan(s5idx);
  });

  test("note names do not appear inside the mermaid block", () => {
    const mermaidBlock = result.match(/```mermaid\n([\s\S]*?)\n```/)?.[1] ?? "";
    expect(mermaidBlock).not.toContain("Kyoto Travel Guide - Getting Around");
  });

  test("no ## Knowledge Tree heading", () => {
    expect(result).not.toContain("## Knowledge Tree");
  });
});

// ---------------------------------------------------------------------------
// buildMOC — text-tree mode
// ---------------------------------------------------------------------------

describe("buildMOC — text-tree", () => {
  let result: string;
  beforeEach(() => { result = buildMOC(kyotoParse, makeSettings("text-tree")); });

  test("has ## Knowledge Tree heading", () => {
    expect(result).toContain("## Knowledge Tree");
  });

  test("has text code fence", () => {
    expect(result).toContain("```text");
  });

  test("root title on first line of tree", () => {
    expect(result).toContain("Kyoto Travel Guide\n");
  });

  test("├─ for non-last items", () => {
    expect(result).toContain("├─ [[Kyoto Travel Guide - Getting Around]]");
    expect(result).toContain("├─ [[Kyoto Travel Guide - Top Attractions]]");
    expect(result).toContain("├─ [[Kyoto Travel Guide - Where to Stay]]");
  });

  test("└─ for last item only", () => {
    expect(result).toContain("└─ [[Kyoto Travel Guide - Seasonal Events]]");
    expect(result).not.toContain("└─ [[Kyoto Travel Guide - Getting Around]]");
  });

  test("no ## Knowledge Map heading", () => {
    expect(result).not.toContain("## Knowledge Map");
  });
});

// ---------------------------------------------------------------------------
// buildMOC — none mode
// ---------------------------------------------------------------------------

describe("buildMOC — none", () => {
  let result: string;
  beforeEach(() => { result = buildMOC(kyotoParse, makeSettings("none")); });

  test("no ## Knowledge Map", ()  => expect(result).not.toContain("## Knowledge Map"));
  test("no ## Knowledge Tree", () => expect(result).not.toContain("## Knowledge Tree"));
  test("no code fence",        () => expect(result).not.toContain("```"));

  test("Overview and Related Notes are still present", () => {
    expect(result).toContain("## Overview");
    expect(result).toContain("## Related Notes");
  });
});

// ---------------------------------------------------------------------------
// buildMOC — single section edge case
// ---------------------------------------------------------------------------

describe("buildMOC — single section", () => {
  const singleParse: ParseResult = {
    rootTitle: "French Press Coffee Guide",
    sections: [
      { heading: "Brewing Method", body: "", noteName: "French Press Coffee Guide - Brewing Method", subsections: [] },
    ],
  };

  test("text-tree: single item uses └─ only", () => {
    const r = buildMOC(singleParse, makeSettings("text-tree"));
    expect(r).toContain("└─ [[French Press Coffee Guide - Brewing Method]]");
    expect(r).not.toContain("├─");
  });

  test("mermaid-flowchart: single child has correct structure", () => {
    const r = buildMOC(singleParse, makeSettings("mermaid-flowchart"));
    expect(r).toContain('root["French Press Coffee Guide"]');
    expect(r).toContain('root --> s1["Brewing Method"]');
  });
});

// ---------------------------------------------------------------------------
// buildCategorySection (reserved for future AI MOC Generator)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// buildMOC — flowchart with H3 subsections
// ---------------------------------------------------------------------------

describe("buildMOC — mermaid-flowchart with subsections", () => {
  const withSubsParse: ParseResult = {
    rootTitle: "History of Western Art",
    sections: [
      {
        heading: "Ancient and Classical",
        body: "",
        noteName: "History of Western Art - Ancient and Classical",
        subsections: ["Greece", "Rome"],
      },
      {
        heading: "Renaissance",
        body: "",
        noteName: "History of Western Art - Renaissance",
        subsections: ["Early Renaissance", "High Renaissance", "Northern Renaissance"],
      },
      {
        heading: "Modern and Contemporary",
        body: "",
        noteName: "History of Western Art - Modern and Contemporary",
        subsections: [],
      },
    ],
  };

  let result: string;
  beforeEach(() => { result = buildMOC(withSubsParse, makeSettings("mermaid-flowchart")); });

  test("H3 subsections appear as child nodes under their H2", () => {
    expect(result).toContain('s1_1["Greece"]');
    expect(result).toContain('s1_2["Rome"]');
    expect(result).toContain('s2_1["Early Renaissance"]');
    expect(result).toContain('s2_3["Northern Renaissance"]');
  });

  test("arrows connect H2 to its H3 subsections", () => {
    expect(result).toContain("s1 --> s1_1");
    expect(result).toContain("s1 --> s1_2");
    expect(result).toContain("s2 --> s2_1");
  });

  test("section without subsections has no child nodes", () => {
    expect(result).not.toContain("s3 --> s3_1");
  });

  test("root still connects to all H2 sections", () => {
    expect(result).toContain("root --> s1");
    expect(result).toContain("root --> s2");
    expect(result).toContain("root --> s3");
  });
});

// ---------------------------------------------------------------------------
// buildCategorySection (reserved for future AI MOC Generator)
// ---------------------------------------------------------------------------

describe("buildCategorySection (reserved for future AI MOC Generator)", () => {
  test("contains category heading, description, and links", () => {
    const items: Section[] = [
      { heading: "Deploy", body: "", noteName: "AWS SAM - Deploy", subsections: [] },
    ];
    const result = buildCategorySection("Development", items);
    expect(result).toContain("## Development");
    expect(result).toContain("Development, deployment and testing workflow.");
    expect(result).toContain("- [[AWS SAM - Deploy]]");
  });

  test("multiple items all appear in list", () => {
    const items: Section[] = [
      { heading: "Deploy",   body: "", noteName: "AWS SAM - Deploy",   subsections: [] },
      { heading: "Testing",  body: "", noteName: "AWS SAM - Testing",  subsections: [] },
    ];
    const result = buildCategorySection("Development", items);
    expect(result).toContain("- [[AWS SAM - Deploy]]");
    expect(result).toContain("- [[AWS SAM - Testing]]");
  });
});
