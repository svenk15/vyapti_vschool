# Administrator → Staff mandatory-flow review

Date: 22 October 2026 (Asia/Kolkata)

Audit baseline commit: `e8d69307c9a2564ad6b7228a5c4526438904bd68`

Review status: **complete as a source/evidence audit; human acceptance remains PENDING**

This package is a design/execution checkpoint. It changes no production route, component, owner command, schema, migration, fixture, permission or database record. Proposed contracts remain unimplemented until separately authorized.

## Package contents

- [Mandatory-flow audit](MANDATORY_FLOW_AUDIT.md) — release classification, implementation matrix, totals, owner evidence and exact gaps.
- [Closure plan](IMPLEMENTATION_PLAN.md) — prioritized vertical slices, cross-owner dependencies, decisions and verification scope.
- [Interactive capability proposal](STAFF_PROPOSAL.html) — a self-contained review aid that labels implemented, mandatory-gap, conditional and deferred capabilities. Its controls only switch documentation views; they do not simulate successful business mutations.
- [Product-decision register](DECISION_REGISTER.md) — settled rules and four precise recommendations that still require approval.
- [Journey/reference map](JOURNEY_AND_REFERENCE_MAP.md) and [screen-state inventory](SCREEN_STATE_INVENTORY.md) — current/proposed navigation, compositions and responsive states.
- [CTA contracts](CTA_CONTRACTS.md) — action-by-action authority, command, recovery and focus behavior.
- [Proposed LLD](PROPOSED_LLD.md), [tasks](TASKS.md) and [acceptance](ACCEPTANCE.md) — owner boundaries, persistence proposals and dependency-ordered slices.
- [Source/screenshot inventory](SOURCE_AND_SCREENSHOT_INVENTORY.md) — inspected production files, approved authority and prior evidence provenance.
- [Interactive Staff workflow prototype](prototype/STAFF_WORKFLOWS.html) — self-contained fictional review prototype with real interactions and explicit prototype-only labels.
- [Prototype inspection evidence](PROTOTYPE_EVIDENCE.md) — 19 browser captures and focused interaction results.

## Authority and evidence

- Approved workflow authority: [Staff & access design](../VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/docs/modules/staff/DESIGN.md), workflows SA-13–SA-17.
- Approved directory state: [Administrator Staff screen specification](../VSchool_Execution_Pack/references/approved/implementation-spec/administrator/screens/module-staff.md) and `VSchool_School_Admin_Review.html#/staff`.
- Live owner contracts: [People design](../../modules/people/DESIGN.md), [Access design](../../modules/access/DESIGN.md), and [Academics design](../../modules/academics/DESIGN.md).
- Current implementation evidence: [EX-06](../../evidence/ex-06/README.md), [Staff workflow comparison](../../evidence/admin-staff-access-2026-10-11/README.md), [Staff directory UX](../../evidence/ux-revamp-11-staff-directory-2026-10-19/README.md), [Staff access UX](../../evidence/ux-revamp-11-staff-access-2026-10-19/README.md), [availability](../../evidence/principal-f07-availability-2026-10-17/README.md), and [cover](../../evidence/principal-f07-cover-2026-10-17/README.md).

## Headline result

The source contains strong vertical slices for new-profile creation, verified Employee-anchored access grants, operational availability and exact-occurrence cover. It does not yet provide a complete Staff record experience. The largest mandatory gaps are exact existing-Person linkage, a dedicated authoritative profile/correction surface, dated Teacher eligibility, complete employment lifecycle rules, and consistent lost-response/stale/committed-save recovery across People and Access mutations.

The existing five SA matrix rows therefore remain useful workflow summaries, but they cannot be used as proof that every mandatory Staff sub-flow is complete. Functional/security status, reference comparison and human acceptance are kept separate in the detailed audit.

## Decision boundary and next implementation order

The independently ready technical slices are STF-01 directory query state, STF-04 People/Access recovery, STF-03A profile composition, STF-05 dated Teacher eligibility and STF-06 reasoned invitation review. Existing-Person linkage, broad correction fields, employment/access completion and rejoin remain behind PD-STF-01–04 respectively.

The recommended first slice is STF-01, followed by STF-04A, because neither creates new identity or lifecycle authority. Human acceptance remains PENDING.
