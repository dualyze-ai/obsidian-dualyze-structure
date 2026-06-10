import { Plugin, MarkdownView, Notice, Menu, TFile, TAbstractFile } from "obsidian";
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

    // コマンドパレット
    this.addCommand({
      id: "create-structure",
      name: "Create Structure",
      checkCallback: (checking) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        const file = view?.file;
        if (!file) return false;
        if (checking) return true;
        this.openStructureModal(file);
        return true;
      },
    });

    // エディタ内右クリックメニュー
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu: Menu, _editor: unknown, view: MarkdownView) => {
        const file = view.file;
        if (!file) return;
        menu.addItem((item) => {
          item
            .setTitle("Create Structure")
            .setIcon("git-fork")
            .onClick(() => this.openStructureModal(file));
        });
      })
    );

    // ファイルエクスプローラー右クリックメニュー
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu: Menu, abstractFile: TAbstractFile) => {
        if (!(abstractFile instanceof TFile) || abstractFile.extension !== "md") return;
        menu.addItem((item) => {
          item
            .setTitle("Create Structure")
            .setIcon("git-fork")
            .onClick(() => this.openStructureModal(abstractFile));
        });
      })
    );
  }

  private async openStructureModal(file: TFile) {
    const content = await this.app.vault.read(file);
    const parse = splitByH2(content, file.basename, this.settings.separator);
    if (parse.sections.length === 0) {
      new Notice("No H2 sections found.");
      return;
    }
    new ConfirmModal(this.app, parse, this.settings, () =>
      createStructure(this.app, file, this.settings)
    ).open();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
