import { App, PluginSettingTab, Setting } from "obsidian";
import type { SettingDefinitionItem } from "obsidian";
import DualyzeStructurePlugin from "./main";
import { NamingStyle, KnowledgeVisualization } from "./types";

const VISUALIZATION_OPTIONS: Record<KnowledgeVisualization, string> = {
  "mermaid-flowchart": "Mermaid Flowchart",
  "text-tree": "Text Tree",
  none: "None",
};

const NAMING_OPTIONS: Record<NamingStyle, string> = {
  spaced: "Spaced  (Title Index / Title MOC)",
  dot: "Dot  (Title.structure / Title.moc)",
};

const OUTPUT_FOLDER_DESC = "Folder for split notes, index, and MOC (relative to vault root).";
const VISUALIZATION_DESC = "Choose how to visualize the generated knowledge structure in MOC.";
const NAMING_DESC = 'Spaced: "Title Index" / "Title MOC"  ·  Dot: "Title.structure" / "Title.moc"';

export class DualyzeSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: DualyzeStructurePlugin) {
    super(app, plugin);
  }

  // Declarative settings for Obsidian 1.13+ (makes settings searchable).
  // display() below remains as the fallback for older versions.
  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        name: "Output folder",
        desc: OUTPUT_FOLDER_DESC,
        control: { type: "text", key: "outputFolder" },
      },
      {
        name: "Generate MOC",
        control: { type: "toggle", key: "generateMOC" },
      },
      {
        name: "Knowledge visualization",
        desc: VISUALIZATION_DESC,
        control: { type: "dropdown", key: "knowledgeVisualization", options: VISUALIZATION_OPTIONS },
      },
      {
        name: "File naming style",
        desc: NAMING_DESC,
        control: { type: "dropdown", key: "namingStyle", options: NAMING_OPTIONS },
      },
    ];
  }

  getControlValue(key: string): unknown {
    return (this.plugin.settings as unknown as Record<string, unknown>)[key];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const settings = this.plugin.settings as unknown as Record<string, unknown>;
    settings[key] = key === "outputFolder" && typeof value === "string" ? value.trim() : value;
    await this.plugin.saveSettings();
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Output folder")
      .setDesc(OUTPUT_FOLDER_DESC)
      .addText((t) =>
        t.setValue(this.plugin.settings.outputFolder).onChange(async (v) => {
          this.plugin.settings.outputFolder = v.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Generate MOC")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.generateMOC).onChange(async (v) => {
          this.plugin.settings.generateMOC = v;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Knowledge visualization")
      .setDesc(VISUALIZATION_DESC)
      .addDropdown((d) =>
        d
          .addOptions(VISUALIZATION_OPTIONS)
          .setValue(this.plugin.settings.knowledgeVisualization)
          .onChange(async (v) => {
            this.plugin.settings.knowledgeVisualization = v as KnowledgeVisualization;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("File naming style")
      .setDesc(NAMING_DESC)
      .addDropdown((d) =>
        d
          .addOptions(NAMING_OPTIONS)
          .setValue(this.plugin.settings.namingStyle)
          .onChange(async (v) => {
            this.plugin.settings.namingStyle = v as NamingStyle;
            await this.plugin.saveSettings();
          })
      );
  }
}
