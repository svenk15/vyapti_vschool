# Administrator experience revamp — Admissions, Imports and My work

## Source and runtime

- Source before this checkpoint: `4cb8059`.
- Production build ID: `n_SXb_AS31KMa3ZXmY8a_`.
- Synthetic demo runtime: `http://127.0.0.1:3400`, started with `pnpm demo:start` so released-module and synthetic-provider gates match the documented demo configuration.
- Database/schema: unchanged; no migration was added or applied.

## Corrections and retained behavior

- Admissions and import reconciliation no longer display a disabled draft action. Neither flow has a durable draft contract, while both retain their in-flow Back/Continue state.
- Import directory rows use a more compact mobile action treatment instead of stretching the row action across the card.
- Existing admissions identity handling, import hash/revision/version checks, partial-result recovery, request ownership and Coordination assignment boundaries were not changed.

## Direct inspection

The following routes were captured at 1440×1000 and 390×844 with the same synthetic Administrator account:

- `/admin/admissions`
- `/admin/imports`
- `/admin/imports?new=1`
- `/admin/imports/manage`
- `/admin/imports/operations`
- `/admin/requests`
- `/admin/requests/new`
- `/admin/coordination`

All 16 route/viewport combinations returned HTTP 200 with no root horizontal overflow. The corrected Admissions, Imports directory and import reconciliation surfaces were recaptured after the final production build. Requests and Assigned follow-ups were unchanged by the correction and retain their first current-source captures.

These routes have no complete approved screen reference; they were reviewed against the connected Administrator shell and shared production form, directory, empty-state and staged-workflow recipes. This is a shared-pattern review, not a claim of pixel identity to a reference screen.

## Verification

- Focused ESLint for affected route and flow files: passed.
- TypeScript (`tsc --noEmit`): passed.
- Production build with `NODE_OPTIONS=--max-old-space-size=4096`: passed.
- Direct authenticated browser capture: 16/16 route/viewport combinations returned HTTP 200 with no root overflow.

Functional owner evidence remains unchanged. Human visual acceptance remains **PENDING**.
