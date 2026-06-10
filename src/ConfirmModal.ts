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

    const ul = contentEl.createEl("ul");
    ["Split Notes", "Parent Links"].forEach((t) =>
      ul.createEl("li", { text: `✓ ${t}` })
    );
    if (this.settings.generateMOC) ul.createEl("li", { text: "✓ MOC" });

    // Show what will happen to the original note
    const originalMode = this.settings.originalContent === "replace"
      ? "✓ Structure Index (original body will be replaced with links)"
      : "✓ Structure Index (original body will be kept at the bottom)";
    ul.createEl("li", { text: originalMode });

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
