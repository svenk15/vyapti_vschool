# VSchool UX Constitution

Version 1.0 · **APPROVED for implementation on 20 October 2026**

This canonical document is sourced from `docs/execution/UX_CONSTITUTION_REVIEW/UX_CONSTITUTION.md`, review version 2.1. It applies to Administrator, Teacher, Principal, Parent/Guardian, Student and future modules. Business invariants, access contracts and domain ownership remain binding. UX policy governs presentation and never grants data access, identity discovery, retention, payment, messaging or provider authority.

## Governing principles

1. **Outcome first.** Name the persona, goal, entry context and observable completion. Use school tasks in navigation.
2. **Lower interaction cost.** Every intermediate screen, repeated selection and confirmation needs a stated purpose. Routine short forms use one grouped page.
3. **Clarity.** Copy supports input, consequence, state or recovery. Do not repeat headings or expose implementation terminology.
4. **Progressive disclosure.** Keep essential fields and actions visible; reveal conditional choices when relevant. Errors remain visible.
5. **Consistency.** Shared semantics, geometry and interactions use canonical components and tokens.
6. **Recognition.** Preserve authorized context, meaningful labels, current values and safe query state.
7. **Efficiency.** Keyboard operation and context actions remain available. Bulk or inline actions require owner support and per-item authorization.
8. **Error prevention.** Validate accessibly and again on the server. Preserve safe input after recoverable failure without expanding identity discovery.
9. **Feedback.** Distinguish unsaved, pending, committed, failed, stale and unknown outcomes. A timeout is not success.
10. **Accessibility.** Target WCAG 2.2 AA for complete processes. Automated, keyboard, contrast, zoom/reflow and assistive-technology evidence remain separate.
11. **Context.** Respect persona, branch/child, device, timezone and authority. Presentation never broadens access.
12. **Measurement.** Each must-have task records a comparable baseline, fixture, target and observed result.

## Interaction rules

- Short create/edit workflows use one grouped page unless identity resolution or complex dependencies require another step.
- Consequential publication, access removal, financial decisions and roster-impacting changes retain focused consequence review.
- Read-only navigation and routine reversible settings do not gain confirmation screens.
- Loading, validation, conflict, stale and unknown-outcome states stay distinct.
- Unknown writes retain the exact payload and idempotency key. Edited values cannot masquerade as a retry.
- Navigation visibility is never endpoint authorization. Protected destinations reauthorize current identity, scope, modules and resource relationships.
- Desktop and mobile keep the same destination labels, one active leaf and usable Back/Forward state. Mobile drawers trap focus, close with Escape and restore focus.
- Human acceptance is scoped to source, state and viewport and is never inferred from engineering verification.

## Workflow-specific authority

Module DESIGN and TASKS documents own workflow-specific fields, invariants, permissions, state transitions and exceptions. They reference this Constitution rather than copying it. Historical prototypes remain evidence of prior compositions; an approved replacement is compared against its current production reference made from the same shared components.

## Exceptions

An exception records the rule, outcome, rationale, affected routes/personas, retained safeguards, evidence, owner, approval and review date. Deadlines do not create silent exceptions.
