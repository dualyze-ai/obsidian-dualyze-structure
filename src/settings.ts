import { App, PluginSettingTab, Setting } from "obsidian";
import DualyzeStructurePlugin from "./main";

export class DualyzeSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: DualyzeStructurePlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Output folder")
      .setDesc("Folder for split notes and MOC (relative to vault root).")
      .addText((t) =>
        t.setValue(this.plugin.settings.outputFolder).onChange(async (v) => {
          this.plugin.settings.outputFolder = v.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Original content")
      .setDesc("How to treat the original note body.")
      .addDropdown((d) =>
        d
          .addOption("replace", "Replace")
          .addOption("keep", "Keep Original")
          .setValue(this.plugin.settings.originalContent)
          .onChange(async (v) => {
            this.plugin.settings.originalContent = v as "replace" | "keep";
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
  }
}
