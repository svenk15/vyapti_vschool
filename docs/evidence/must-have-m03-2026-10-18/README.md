# M03 — Student registration to family access

Status: engineering verified for the must-have journey on 18 October 2026; human review pending.

## Supported journey

The current release keeps the owner commands separate and connects them through their persisted receipts and exact Student identity:

1. An authorized School Administrator completes the four-stage manual registration at `/admin/students/register` or uses the bounded CSV preview/confirm path at `/admin/imports` and `/admin/imports/manage`.
2. The administrator enrolls and places the exact Student through the Students owner.
3. The selected Student record exposes separately guarded Parent and Student access setup. Delivery follows the successful database commit; a delivery failure cannot roll back or duplicate registration.
4. The intended Parent and Student activate their setup links and enter `/family` and `/student`; every context remains exact, scoped and independently revocable.

The connected fictional fixture contains an active Student with one enrollment/placement, accepted Parent and Student access, retained pending/revoked examples, and two authorized contexts for each personal workspace.

## Current-source verification

- Application source: `d6c9120`; programme checkpoint `1fdb4a9`; live build ID `jCObsKqoFwjNr2pibKzUn`.
- `pnpm test:functional test/functional/students-registration.test.ts test/functional/import-preview.test.ts` — **26/26 passed** against real `vyapti_vschool_test` PostgreSQL with 117 migrations applied and none pending.
- The preceding M01 current-source run remains applicable to unchanged Guardian/Student access code: Guardians and Student portal **11/11 passed**.
- Covered behavior includes atomic Person/Student rollback, exact identity/admission resolution, scoped enrollment and placement, duplicate/concurrency handling, revoked permission and foreign-reference denial, import preview non-writes, source-hash replay conflict, bounded resumable processing, row isolation, safe cancellation/error export and branch isolation.
- A current connected browser smoke inspected registration, Student detail/access, CSV preview, Parent entry and Student entry at 1440×1000 and 390×844. Both access panels were present for the same exact Student; Parent and Student each exposed two authorized contexts.

## Current visual evidence

- [Registration desktop](registration-desktop.png)
- [Registration mobile](registration-mobile.png)
- [Student detail and access desktop](student-detail-desktop.png)
- [Student detail and access mobile](student-detail-mobile.png)
- [Import preview desktop](imports-desktop.png)
- [Import preview mobile](imports-mobile.png)

The captures were inspected for staged hierarchy, form alignment, long-detail responsive stacking, access-state clarity, focus visibility and overflow. Existing direct comparisons remain in [SA-18](../admin-student-registration-2026-10-11/README.md), [SA-19](../admin-student-placement-2026-10-11/README.md), [SA-23](../admin-sa-23-2026-10-11/README.md), [SA-24](../admin-sa-24-2026-10-11/README.md) and the [Parent/Student integration](../parent-student-integration-2026-10-14/README.md).

## Scope boundary and remaining gates

The must-have result does not claim durable generic workflow drafts. Disabled reference draft affordances remain outside the approved owner contract and broader catalogue rows retain their recorded status. Human review, native accessibility, font portability, production messaging/provider review and TEN-03 remain pending. No production readiness is claimed.
