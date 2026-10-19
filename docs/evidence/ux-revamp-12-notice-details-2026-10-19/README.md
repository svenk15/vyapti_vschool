# UX-12 Parent and Student notice detail regression

Date: 19 October 2026 (Asia/Kolkata)

- Source: `d8ebad1`; standard build `W4fweDwPT7U_tJ7747JKm`.
- Application routes: `/family/notices/[id]` and `/student/notices/[id]` using existing fictional, purpose-scoped published notices.
- Approved workflow references: Parent `#/flow/PAR-14` and Student `#/flow/STW-27` in their respective review HTML files.
- Viewports: `1440×1000` and `390×844`, DPR 1. Playwright viewport emulation is not actual browser zoom.

The supplied references are workflow explorers rather than exact production notice-detail screens. They establish title/context, explicit read or acknowledgement action, changed/withdrawn recovery and the distinction between read, acknowledgement and consent. The application uses the shared record-detail recipe with real immutable publication metadata, current child/Student context, safe acknowledgement copy and a clear return path. Parent reminder provenance remains visible; Student acknowledgement explicitly states that it is not event permission or guardian consent.

All four reference/application captures were directly inspected. Desktop preserves readable bounded content and role navigation. Mobile linearizes context, title, notice, warning, action and return navigation above the existing fixed role navigation without root overflow. No current-source presentation defect was found. The only comparison deviation is structural: the explorer shows generic steps/support cards while the application opens one already-selected authorized notice. This is a shared-pattern review pending human acceptance, not a claim of pixel identity.

No code or owner contract changed. UX-11's current-source Communication browser evidence remains applicable because the intervening UX-12 selectors are Student-record-specific. Files: `reference-{parent,student}-{desktop,mobile}.png`, `application-{parent,student}-{desktop,mobile}.png`, and `metrics.json`. Native accessibility, actual browser zoom, TEN-03 and production release remain pending.
