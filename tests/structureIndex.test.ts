import { buildStructureIndex } from "../src/structureIndex";
import { ParseResult } from "../src/parser";

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

describe("buildStructureIndex", () => {
  let result: string;
  beforeEach(() => {
    result = buildStructureIndex(parse);
  });

  test("title is '<RootTitle> Index'", () => {
    expect(result).toContain("# Homemade Pasta Guide Index");
  });

  test("contains backlink to source note", () => {
    expect(result).toContain("Source: [[Homemade Pasta Guide]]");
  });

  test("contains ## Sections heading", () => {
    expect(result).toContain("## Sections");
  });

  test("all section wikilinks are present", () => {
    expect(result).toContain("- [[Homemade Pasta Guide - Ingredients and Equipment]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Making Fresh Dough]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Classic Sauce Recipes]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Wine Pairings]]");
    expect(result).toContain("- [[Homemade Pasta Guide - Storage and Leftovers]]");
  });

  test("does not contain ## Structure (old format)", () => {
    expect(result).not.toContain("## Structure");
  });

  test("does not contain ## Original Content", () => {
    expect(result).not.toContain("## Original Content");
  });

  test("order: title → source → ## Sections → links", () => {
    const titleIdx = result.indexOf("# Homemade Pasta Guide Index");
    const sourceIdx = result.indexOf("Source:");
    const sectionsIdx = result.indexOf("## Sections");
    const firstLink = result.indexOf("- [[");
    expect(titleIdx).toBeLessThan(sourceIdx);
    expect(sourceIdx).toBeLessThan(sectionsIdx);
    expect(sectionsIdx).toBeLessThan(firstLink);
  });
});
