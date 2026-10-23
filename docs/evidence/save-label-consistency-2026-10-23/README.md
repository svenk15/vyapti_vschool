# Primary save-label consistency — 23 October 2026

The initial primary action now reads **Save** wherever the affected shared Administrator forms previously displayed **Save changes**:

- Appearance settings.
- Branch information in Access management.
- Staff access → Change roles.

Recovery actions retain their state-specific labels, such as **Retry save**, so an unresolved or failed operation is not presented as a new save. This presentation-only correction does not change owner commands, validation, authorization, persistence, idempotency or recovery behavior.

## Verification

- Focused ESLint for the three components and their affected Playwright specifications: passed.
- `pnpm typecheck`: passed.
- Focused Chromium journeys for appearance settings, branch settings and Staff role management, one worker: 3 passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: passed; build ID `0qrIwcMxEEJ4_ioq0vucX`.
- Repository search found no remaining user-facing `Save changes` text in `app`, `components`, `shared`, `lib`, `backend` or `test`.
- `pnpm check:docs` reached the validator and reported two broken links from unrelated, already-dirty `WORKSPACE_PRESENTATION_REVAMP` documents to a missing `workspace-presentation-route-pass-2026-10-20` evidence file. This slice did not change or stage those documents.

The verified candidate is served at `http://127.0.0.1:3400`. Human visual acceptance remains PENDING.
