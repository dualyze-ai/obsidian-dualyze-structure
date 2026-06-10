# Dualyze Structure

Turn long notes into structured knowledge.

One command converts a note full of `##` headings into atomic notes, a structure index, and a MOC — all linked together automatically.

---

## What it does

```
Before                          After
──────────────────────          ──────────────────────────────────────
京都旅行ガイド.md               京都旅行ガイド.md  ← Structure Index
  ## 交通とアクセス               Generated/
  ## 人気観光スポット               ├─ 京都旅行ガイド - 交通とアクセス.md
  ## グルメ・食べ歩き              ├─ 京都旅行ガイド - 人気観光スポット.md
  ## 宿泊スポット                  ├─ 京都旅行ガイド - グルメ・食べ歩き.md
  ## 季節のイベント                ├─ 京都旅行ガイド - 宿泊スポット.md
                                   ├─ 京都旅行ガイド - 季節のイベント.md
                                   └─ 京都旅行ガイド MOC.md
```

### Generated outputs

| 出力 | 内容 |
|---|---|
| **Split Notes** | H2 セクションごとの独立したノート |
| **Parent Links** | 各分割ノートに `parent: [[元ノート]]` の frontmatter |
| **Structure Index** | 元ノートを分割ノートへのリンク一覧（目次）に変換 |
| **MOC** | カテゴリ分類された俯瞰ノート（Structure Summary 付き） |

---

## Installation

### Community plugins（推奨）

1. Obsidian の設定 → コミュニティプラグイン → 閲覧
2. 「Dualyze Structure」を検索
3. インストール → 有効化

### Manual

1. [Releases](https://github.com/kojiman55/obsidian-dualyze-structure/releases/latest) から `main.js` と `manifest.json` をダウンロード
2. Vault の `.obsidian/plugins/dualyze-structure/` フォルダに配置
3. Obsidian を再起動 → 設定 → コミュニティプラグイン → Dualyze Structure を有効化

---

## Tutorial

### 準備: ノートを用意する

H2 見出し（`##`）が2つ以上あるノートなら何でも動きます。

例として次のようなノート「**京都旅行ガイド**」があるとします。

```markdown
# 京都旅行ガイド

京都への旅行をまとめたノートです。

## 交通とアクセス

新幹線でのアクセスは東京から約2時間15分...

## 人気観光スポット

清水寺は朝8時の開門直後が空いている...

## グルメ・食べ歩き

錦市場は朝9時から多くの店が開く...

## 宿泊スポット

町家ゲストハウスが京都らしさを体験できる...

## 季節のイベント

桜の名所は円山公園の祇園枝垂桜...
```

---

### Step 1: コマンドを実行する

ノートを開いた状態でコマンドパレットを開きます（Mac: `Cmd+P` / Windows: `Ctrl+P`）。

```
┌─────────────────────────────────────────┐
│  > Dualyze                              │
│ ─────────────────────────────────────── │
│ ▶  Dualyze Structure: Create Structure  │
│    Split and structure the current note │
└─────────────────────────────────────────┘
```

`Dualyze Structure: Create Structure` を選択して実行します。

---

### Step 2: 確認ダイアログで内容を確認する

実行前に確認ダイアログが表示されます。何が作られるかを事前に確認できます。

```
┌──────────────────────────────────────────┐
│  Create structure from current note?    │
│ ──────────────────────────────────────── │
│  Root Note:  京都旅行ガイド             │
│                                          │
│  Detected Sections (5)                  │
│    • 交通とアクセス                      │
│    • 人気観光スポット                    │
│    • グルメ・食べ歩き                    │
│    • 宿泊スポット                        │
│    • 季節のイベント                      │
│                                          │
│  ✓ Split Notes (5)                      │
│  ✓ Parent Links                         │
│  ✓ Structure Index                      │
│  ✓ MOC                                  │
│                                          │
│  [ Create ]  [ Cancel ]                 │
└──────────────────────────────────────────┘
```

問題なければ **Create** をクリックします。

---

### Step 3: 生成されたファイルを確認する

`Generated/` フォルダに分割ノートと MOC が作成されます。

```
📄 京都旅行ガイド.md          ← Structure Index に変換済み
📁 Generated/
   ├─ 京都旅行ガイド - 交通とアクセス.md
   ├─ 京都旅行ガイド - 人気観光スポット.md
   ├─ 京都旅行ガイド - グルメ・食べ歩き.md
   ├─ 京都旅行ガイド - 宿泊スポット.md
   ├─ 京都旅行ガイド - 季節のイベント.md
   └─ 京都旅行ガイド MOC.md
```

---

### 生成物の詳細

#### Structure Index（元ノートが変換される）

```markdown
# 京都旅行ガイド

## Structure

- [[京都旅行ガイド - 交通とアクセス]]
- [[京都旅行ガイド - 人気観光スポット]]
- [[京都旅行ガイド - グルメ・食べ歩き]]
- [[京都旅行ガイド - 宿泊スポット]]
- [[京都旅行ガイド - 季節のイベント]]
```

#### 分割ノート（Parent Link 付き）

```markdown
---
parent: "[[京都旅行ガイド]]"
---

# 交通とアクセス

新幹線でのアクセスは東京から約2時間15分...
```

#### MOC（Structure Summary 付き）

```markdown
# 京都旅行ガイド MOC

Generated from:
[[京都旅行ガイド]]

Sections: 5

Categories:
- Uncategorized

## Uncategorized

Other notes.

- [[京都旅行ガイド - 交通とアクセス]]
- [[京都旅行ガイド - 人気観光スポット]]
- [[京都旅行ガイド - グルメ・食べ歩き]]
- [[京都旅行ガイド - 宿泊スポット]]
- [[京都旅行ガイド - 季節のイベント]]
```

> **カテゴリ分類について**: MOC はセクション見出しのキーワードでカテゴリ（Development / Automation / Operations / Architecture）を自動判定します。料理・旅行ノートのように一般的な見出しの場合は Uncategorized にまとめられます。

---

## Settings

設定 → コミュニティプラグイン → Dualyze Structure の歯車アイコンから変更できます。

| 設定 | 既定値 | 説明 |
|---|---|---|
| Output folder | `Generated` | 分割ノートと MOC の出力先（Vault ルートからの相対パス） |
| Original content | `Replace` | 元ノートの本文の扱い。`Replace`: リンク一覧に置き換え / `Keep`: 元本文を末尾に保持 |
| Generate MOC | ON | MOC を生成するかどうか |

---

## How splitting works

- ノートは `##`（H2）見出しを境界として分割されます
- `###`（H3）以下の小見出しは、その親 H2 ノートの中にそのまま含まれます
- H1 やリード文（H2 より前の本文）は分割ノートには含まれません
- ファイル名の規則: `<元ノート名> - <見出し名>`（例: `京都旅行ガイド - 交通とアクセス`）
- `CI/CD` のようにスラッシュを含む見出しはファイル名で自動的に `CI-CD` に変換されます

---

## Sample Vault

動作をすぐ試せるサンプル Vault を用意しています。

- 収録ノート: イタリアンパスタ完全ガイド・京都旅行ガイド（各 5 セクション）
- `Generated/` フォルダに完成例を収録済み（実行前後の比較が可能）

サンプル Vault の利用方法については [sample vault の README](https://github.com/kojiman55/obsidian-dualyze-structure) を参照してください。

---

## Roadmap

将来バージョンで追加予定:

- **Related Topics** — 被リンク・関連ノートの自動抽出
- **Context Pack Ready スコア** — AI Context Pack との連携スコア

---

## License

MIT
