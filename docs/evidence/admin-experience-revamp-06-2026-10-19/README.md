# Administrator experience revamp — School administration and conditional services

## Source and runtime

- Source before this checkpoint: `cf04d21`.
- Production build ID: `FnDUkbvFIP6IQWBb04_Ju`.
- Synthetic demo runtime: `http://127.0.0.1:3400`, started with `pnpm demo:start`.
- Database/schema: unchanged; no migration was added or applied.

## Corrections

- Module-interest, branding review, activity review and context-exit compositions no longer show an unsupported disabled draft action.
- Finance now has a proper page header, separated reconciliation metadata, a four-value summary surface and responsive exception records. The direct request URL has a clear page identity even when the current persona lacks an eligible independent reviewer.
- Facilities incident records are constrained on desktop and become labelled mobile records, resolving both root overflow and the collapsed action link.
- Optional restricted Support now renders a clear, safe unavailable state instead of throwing an unhandled `RELEASE_UNAVAILABLE` error.
- Existing module, branding, activity, Finance, Facilities, context and institution authorization remain server enforced.

## Direct inspection

The following routes were captured at 1440×1000 and 390×844:

- `/admin/modules` and `/admin/modules/manage`
- `/admin/branding` and `/admin/branding/manage`
- `/admin/activity` and `/admin/activity/manage`
- `/admin/services/incidents` and `/admin/services/incidents/new`
- `/admin/finance/exceptions` and `/admin/finance/exceptions/new`
- `/admin/support`
- `/admin/context`
- `/institutions`

All 26 route/viewport combinations returned HTTP 200 with no final root horizontal overflow. Facilities and the Finance request state were recaptured after their final corrections. Optional states remain truthful: Finance creation is denied without an eligible independent reviewer, and restricted Support is unavailable when its release gate is closed.

These surfaces do not all have complete approved screen references. They were reviewed against the connected Administrator shell and shared production settings, directory, mobile-record, unavailable-state and staged-workflow recipes. This is a shared-pattern review where an exact reference is absent.

## Verification

- Focused ESLint for affected pages and components: passed.
- TypeScript (`tsc --noEmit`): passed.
- Production build with `NODE_OPTIONS=--max-old-space-size=4096`: passed.
- Direct authenticated browser capture: 26/26 route/viewport combinations returned HTTP 200 with no final root overflow.

Functional owner evidence remains unchanged. Human visual acceptance remains **PENDING**.
