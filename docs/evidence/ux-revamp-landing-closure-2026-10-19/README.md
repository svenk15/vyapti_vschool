# Five-workspace landing closure

Date: 19 October 2026 (Asia/Kolkata)

Application source: `e00d23ee64aeceddd98c523462d23b78b8cc81fd`

Production build: `yRrZsFYC6d77Bpxhnd2cK`

Demo: `http://127.0.0.1:3400`

Human visual acceptance: **PENDING**

## Findings

| Finding | Outcome | Evidence or remaining reason |
|---|---|---|
| Parent and Student mobile summaries | Fixed | Compact label/value rows retain every factual value and supporting explanation. Actual pages measure 293 px and 277 px respectively at a 360×800 CSS viewport, DPR 1, with no root overflow. Desktop composition is unchanged. |
| Teacher content priority | Fixed | The production order is next/current register, registers to finish, today's classes, then teaching work. Submitted-register guidance is contextual and appears only when relevant. |
| Principal implementation language | Fixed | Internal queue/source terminology was replaced with operational school language. |
| Principal money | Fixed | Finance decisions use the shared currency formatter and stored minor-unit value. The current fixture renders `₹250.00`; no user-facing `minor units` copy remains. |
| Principal exact and bounded counts | Fixed | Decisions and active follow-ups are separate populations. Each summary value and section badge uses the same exact/bounded form. |
| Parent notices | Fixed evidence gap | The existing Communication demo Parent has the explicit notice purpose. No grant or fixture authority was broadened. |
| Principal follow-up meaning | Fixed | The page queries OPEN and IN_PROGRESS items and labels them active; it does not call the population due. |
| Communication coverage | Fixed | School-wide signals display read/eligible and, when required, acknowledged/eligible coverage for the latest publication. Publication count is not presented as reach. |
| Role-specific gallery | Fixed | Administrator, Teacher, Parent, Student and Principal candidates now use their production section order. Synthetic fixtures are labelled. |
| Calendar branch-local dates and ranges | Already resolved | `calendarEntryRange` maps timed instants in the branch timezone and preserves date-only inclusive ranges. Week bounds and complete-range semantics are unit tested. |
| Calendar retrieval and availability | Already resolved | Administrator, Parent and Student use authorized owner projections for the displayed week. Published/canceled events remain distinct. Unauthorized, unsupported, failed and loaded-empty states are separate. Teacher and Principal remain unsupported because Events reader authority is unresolved. |
| Calendar selection and range controls | Already resolved | Selected date is scope-bound; out-of-range week buttons are disabled; multi-day entries remain visible for each covered day. |
| Calendar recoverable failure | Verification gap | The real pages expose a retry link that reloads the same authorized route. The failed state and retry control are browser verified. There is no safe transient owner-fault injector, so a real upstream failure followed by successful recovery was not fabricated or claimed. |
| Navigation regression | Already resolved and rechecked | Eleven current-source persona/recovery states verify active protected destinations, independent desktop navigation scroll, at least 44 px rows, mobile modal focus, Escape close/focus return, visible account context and separate sign-out. Destination probes remained server authorized. |

## Screenshots

Current-source production pages are under [`personas/`](personas/):

- Administrator: `administrator-desktop.png`, `administrator-mobile.png`
- Teacher: `teacher-desktop.png`, `teacher-mobile.png`
- Parent: `parent-desktop.png`, `parent-mobile.png`, `parent-mobile-360.png`
- Student: `student-desktop.png`, `student-mobile.png`, `student-mobile-360.png`
- Principal: `principal-desktop.png`, `principal-mobile.png`
- Desktop-expanded and mobile navigation states are stored beside each page.

The committed prior-candidate images used for comparison are copied from repository `HEAD` before this correction into [`before/`](before/). This avoids relying on the unrelated modified historical screenshots in the working tree.

Direct inspection found the requested compact mobile hierarchy, corrected Teacher order, distinct Principal populations, readable formatted currency, Parent notices from an already-authorized context, and no horizontal document overflow. A final inspection also found and corrected the Principal notice subtitle running into its read count; the recaptured current-source image shows it on its own line.

## Calendar implementation reviewed

- Presentation/date model: [`components/landing-calendar-model.ts`](../../../components/landing-calendar-model.ts)
- Shared calendar component: [`components/landing-page.tsx`](../../../components/landing-page.tsx)
- Administrator adapter/composition: [`app/admin/page.tsx`](../../../app/admin/page.tsx)
- Parent adapter/composition: [`app/family/page.tsx`](../../../app/family/page.tsx)
- Student adapter/composition: [`app/student/page.tsx`](../../../app/student/page.tsx)
- Focused model tests: [`test/unit/landing-calendar-model.test.ts`](../../../test/unit/landing-calendar-model.test.ts)
- Browser states and responsive composition: [`test/e2e/landing-pages.spec.ts`](../../../test/e2e/landing-pages.spec.ts)

## Verification

| Check | Result | Provenance |
|---|---|---|
| Focused ESLint | PASS | All 13 changed source/test files; final CSS-only spacing correction does not add a lint surface. |
| `pnpm exec tsc --noEmit` | PASS | Candidate before the final presentation-only CSS correction. |
| Calendar model unit test | PASS, 3/3 | Branch timezone, inclusive all-day ranges and complete-range semantics. |
| Focused Finance PostgreSQL test | PASS, 1/1 | `-t "registers pending Finance decisions"`; validates currency-formatted decision presentation and absence of `minor units`. |
| Landing Playwright desktop | PASS, 3/3 | One worker, role-specific gallery, Administrator failed-calendar state and intermediate breakpoint. |
| Landing Playwright mobile | PASS, 2/2 | One worker; role-specific gallery plus 360 px compact reference summaries. |
| Final current-source persona/browser pass | PASS, 11/11 | Exact build `yRrZsFYC6d77Bpxhnd2cK`; all five production landings at 1440×1000 and 390×844 plus public recovery, route probes and navigation behavior. Sanitized results: [`personas/landing-verification.json`](personas/landing-verification.json). |
| Actual Parent/Student 360 px pass | PASS, 2/2 | Current production pages at 360×800 CSS pixels, DPR 1; [`personas/mobile-360-verification.json`](personas/mobile-360-verification.json). |
| Production build | PASS | `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`; build `yRrZsFYC6d77Bpxhnd2cK`. |

Specifying the complete `finance.test.ts` file once also ran four tests. Three passed and one pre-existing time-sensitive reconciliation-cutoff case failed because its fixed cutoff preceded a record created later on 19 October. The scoped changed behavior subsequently passed 1/1. The unrelated failure is not reported as passed and was not repeatedly rerun.

## Remaining boundaries

- Teacher and Principal calendar readers still need an explicit Events-owner authority decision.
- A real failure-then-recovery calendar run needs a safe transient owner-fault harness.
- Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain pending.
- No schema or migration changed in this checkpoint. Development and test remain on the previously recorded 119-migration head.

## Human review checklist

1. Open Administrator Today and confirm the summary strip, attention categories, session table, quick access and independently scrolling grouped navigation.
2. Open Teacher Today and confirm next/urgent register → registers to finish → today’s classes → teaching work, with calendar and quick access secondary.
3. Open Parent Home at 390 px and 360 px; confirm the compact summary retains the selected child’s facts and that authorized School notices appear.
4. Open Student Home at 390 px and 360 px; confirm the compact summary, focus items, notices, classes and calendar remain readable without horizontal scrolling.
5. Open Principal My day; confirm decisions and active follow-ups use consistent counts, the Finance item uses currency, the latest notice shows reach rather than publication count, and unavailable Calendar authority is stated truthfully.
