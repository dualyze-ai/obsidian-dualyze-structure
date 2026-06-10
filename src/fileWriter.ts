import { App, TFile, normalizePath } from "obsidian";

export async function ensureFolder(app: App, folder: string): Promise<void> {
  if (!folder) return;
  const path = normalizePath(folder);
  if (!app.vault.getAbstractFileByPath(path)) {
    await app.vault.createFolder(path);
  }
}

export async function writeNote(
  app: App,
  folder: string,
  baseName: string,
  content: string
): Promise<TFile> {
  const dir = folder ? normalizePath(folder) + "/" : "";
  let name = baseName;
  let i = 1;
  while (app.vault.getAbstractFileByPath(`${dir}${name}.md`)) {
    name = `${baseName}-${i++}`;
  }
  return app.vault.create(`${dir}${name}.md`, content);
}
