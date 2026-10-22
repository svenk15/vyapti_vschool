# Staff Access: implementation-grounded mock coverage

Reviewed 22 October 2026 (Asia/Kolkata). Latest supplied source snapshot: application `223d62332401f972e7407f0dc977e7e990a1446c`, evidence `f194f3e111ed1812860b0bdf944cc93c8b224a84`. This is an inspection of uploaded source and evidence, not a connection to the user's running Mac server.

## Source evidence

- `vschool_staff_correction_f194f3e1.zip`: components/access-management.tsx, staff-invitation-management.tsx, people-workspace.tsx; tests/e2e/access-management.spec.ts; evidence/README.md.
- `vschool_staff_acceptance_4a56408b.zip`: Access DESIGN.md, STF-06 invitation evidence and connected walkthrough.
- Earlier design package was consulted only for documented context; newer implementation/evidence wins where different.

## Capability-to-mock map

| Existing capability | Revised surface | Scope / fidelity |
|---|---|---|
| Branch account list and owner pagination | Staff → Access table | Account, membership, roles and delivery separate. Mock shows all finite fixtures; preserve server pagination in production. No invented cross-owner filtering. |
| Exact active Employee grant (SA-14) | Grant access drawer → review → receipt | Employee, email, independent verification reference, fixed-role selection and explicit confirmation. Mock uses finite authorized choices; production must use current exact scoped Employee verification. |
| HYBRID / EMAIL | Invitation grant and receipt | New/pending branch access; never automatic active membership. No default role grant. |
| OPERATOR_CLI | Pending-access review / operator activation handoff | No browser operator trust claim or email action. Actual activation remains outside this Administrator screen. |
| Independent invitation / pending membership | Secondary Independent invitation | Kept distinct from Employee-linked grant. Does not establish Person/Employee binding. |
| Verified existing-account binding | No-account Employee → Link existing verified account | Exact Account ID, verification reference and reason; review → receipt. Separate People-owned command; does not grant roles. Basic success mock only. |
| SET_ROLES | Manage → Change roles → consequence review → Save | Teacher and School administrator are selectable because the inspected Roles component exposes only these. Preserve readable existing roles from server; don't introduce a Principal grant selector. |
| SUSPEND | Manage → Suspend access | Reason and explicit consequential action; employment unchanged. |
| REINSTATE | Suspended/revoked membership → Reinstate | Active account → active membership; pending account → pending membership. No global account enablement. |
| REVOKE | Manage → Revoke access | Explicit reason; branch access only; not employment deletion. |
| Employee invitation read | Same Access drawer from Profile or directory | Preparing delivery, sent, failed, expired, accepted and revoked represented separately. |
| STF-06 bounded reasoned resend | Failed/expired Employee invitation → Review resend | Minimum10, maximum500-character reason; replacement invalidates prior invitation; same roles; no duplicate send on exact replay. |
| Legacy independent delivery failure resend | Existing Access owner path | Retain existing re-invitation path and its source semantics; do not silently route it through the Employee-only endpoint. See independent-failure fixture. |
| Unknown membership outcome | Pending-result panel | Check pending change and retry same request; frozen resource/version/payload/key; no fresh operation until resolved. |
| Unknown Employee resend | Locked resend recovery | Retry unchanged resend; no invented GET status endpoint. Close blocked while unresolved to match inspected component. |
| Confirmed save, refresh fails | Saved result with Refresh details | Form removed; Close/Escape/reopen retains result; recovery is GET-only. |
| Last active administrator | Explicit protected-error state | No mutation; server remains authoritative for invariant. |
| Stale version / duplicate binding / authority loss | Safe recovery/error panels | Preserve attempts; refresh/review before fresh submission. Do not claim current source has an automatic field-merge or comparison API. |
| Account disabled | Read-only detail | Branch controls cannot enable a global disabled account. |
| Current authorization | Read-only prototype scenario | Illustrates state only; not security evidence. |

## Important implementation distinctions

- Mock modifications are simulated and reset on reload. No email, persistence, real authorization or API is exercised.
- Prototype scenarios are review-only controls and MUST NOT ship in production. Mode switching there is illustrative; production reads trusted server configuration.
- Staff Profile should use its exact Employee-context projection; don't infer links from email or select the first database row.
- General access-list source is account-based. Enriched Staff names in this proposed table must come from a permitted authoritative join; otherwise use the existing account email and neutral 'No Employee link' display. Do not add unrestricted People reads just to decorate navigation.
- Independent invitation implementation and Employee reasoned resend currently have different contracts. Preserve that difference; don't claim all invitation commands have identical recovery guarantees.
- The source's `GrantEmployeeAccess` already requires independent verification; that does not approve wider PD-STF identity-attester or retention proposals.
- Employment ending, availability and teaching eligibility remain outside this Access redesign. Preserve existing owner workflows elsewhere.

## Acceptance before production closure

Verify trusted mode gates, exact Employee binding, fixed-role allowlist, current actor authorization, foreign-scope denial, LAST_ADMIN, unchanged teaching/employment, duplicate conflict, revoke/reinstate, expired/failed resend, token replacement, provider failure, exact replay and revoked-result protection. Preserve original command identity across Close/reopen and distinguish confirmed writes from GET failure. Use real owner tests for these claims; a working mock is not proof.

Visual acceptance: match local mock using same viewport/state, canonical Forest semantic tokens, shared Inter/SVG assets, compact Student-style controls, 470px drawer and responsive full-width mobile. Preserve authorized destinations and server pagination. Human approval of this revision remains pending.

## Prototype verification performed

- JavaScript syntax checked.
- Browser-verified: Access directory and contextual Manage, failed invitation → reasoned resend → saved result, saved-result Close/reopen → read-only Refresh details, expired invitation → unknown → unchanged retry, exact Employee grant → explicit review → pending receipt, OPERATOR_CLI invitation suppression/handoff, mobile role edit → review → Save.
- Desktop drawer visually inspected. Responsive embedded-frame inspection covered 390px and 360px outer frame widths (content343/373px with browser scrollbar), without horizontal root overflow. These are responsive CSS checks, not native device, browser-zoom or screen-reader checks.
- A local HTTP-only crypto.randomUUID failure was caught and corrected using a mock-only operation identifier. Production must retain its real cryptographic idempotency keys; don't copy this prototype identifier generator.
- Suspension, reinstatement, revocation, identity binding, last-admin, stale, denial and conflict compositions are supplied for review; this package does not claim exhaustive browser or backend tests for each.
- Independent-invitation unknown recovery is a proposed safety presentation. The inspected legacy invitation component lacks the durable membership/resend command guarantees. Codex must not invent a status endpoint or claim exact replay there: preserve safe uncertainty and reconcile the owner contract before implementing enhanced recovery.
