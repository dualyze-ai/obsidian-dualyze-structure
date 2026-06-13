# How Alice Turned a 5,000-Line Note into a Structured Knowledge Base

Alice has a note called `AWS Complete Guide.md`.

It started as a quick reference. Over eighteen months it grew to 5,000 lines covering Lambda, API Gateway, DynamoDB, SAM, and more — all in one file.

She can't find anything in it anymore.

Bob introduces Dualyze Structure.

---

## The problem: one note, everything inside

---

**Alice:**
I have this AWS guide that used to be useful. Now it's just… a wall of text. I search for "DynamoDB" and get forty results inside the same file.

**Bob:**
How long is it?

**Alice:**
About 5,000 lines. I kept adding to it because I didn't want to lose anything.

**Bob:**
That's the problem. One note works fine at 200 lines. At 5,000, it becomes a black hole — information goes in, never comes out.

**Alice:**
I thought about splitting it manually, but there are probably thirty sections. That would take hours.

**Bob:**
Right-click the note and choose **Create Structure**. Let Dualyze Structure do it.

---

## Step 1: Preview what gets created

---

**Alice:**
A dialog opened. It's showing me a list of detected sections:

```
Introduction
Lambda
API Gateway
DynamoDB
SAM
Networking
IAM
CloudWatch
...
```

There are 11 sections. And at the bottom it says "11 split notes + 1 index + 1 MOC will be created."

**Bob:**
That preview is the confirmation step. Nothing is written until you click Create.

**Alice:**
These are exactly the `##` headings I wrote. It found all of them.

**Bob:**
Every `##` heading becomes its own note. `###` subheadings stay inside their parent — they don't get split further.

**Alice:**
So my `## Lambda` section with `### Cold Starts`, `### Layers`, `### Concurrency` underneath — those all stay together in one `Lambda.md`?

**Bob:**
Exactly.

> **💡 What is Structure Split?**
> Dualyze Structure reads every `##` (H2) heading in a note and creates one independent file per section. Subheadings (`###` and deeper) stay inside their parent file. The original note is rewritten as a clean index of links — nothing is deleted.

---

## Step 2: Run it

---

**Alice:**
I clicked Create. It finished instantly. What happened?

**Bob:**
Open your file explorer.

**Alice:**
There's a folder now — `AWS Complete Guide/` — and inside:

```
AWS Complete Guide - Introduction.md
AWS Complete Guide - Lambda.md
AWS Complete Guide - API Gateway.md
AWS Complete Guide - DynamoDB.md
AWS Complete Guide - SAM.md
...
AWS Complete Guide.md          ← the original, rewritten
AWS Complete Guide MOC.md      ← new
```

**Bob:**
Open the original `AWS Complete Guide.md`.

**Alice:**
It's been turned into a link list:

```markdown
# AWS Complete Guide

## Structure

- [[AWS Complete Guide - Introduction]]
- [[AWS Complete Guide - Lambda]]
- [[AWS Complete Guide - API Gateway]]
- [[AWS Complete Guide - DynamoDB]]
- [[AWS Complete Guide - SAM]]
...
```

**Bob:**
That's the Structure Index. It's your navigation hub. One click to any section.

**Alice:**
And each split note — I'm opening Lambda — it has `parent: "[[AWS Complete Guide]]"` in the frontmatter. So I can always navigate back.

**Bob:**
Backlinks work automatically from there.

---

## Step 3: The MOC and Knowledge Map

---

**Alice:**
Now I'm opening `AWS Complete Guide MOC.md`. There's a Mermaid diagram in here.

**Bob:**
That's the Knowledge Map. It shows every split note as a node connected to the parent.

**Alice:**
I can see all eleven sections laid out visually. Lambda connects to the parent. DynamoDB connects. SAM connects. I can see the whole architecture at once.

**Bob:**
That's the difference between a big note and a knowledge base. One is a document. The other is a navigable structure.

**Alice:**
And I didn't have to do any of this manually.

> **💡 What is the MOC?**
> The MOC (Map of Content) is generated automatically alongside the split notes. It lists all related notes and includes a visual Knowledge Map — a Mermaid flowchart showing how the split notes relate to the original source. It serves as an overview of the whole topic.

---

## The full transformation

```text
AWS Complete Guide.md (5,000 lines, one file)
        ↓
  Create Structure
        ↓
AWS Complete Guide - Introduction.md
AWS Complete Guide - Lambda.md
AWS Complete Guide - API Gateway.md
AWS Complete Guide - DynamoDB.md
AWS Complete Guide - SAM.md
...
        +
AWS Complete Guide.md       (Structure Index — navigation hub)
AWS Complete Guide MOC.md   (Knowledge Map + full note list)
```

---

## Closing

---

**Alice:**
I've spent the last year stuffing everything into one file because I was afraid to split it. This took about three seconds.

**Bob:**
The fear of splitting is usually about losing the overview. The Structure Index and MOC solve that — you keep the overview, and now each section is also independently searchable.

**Alice:**
Before, searching "DynamoDB" returned noise from everywhere in the file. Now it returns exactly one note: `AWS Complete Guide - DynamoDB.md`.

**Bob:**
That's the point. Structure isn't about breaking things apart. It's about making things findable.

**Alice:**
I have a React guide that's even longer. I'm running this on that next.

---

## Next Steps

- [README](../../README.md)
- [Sample Vault](../../docs/) — five demo notes ready to try
