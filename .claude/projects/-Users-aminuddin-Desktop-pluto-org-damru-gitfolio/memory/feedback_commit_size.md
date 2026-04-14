---
name: Commit granularity
description: User prefers small, focused commits — not large single commits touching many files
type: feedback
---

Do not bundle large changes into a single commit. Split work into small, logical commits where each one tells a clear story.

**Why:** User explicitly called out a 22-file single commit as bad practice.

**How to apply:** When implementing a feature that touches many files, plan the commit sequence upfront and commit in layers — e.g. types/config first, then components, then pages, then wiring. Each commit should be independently reviewable and bisectable.
