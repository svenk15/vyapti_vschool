# Proposed Bible addendum — School Administrator experience

Reconcile this text with the actual current Bible; do not replace its history or approval status. Edition 01, 8 October 2026. UX proposal, awaiting human review.

1. School Administrator is a branch-scoped operational persona. Institution/control-plane authority does not imply access to branch operational or sensitive records.
2. Adopt Operator 03.9 visual primitives and the School Administrator page recipes in UX_SYSTEM.md. Validate actual composed pages, not only isolated components.
3. The daily home prioritizes actionable exceptions and incomplete setup. It must derive outcomes from authoritative records and name the scope/denominator of metrics.
4. Register and enroll students in Phase 1. Add verified child–guardian relationship management and invitation in Phase 2. Keep guardian portal, billing, pickup and emergency purposes distinct. Never infer a link from matching email.
5. Phase 1 attendance remains session-based. Administrators coordinate, review, correct and report. They do not gain attendance.mark by default.
6. Future modules use released + licensed + branch-enabled + actor-authorized visibility. Unlicensed modules do not create mandatory setup or disabled navigation noise.
7. UI theme changes use approved brand tokens. Semantics, component behavior, spacing and typography stay stable across clients.
8. All 63 proposed user journeys have a stable SA ID in the design pack. Each must map to an existing or new repository task before coding. The design pack does not change completed task IDs or release evidence.
9. Structured follow-up, external connector timing and later specialist permissions require explicit product/LLD reconciliation. They are proposals, not silent Phase 1 additions.
10. Keep tenant isolation, trust policy, data retention and accessibility/release gates explicit. A synthetic leadership demo and a production release have different evidence requirements.

Suggested changelog: “2026-10-08 — Proposed School Administrator UX pack: role boundary, first-use/daily operations, 63 phase-mapped journeys, guardian relationship placement and shared Operator-derived page recipes. Implementation and human approval tracked separately.”

<!-- EDITION02 -->
## Proposed Edition 02 family amendment
Keep Phase 2 under the School Administrator Families area. Relationship verification precedes invitation; active parent access requires intended-identity acceptance and a current exact-child purpose grant. First slice grants attendance.read only. Separate contact, payer, pickup, emergency and consent roles. Amend the permission matrix with scoped guardian.relationship.manage, guardian.invite, parent own-child read and Requests review capabilities after reconciling actual names. Preserve operator/HYBRID/EMAIL behavior and include guardian institution bindings in the account-wide recovery policy resolver. Production/security gates are unchanged; reconcile this addendum into the canonical Bible rather than replacing it wholesale.

<!-- EDITION03 -->
## Proposed Edition 03 amendment — dependable school communication
Add Communication & Notices as an essential Phase 2 slice under the existing module. Establish `communication.notice.read` as an independent verified child-purpose grant; preserve attendance-only accounts without automatically widening access. Separate compose/publish/review/manage-delivery/offline-ack capabilities, and limit teachers to their assigned class unless explicitly delegated.

A stable Notice identity owns immutable content versions. Each version has an approved account manifest and binding provenance; live access is checked again on read, send, reminder and acknowledgement. Provider acceptance, human reading and deliberate acknowledgement are separate facts. Corrections preserve historical evidence and require current-version acknowledgement. Unknown provider/publication outcomes are reconciled before retry. Scheduling freezes the reviewed manifest and suppresses revoked targets at execution rather than silently adding accounts. Published/Processing states must reflect real completion.

Use the Communication HLD/LLD for proposed vs_ tables, indexes, scopes, joins and transactions. Reconcile actual physical schema and TEN-03 obligations before migrations. This amendment does not mark Phase 2 implemented, change existing IAM trust modes, bypass gates or claim production readiness.
