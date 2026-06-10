import { App, Modal, Setting } from "obsidian";
import { ParseResult } from "./parser";
import { DualyzeSettings } from "./types";

export class ConfirmModal extends Modal {
  constructor(
    app: App,
    private parse: ParseResult,
    private settings: DualyzeSettings,
    private onConfirm: () => void
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: "Create structure from current note?" });

    const info = contentEl.createDiv();
    info.createEl("p", { text: `Root Note: ${this.parse.rootTitle}` });

    // Detected sections preview: count + heading list
    info.createEl("p", { text: `Detected Sections (${this.parse.sections.length})` });
    const sectionList = info.createEl("ul");
    for (const s of this.parse.sections) {
      sectionList.createEl("li", { text: s.heading });
    }

    contentEl.createEl("h4", { text: "Outputs" });
    const ul = contentEl.createEl("ul");
    const n = this.parse.sections.length;
    ul.createEl("li", { text: `✓ ${n} ${n === 1 ? "Split Note" : "Split Notes"}` });
    ul.createEl("li", { text: "✓ 1 Index Note" });
    if (this.settings.generateMOC) ul.createEl("li", { text: "✓ 1 MOC Note" });

    new Setting(contentEl)
      .addButton((b) =>
        b.setButtonText("Create").setCta().onClick(() => {
          this.close();
          this.onConfirm();
        })
      )
      .addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()));
  }

  onClose() {
    this.contentEl.empty();
  }
}
