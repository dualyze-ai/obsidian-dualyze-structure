import { Plugin, MarkdownView, Notice } from "obsidian";
import { DualyzeSettings, DEFAULT_SETTINGS } from "./types";
import { DualyzeSettingTab } from "./settings";
import { splitByH2 } from "./parser";
import { ConfirmModal } from "./ConfirmModal";
import { createStructure } from "./createStructure";

export default class DualyzeStructurePlugin extends Plugin {
  settings: DualyzeSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new DualyzeSettingTab(this.app, this));

    this.addCommand({
      id: "create-structure",
      name: "Create Structure",
      checkCallback: (checking) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        const file = view?.file;
        if (!file) return false;
        if (checking) return true;

        this.app.vault.read(file).then((content) => {
          const parse = splitByH2(content, file.basename, this.settings.separator);
          if (parse.sections.length === 0) {
            new Notice("No H2 sections found.");
            return;
          }
          new ConfirmModal(this.app, parse, this.settings, () =>
            createStructure(this.app, file, this.settings)
          ).open();
        });
        return true;
      },
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
