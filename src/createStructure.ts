import { App, Notice, TFile } from "obsidian";
import { DualyzeSettings, indexFileName, mocFileName } from "./types";
import { splitByH2 } from "./parser";
import { buildSplitNoteContent } from "./parentLink";
import { buildStructureIndex } from "./structureIndex";
import { buildMOC } from "./moc";
import { ensureFolder, writeNote } from "./fileWriter";

export async function createStructure(app: App, file: TFile, settings: DualyzeSettings) {
  const rootTitle = file.basename;
  const original = await app.vault.read(file);
  const parse = splitByH2(original, rootTitle, settings.separator);

  if (parse.sections.length === 0) {
    new Notice("No H2 sections found. Add `## ` headings first.");
    return;
  }

  await ensureFolder(app, settings.outputFolder);

  // 1 + 2. Split notes with parent links
  for (const section of parse.sections) {
    const content = buildSplitNoteContent(section, rootTitle);
    await writeNote(app, settings.outputFolder, section.noteName, content);
  }

  // 3. Structure Index — written to output folder, original file is never modified
  const indexContent = buildStructureIndex(parse);
  await writeNote(app, settings.outputFolder, indexFileName(rootTitle, settings.namingStyle), indexContent);

  // 4. MOC
  if (settings.generateMOC) {
    const mocContent = buildMOC(parse, settings);
    await writeNote(app, settings.outputFolder, mocFileName(rootTitle, settings.namingStyle), mocContent);
  }

  const n = parse.sections.length;
  new Notice(`Dualyze Structure: created ${n} ${n === 1 ? "note" : "notes"}.`);
}
