import { writeNote, ensureFolder } from "../src/fileWriter";

function makeApp(existingPaths: string[] = []) {
  const created: { path: string; content: string }[] = [];
  const app = {
    vault: {
      getAbstractFileByPath: (path: string) =>
        existingPaths.includes(path) || created.some((f) => f.path === path)
          ? { path }
          : null,
      create: async (path: string, content: string) => {
        created.push({ path, content });
        return { path, extension: "md" } as any;
      },
      createFolder: async (_path: string) => {},
    },
  } as any;
  return { app, created };
}

describe("writeNote — collision avoidance", () => {
  test("writes to the base name when no conflict exists", async () => {
    const { app, created } = makeApp([]);
    await writeNote(app, "Generated", "My Note", "content");
    expect(created[0].path).toBe("Generated/My Note.md");
  });

  test("appends -1 when base name already exists", async () => {
    const { app, created } = makeApp(["Generated/My Note.md"]);
    await writeNote(app, "Generated", "My Note", "content");
    expect(created[0].path).toBe("Generated/My Note-1.md");
  });

  test("appends -2 when -1 also exists", async () => {
    const { app, created } = makeApp(["Generated/My Note.md", "Generated/My Note-1.md"]);
    await writeNote(app, "Generated", "My Note", "content");
    expect(created[0].path).toBe("Generated/My Note-2.md");
  });

  test("writes correct content even when suffix is added", async () => {
    const { app, created } = makeApp(["Generated/My Note.md"]);
    await writeNote(app, "Generated", "My Note", "hello world");
    expect(created[0].content).toBe("hello world");
  });
});

describe("ensureFolder", () => {
  test("creates the folder when it does not exist", async () => {
    const created: string[] = [];
    const app = {
      vault: {
        getAbstractFileByPath: () => null,
        createFolder: async (path: string) => { created.push(path); },
      },
    } as any;
    await ensureFolder(app, "Generated");
    expect(created).toContain("Generated");
  });

  test("does not create the folder when it already exists", async () => {
    const created: string[] = [];
    const app = {
      vault: {
        getAbstractFileByPath: () => ({ path: "Generated" }),
        createFolder: async (path: string) => { created.push(path); },
      },
    } as any;
    await ensureFolder(app, "Generated");
    expect(created).toHaveLength(0);
  });
});
