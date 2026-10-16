# Principal production screen map

F00 checkpoint: 17 October 2026. Executable application source: `f75ad4f3e3b036132d0c72bbe6c95eceea296b1c`; build ID `dzbFDU1W0dZo_wYNuvjwH`.

The approved Principal HTML is a workflow explorer. It remains authoritative for outcomes, stages, labels and failure semantics, while these real routes are the production compositions. Routed presentation is not recorded as a visual defect merely because the explorer uses a catalogue dialog. Shared VSchool components remain authoritative for buttons, cards, badges, focus and navigation. Human visual acceptance remains PENDING.

| Recipe | Workflow and owner | Actual route | Explorer state | Supported production states | Measured specimen | Recorded mapping/deviation |
|---|---|---|---|---|---|---|
| L — directory / operational report | LEA-08 and LEA-10 source selection; Attendance read with Coordination entry | `/leadership/attendance` | LEA-08 inspect coverage and LEA-10 select sources | Populated, genuine empty, filtered empty, URL-backed filters/sort, explicit 1–50 selection and selection clearing | 240px sidebar, 60px topbar, 32px desktop gutter, 28px title; mobile 64px topbar and 18px gutter; no horizontal overflow | The explorer selection table becomes the authorized Attendance report route. Bulk action is enabled only after an explicit visible selection. |
| D — detail / evidence | LEA-11/15; Coordination detail with separately guarded Attendance evidence | `/leadership/coordination/:requestId` | LEA-11 inspect/verify/return and LEA-15 inspect source resolution | Open, assigned, in progress, awaiting verification, returned, resolved and withdrawn; append-only history; current permitted actions | Same shell/title metrics; two-column evidence/history at desktop and stacked mobile; no horizontal overflow | The explorer detail dialog maps to a source-linked route so reload, stale recovery and current authorization remain explicit. |
| W — staged operation | LEA-10; Coordination bulk composition over existing guarded single commands | `/leadership/coordination/bulk?session=…` | LEA-10 selection → details → review → confirmation | Details, retained in-flow edits, server preview, review, validation, final-only mutation and unknown-outcome resume | 900px maximum workflow width inside the common shell; four-step indicator; desktop two-column controls; stacked mobile; no overflow | Dedicated route follows the approved stage order and keeps refresh/recovery possible. No durable draft or hidden selection is implied. |
| R — receipt / recovery | LEA-10; Coordination durable batch/item receipts | `/leadership/coordination/batches/:batchId` | LEA-10 created/existing/failed result and recovery | Completed or partial counts, per-item safe outcomes, authorized request links, response-loss resume and revoked-result denial | Same shell/title metrics; bounded result card; stacked mobile outcomes; no overflow | Durable routed receipt replaces the explorer's transient result panel. This is required for exact replay and protected recovery and is not claimed pixel-identical to the catalogue. |

## Captures and measurements

New current-source captures are in [F00 evidence](../../evidence/principal-f00-production-recipes-2026-10-17/README.md). Chromium used 1440×1000 and 390×844 viewports sequentially. Screenshots are full-page captures, so their image height may exceed the viewport. `measurements.json` records computed shell geometry, declared font stack and overflow for every recipe at both viewports.

The measured portal stack is `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; the browser reported both Inter and Arial as usable through the Font Loading API, which does not establish redistributable font provenance. F00 does not change fonts. The existing font-portability exception remains open.

## Source manifest

| Source | SHA-256 at specimen capture |
|---|---|
| `app/globals.css` | `096c449c3635d2a1f495d4333e17a51e3024f9dad7c10a0420083a2939c4ef31` |
| `components/portal/portal-shell.tsx` | `cca0721ddf472e9515bdaae6fa173cdac0c2b8f1f093739ff60dcd2887805b7b` |
| `components/principal-portal-frame.tsx` | `df8b3782c2acb09f72ae87f4d7bcdf2eeb90a9307fe82b26945f4db5f23aff2c` |
| `components/leadership-attendance-registers.tsx` | `e60f48f16a9688ad3467e9bde4abae7ff7239d18d75d92dadc74d93fa5f67d81` |
| `components/coordination-view.tsx` | `b751e7446d6153d626361a554060e4a2605e042cf839e1f61f71c7d422d0f95c` |
| `components/coordination-batch.tsx` | `d6bfdd3f2b999ddbb65fc9e10ec70c72abe6f006eaf313dd11e9d57d05105479` |

## Visual status

The four production recipes were directly inspected at both viewports. Hierarchy, action placement, responsive stacking, selected/focus semantics and absence of horizontal overflow are consistent across the specimens. The application retains the shared component padding and button treatment already used by accepted VSchool surfaces rather than globally replacing them with the package's originally proposed values. Exact explorer pixel identity is intentionally not claimed. Native VoiceOver/NVDA, real browser 200% zoom, font portability and human acceptance remain pending.
