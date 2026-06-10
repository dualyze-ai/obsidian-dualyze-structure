import { App, PluginSettingTab, Setting } from "obsidian";
import DualyzeStructurePlugin from "./main";
import { NamingStyle, KnowledgeVisualization } from "./types";

export class DualyzeSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: DualyzeStructurePlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Output folder")
      .setDesc("Folder for split notes, index, and MOC (relative to vault root).")
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
      .setDesc("Choose how to visualize the generated knowledge structure in MOC.")
      .addDropdown((d) =>
        d
          .addOption("mermaid-flowchart", "Mermaid Flowchart")
          .addOption("text-tree", "Text Tree")
          .addOption("none", "None")
          .setValue(this.plugin.settings.knowledgeVisualization)
          .onChange(async (v) => {
            this.plugin.settings.knowledgeVisualization = v as KnowledgeVisualization;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("File naming style")
      .setDesc(
        'Spaced: "Title Index" / "Title MOC"  ·  Dot: "Title.structure" / "Title.moc"'
      )
      .addDropdown((d) =>
        d
          .addOption("spaced", "Spaced  (Title Index / Title MOC)")
          .addOption("dot", "Dot  (Title.structure / Title.moc)")
          .setValue(this.plugin.settings.namingStyle)
          .onChange(async (v) => {
            this.plugin.settings.namingStyle = v as NamingStyle;
            await this.plugin.saveSettings();
          })
      );
  }
}
