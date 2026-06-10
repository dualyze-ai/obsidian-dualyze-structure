import { indexFileName, mocFileName } from "../src/types";

describe("indexFileName", () => {
  test("spaced style", () => {
    expect(indexFileName("Homemade Pasta Guide", "spaced")).toBe("Homemade Pasta Guide Index");
  });

  test("dot style", () => {
    expect(indexFileName("Homemade Pasta Guide", "dot")).toBe("Homemade Pasta Guide.structure");
  });
});

describe("mocFileName", () => {
  test("spaced style", () => {
    expect(mocFileName("Kyoto Travel Guide", "spaced")).toBe("Kyoto Travel Guide MOC");
  });

  test("dot style", () => {
    expect(mocFileName("Kyoto Travel Guide", "dot")).toBe("Kyoto Travel Guide.moc");
  });
});
