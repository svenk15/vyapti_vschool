<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# Test and review strategy

## Evidence in this delivery

40/40 Node model/controller checks passed, including all 52 guided journeys through their 156 step/confirmation templates. The minimal DOM adapter does not test actual browser layout/focus, native screen readers, real authentication, provider events or PostgreSQL. Exact results are in `../qa-evidence.json`. PNG/SVG references are designed compositions, not browser screenshots.

## Application/unit behavior

Use the repository’s TypeScript runner for Next.js/domain/application work. Preserve hexagonal boundaries. Test live child-purpose grants, intended-account invitation acceptance, explicit versioned acknowledgement, request state/version/replay, returned/published visibility, signer aggregation and exact currency/minor-unit payment calculations. JUnit and HBase are not assumed for the currently described TypeScript/PostgreSQL stack.

## Real PostgreSQL functional evidence

- Account, institution, branch, child, purpose and module disabled/revoked at read and between review and commit; no cross-sibling or cross-school leak.
- Restricted runtime role and current RLS policy/context contracts; no owner-connection bypass. Join/FK scope forgery, stale pooled connection reuse, download/attachment authorization.
- Invitation wrong account, unverified relationship, expired/revoked/consumed/failed-delivery token, trust mode tightened between issue and consume, replay/duplicate acceptance.
- Explanation full rollback, same-day dates, date/size bounds, category validation, exact replay, changed intent, response loss and own-request visibility; no AttendanceRecord mutation.
- Request withdrawal versus concurrent school review, originator visibility and audit retention; no household blanket read.
- Notice edited after reading, explicit acknowledgement and duplicate ack; thread grant removed before send/delivery; truthful provider acceptance/delivery/read states.
- Private feedback/draft result denied, returned/published versions allowed, historical/download access revoked safely.
- Consent default unset, wrong signer, changed document/policy, required additional signer, decline/withdrawal/expiry and immutable decision history.
- Payment stale amount/version, wrong issuer/currency/mandate, simultaneous orders, reused key changed intent, callback forgery, duplicate/out-of-order verified provider events, late settlement after timeout, failed attempt, refund and reconciliation mismatches. Never double-allocate or issue receipt before settlement.
- Application applicant scope cannot read existing pupil records or establish guardian access by itself.

## Browser E2E on integrated code

Test 1440, 768, 390 and 360 widths with supported browsers against the dedicated test database and recorded source/build. One known server; do not stack servers to conceal timeouts. Primary journey: school invite/sign-in → permitted child → attendance explanation → stable receipt → notice acknowledgement → child switch → denied deep link. Later modules add consent and payment unknown/processing recovery before broader services.

Check shared shell, icon alignment, child context wrapping, separate Sign out, Enter-only attribute search, fluid persistent multiselect filters, radio Sort drawer, sensible mobile record layout, no document overflow, dirty draft controls, receipt language and theme variants. Browser back, old tabs and account expiry must not reveal revoked child data. Evidence must distinguish screenshots, real E2E, simulated controller checks and human review.

## Human review pending

Keyboard-only review, native 200% zoom, VoiceOver/Safari and NVDA/supported browser remain pending. Verify child/school context announcement, correct radio-group names, field errors, dialog title/focus/return, source timestamps, amount/currency reading and status updates. No conformance claim comes from this pack.

## Load and production readiness

Keep the existing target: 5,000 pupils per branch × 20 branches = 100,000 total; attendance submit p95 < 1 second excluding client network. Parent read bursts, report-download peaks and fee deadlines need their own explicit workload/SLO design. Do not apply the attendance write target to all parent pages without a decision. Define concurrent families, request mix, data growth, cache invalidation, pool limits and hardware; test under the intended runtime role.

Provider/security review, operational recovery/restore and TEN-03 release gates remain in the actual repository. This pack does not relax them. Use focused checks per risk and required wider gates at coherent module boundaries; do not defer authorization, transaction or money-integrity checks to a final visual review.
