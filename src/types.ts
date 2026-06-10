export interface DualyzeSettings {
  /** 分割ノートと MOC の出力先フォルダ（Vault ルートからの相対 / 空文字なら元ノートと同階層） */
  outputFolder: string;
  /** 元ノート本文の扱い */
  originalContent: "replace" | "keep";
  /** MOC を生成するか */
  generateMOC: boolean;
  /** ファイル名のセパレータ（既定 " - "） */
  separator: string;
}

export const DEFAULT_SETTINGS: DualyzeSettings = {
  outputFolder: "Generated",
  originalContent: "keep",
  generateMOC: true,
  separator: " - ",
};

/** 分割された 1 セクション */
export interface Section {
  /** H2 見出しテキスト（# は含まない） */
  heading: string;
  /** セクション本文（見出し行を除いた中身） */
  body: string;
  /** ファイル名安全化後のベース名: "<RootTitle> - <Heading>" */
  noteName: string;
}

/** MOC のカテゴリ */
export type Category = "Development" | "Automation" | "Operations" | "Architecture" | "Uncategorized";

export interface CreateResult {
  rootTitle: string;
  sections: Section[];
}
