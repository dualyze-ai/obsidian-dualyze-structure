export class App {}
export class Modal {
  app: App;
  contentEl: any;
  constructor(app: App) {
    this.app = app;
    this.contentEl = {
      createEl: () => ({ createEl: () => {} }),
      createDiv: () => ({ createEl: () => {}, createDiv: () => {} }),
      empty: () => {},
    };
  }
  open() {}
  close() {}
}
export class Plugin {}
export class PluginSettingTab {}
export class Setting {
  constructor(_containerEl: any) {}
  setName(_name: string) { return this; }
  setDesc(_desc: string) { return this; }
  addText(_cb: any) { return this; }
  addDropdown(_cb: any) { return this; }
  addToggle(_cb: any) { return this; }
  addButton(_cb: any) { return this; }
}
export class Notice {
  constructor(_msg: string) {}
}
export class MarkdownView {}
export class TFile {}
export function normalizePath(path: string) { return path; }
