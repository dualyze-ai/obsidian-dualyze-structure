import { DualyzeSettingTab } from "../src/settings";
import { DEFAULT_SETTINGS } from "../src/types";

function makeTab() {
  const plugin = {
    settings: { ...DEFAULT_SETTINGS },
    saveSettings: jest.fn().mockResolvedValue(undefined),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tab = new DualyzeSettingTab({} as any, plugin as any);
  return { tab, plugin };
}

describe("DualyzeSettingTab declarative settings", () => {
  it("defines a control for every setting key that exists in the defaults", () => {
    const { tab } = makeTab();
    const keys = tab
      .getSettingDefinitions()
      .map((d) => ("control" in d && d.control ? d.control.key : undefined));
    expect(keys).toEqual(["outputFolder", "generateMOC", "knowledgeVisualization", "namingStyle"]);
    for (const key of keys) {
      expect(DEFAULT_SETTINGS).toHaveProperty(key as string);
    }
  });

  it("dropdown options cover every allowed value", () => {
    const { tab } = makeTab();
    const dropdowns = tab
      .getSettingDefinitions()
      .flatMap((d) => ("control" in d && d.control && d.control.type === "dropdown" ? [d.control] : []));
    const byKey = Object.fromEntries(dropdowns.map((c) => [c.key, Object.keys(c.options)]));
    expect(byKey.knowledgeVisualization).toEqual(["mermaid-flowchart", "text-tree", "none"]);
    expect(byKey.namingStyle).toEqual(["spaced", "dot"]);
  });

  it("reads values from the plugin settings", () => {
    const { tab } = makeTab();
    expect(tab.getControlValue("outputFolder")).toBe(DEFAULT_SETTINGS.outputFolder);
    expect(tab.getControlValue("generateMOC")).toBe(DEFAULT_SETTINGS.generateMOC);
  });

  it("trims the output folder and persists on change", async () => {
    const { tab, plugin } = makeTab();
    await tab.setControlValue("outputFolder", "  Notes/Out  ");
    expect(plugin.settings.outputFolder).toBe("Notes/Out");
    expect(plugin.saveSettings).toHaveBeenCalledTimes(1);
  });

  it("stores other values as-is and persists", async () => {
    const { tab, plugin } = makeTab();
    await tab.setControlValue("namingStyle", "dot");
    await tab.setControlValue("generateMOC", false);
    expect(plugin.settings.namingStyle).toBe("dot");
    expect(plugin.settings.generateMOC).toBe(false);
    expect(plugin.saveSettings).toHaveBeenCalledTimes(2);
  });
});
