# STF-05 dated teaching eligibility evidence

Human review: **PENDING**.

Source before checkpoint: `3efaf4db`. The implementation adds Academics-owned half-open eligibility revisions, a People Employee-facts port, an Attendance frozen-session-impact port and the authorized Staff Profile handoff. Access roles remain independent.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/teacher-eligibility.test.ts` — 2/2 passed.
- `pnpm test:functional test/functional/people-employees.test.ts` — 14/14 passed against real PostgreSQL after both STF-05 forward migrations applied.
- Development migration rehearsal: 2 existing Teachers produced 2 unsuperseded `MIGRATION` revisions with null migration actors; no source dates were fabricated.
- `pnpm check:db-design` — passed with 205 registered table contracts.
- `pnpm check:backend` and `pnpm check:boundaries` — passed during implementation.

Captures in this directory are application evidence from the dedicated synthetic E2E database; human acceptance and native accessibility remain pending.

## Current-source browser and presentation evidence

- Focused Chromium at 1440×1000: 1/1 passed.
- Focused Mobile Chromium at 390×844: 1/1 passed.
- The same production composition was inspected at 900×1000 and 360×800. Four 900px captures exercise Forest, Amethyst, Porcelain and Linen tokens through the isolated visual-test harness; the override is not persisted application configuration.
- The E2E production build completed with `VSCHOOL_E2E=1` and a 4 GiB Node heap. It serves `.next-e2e`, as required by the repository harness.
- Lost-response recovery reused the original command key and exact payload. A later change used a fresh key and produced a second, non-duplicated eligibility revision.
- The final mobile action order follows the frozen reference: primary **Review and save**, then **Cancel**. Desktop actions remain right aligned.

The frozen reference is the reviewed Staff prototype at commit `ad78b1c95102ed33ecaa938f9a4b29e2c854d0e7` (prototype SHA-256 `67ca61b0204bac68c7bc7602e02b3c638305b448d377e79be4bbff9cce474a01`). Direct comparison covered the teaching form at 1440×1000, 900×1000, 390×844 and 360×800. The production page uses the approved 760px form width, shared local tabs, spacing, labels and action hierarchy.

Recorded differences are data or reviewer-boundary differences rather than silent visual substitutions:

- The prototype reviewer toolbar is not a production control.
- The frozen fictional example shows an affected Grade 8A assignment. The authorized synthetic employee used by the browser journey has no current or future assignments, so the production impact callout states that fact.
- **Availability** is an optional local destination. The test persona's live authorization probe did not expose it; the page did not fabricate the tab.

Human visual acceptance, native accessibility and TEN-03 production evidence remain PENDING.
