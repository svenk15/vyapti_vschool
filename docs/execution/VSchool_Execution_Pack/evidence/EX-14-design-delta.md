# EX-14 design delta — consolidated candidate gate

Date: 10 October 2026

- **Target:** verify the integrated EX-00–EX-13 candidate without changing owner behavior, schema or authorization.
- **Routes:** render every implemented public, administrator and teacher page family with real guarded demo identities at desktop/mobile sizes; inspect representative authentication, directory, import and teacher-task captures.
- **Persistence:** run the existing 31-migration dedicated-test-database harness. No development-data mutation is needed beyond the already verified EX-13 seed.
- **Security:** retain negative authorization, revocation, scope, replay, concurrency and integrity cases in the full suites. No hidden navigation result substitutes for endpoint authorization.
- **Accessibility evidence:** exercise existing keyboard/focus and simulated layout-zoom cases. Native VoiceOver/NVDA and native browser 200% zoom remain unperformed and therefore open.
- **Acceptance:** `pnpm check`, the complete PostgreSQL functional suite, the complete desktop/mobile Playwright suite, explicit production build, and the rendered-route audit must pass on the integrated source. Human review remains PENDING.

No contract or migration delta is introduced by this verification slice.
