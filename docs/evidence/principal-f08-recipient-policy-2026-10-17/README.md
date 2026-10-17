# F08-A Learning recipient policy evidence

Status: ENGINEERING_VERIFIED / F08_PARTIAL / HUMAN_REVIEW_PENDING

Approved authority is D10 in `docs/execution/PRINCIPAL_COMPLETION_PACK/02_PRODUCT_DECISIONS.md`, approved for synthetic-only implementation by the repository owner on 17 October 2026 with no exceptions. The exact approved Principal reference is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow LEA-17. That explorer specifies the denominator and permitted-evidence stages; it does not provide an exact production recipient-policy page, so `/leadership/learning/evidence` is a labelled recipe-L/dialog extension using the recorded production `SCREEN_MAP.md`.

## Implemented slice

- Exact synthetic operator designation for `RECIPIENT_POLICY_MANAGE` and separately for `RECIPIENT_STATUS_READ`, scoped to current branch, section and subject.
- Immutable, versioned recipient extension/excusal/reversal history with reviewed final confirmation, stale-value denial and exact-key replay.
- Effective deadline and excusal enforced in Student draft/submission reads and writes. Accepted attempts stay immutable and authorized receipt replay remains available.
- Parent and Student see only permitted assignment status/effective deadline. Named Principal evidence omits response, feedback and policy reason text.
- `assignment-completion.v2` counts non-excused pairs at their effective deadline and separates future and excused pairs.
- Repeat-safe Learning seed grants the existing synthetic administrator the exact class/subject capabilities without changing manual records.

F08 remains PARTIAL: the typed Coordination academic-evidence adapter, eligible academic assignee and verified follow-up outcome are F08-B.

## Persistence and verification

Forward migration `20261017160000_learning_recipient_policy` adds `vs_learning_manager_grant` and append-only `vs_learning_recipient_policy_event`. Development and `vyapti_vschool_test` each have 73 applied migrations. Both tables carry TEN-ADR-006 Path A metadata; TEN-03 remains required before production or real-client data.

Passed on committed product source `6df25c98b2b8919b30384a41cf21257da734b931`:

- `pnpm exec vitest run test/unit/learning-recipient-policy.test.ts test/unit/reporting-export.test.ts --reporter=default` — 16/16.
- `pnpm test:functional test/functional/learning-publication.test.ts -t "gives a Principal|applies exact recipient extensions"` — 2/2 with 15 intentionally skipped by filter, real PostgreSQL.
- Focused ESLint, `tsc --noEmit`, backend extraction, boundaries, documentation and 111-table database-design checks.
- Normal production build and isolated Playwright production build.
- Sequential one-worker Chromium desktop and mobile F08-A journey — 1/1 each. It verifies staged edit/review, retained edits on Back, initial dialog focus, deliberately lost response, exact confirmation recovery, persisted reload and navigation/overflow.

One earlier functional command included a literal `--`; the wrapper consequently began unrelated files. It revealed the two intended Learning failures, then was stopped. It is not reported as a suite result. The focused reruns above are the evidence.

## Visual inspection

- `application-chromium.png` and `application-mobile.png`: current evidence list after persisted extension.
- `review-chromium.png` and `review-mobile.png`: final reviewed confirmation.
- `unknown-chromium.png` and `unknown-mobile.png`: exact-retry recovery state.

The captures were inspected directly. Desktop preserves the Principal shell, bounded evidence hierarchy and focused confirmation. Mobile converts the evidence row to a readable card and the confirmation to a two-column fact grid; the first capture exposed a partially clipped secondary action, which was corrected and rerun so both actions now fit within 390×844. The approved-font portability exception and native VoiceOver/NVDA evidence remain pending.
