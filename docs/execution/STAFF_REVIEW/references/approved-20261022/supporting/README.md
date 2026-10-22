# VSchool Staff UX review and handoff

Open `mock/index.html` to explore the self-contained interactive reference. No npm install or account is needed. Files use relative links and bundled Inter. Fictional edits last in memory only and reload resets them.

Review order: Directory → Manage → personal edit → Profile → employment edit → Add staff → new Profile → portal setup review. Name and Manage intentionally do different things.

Read DESIGN_CONTRACT.md for dimensions and scope, INTERACTION_MATRIX.md for behavior and production-state requirements, and CODEX_HANDOFF.md for implementation instructions. REFERENCE_MANIFEST.json fixes the exact delivered source.

This revision is awaiting your design approval. It is not a report that production Staff is complete. Advanced eligibility, availability, employment ending, rejoining and unresolved identity/access contracts are not added to this essential mock.

QA this revision: JavaScript syntax; browser inspection of Directory/Manage/Profile; direct scoped edit and successful Save with returned focus; Add staff → new Profile with no root overflow at the inspected desktop viewport. Responsive rules included; exhaustive mobile, actual browser zoom, screen reader and real backend verification remain implementation acceptance work.

## Staff Access revision
Read STAFF_ACCESS_COVERAGE.md for the inspection-based capability map. `mock/access.js` supersedes the earlier simplified access drawer. Open Access and expand Prototype scenarios to review trust modes and command outcomes. Source inspection covers the uploaded correction snapshot, not a live Mac checkout.
