# LEA-04 private Teacher feedback and Student publication

## Contract and references

- Canonical tasks: `docs/execution/VSchool_Execution_Pack/workflow-tasks/WF-TEA-29.md` and `WF-STW-22.md`.
- Approved Teacher screen: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/learning/review/w1` in expanded review mode.
- Ordered implementation CSS: `docs/execution/VSchool_Execution_Pack/references/approved/implementation-spec/sources/VSchool_Teacher_Design/style-00.css` and its `rules-index.json`.
- Product contract: two bounded plain-text fields; Teacher-only private CAS draft; explicit immutable publication; exact submitting-Student visibility; Parent exclusion; versioned correction; no change to the accepted submission.

## Direct visual comparison

| State | Approved reference | Current application | Result |
|---|---|---|---|
| Teacher private draft, desktop | `reference-private-draft-chromium.png` | `teacher-private-draft-chromium.png` | Directly inspected at 1280×1000. Matched title hierarchy, response/feedback split, field order and action placement. |
| Teacher review, desktop | `reference-review-chromium.png` | `teacher-review-chromium.png` | Directly inspected. The current dialog adds the required exact-audience confirmation and uses Publish terminology. |
| Teacher private draft/review, mobile | `reference-private-draft-mobile.png`, `reference-review-mobile.png` | `teacher-private-draft-mobile.png`, `teacher-review-mobile.png` | Directly inspected at 390×844. Cards stack, controls stay reachable and no horizontal overflow was observed. |
| Published Teacher state | No exact prototype receipt/recovery state | `teacher-published-chromium.png`, `teacher-published-mobile.png` | Labelled product extension using the established Teacher feedback patterns. |
| Student published guidance | STW-22 workflow contract; no exact populated static route matching the real receipt | `student-feedback-chromium.png`, `student-feedback-mobile.png` | Labelled product extension: feedback is embedded with the immutable accepted receipt and response. |

Reference capture metadata is in `reference-capture.json`. Full-page mobile captures stitch the real sticky mobile navigation into the long image; this is a capture artifact, not a second in-page navigation block.

The approved prototype says “return” and mentions possible Family visibility. The current-release decision deliberately uses publication, grants visibility only to the submitting Student and creates no Returned/resubmission state. Receipt recovery and correction-version presentation have no exact prototype state. These are recorded product-contract differences, not claims of pixel identity. The existing font portability exception remains.

## Verification

- `pnpm check`: PASS — lint, TypeScript/Next route types, docs, database design (95 contracts), extraction boundaries, backend compile and unit suite (33 files, 158 tests).
- Focused PostgreSQL `test/functional/learning-publication.test.ts`: PASS — 14/14, including privacy, replay, immutable versions, correction, concurrent/stale writes and revoked Teacher authority.
- `VSCHOOL_E2E=1 pnpm build`: PASS for the isolated Playwright distribution; normal `pnpm build` also passed.
- Focused Chromium desktop, one worker: PASS 1/1.
- Focused Chromium mobile, one worker: PASS 1/1.
- Test database migration state: 59 migrations, none pending. Development migration state: 59 applied.

The browser test deliberately commits a publication and aborts its response. The resulting server `destination stream closed early` line is expected; repeating the exact key/payload recovers the original receipt and one published version.

## Remaining gates

Human review is PENDING. Native VoiceOver/NVDA, font portability, TEN-03 enforcement/context proof and production readiness remain pending. Parent feedback, grades, rubrics, replies, return/reopen and resubmission are outside LEA-04.
