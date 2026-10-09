# School access — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Access + Students. Earliest proposed phase: 2.

## Purpose and screens
Verified self identity, active enrollment and school policy.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Sign-in, School-switcher, Access-help, Access-unavailable. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: UserAccount; StudentAccountLink; active Enrollment; Session/Invitation.
Application ports: ResolveStudentWorkspace / AcceptStudentInvitation / RecoverAccount.
Repository workflow: Read account → verified institution link → dated active enrollment; resolve capability projection. Token consumption locks/consumes existing Access token only after intended-account and current school-policy checks. No self-selected student binding.
Prerequisite: Account-enabled school policy; real trust-mode LLD; verifier workflow; account-wide recovery enumeration.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-01 — Find the correct school sign-in
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Enter the school-issued workspace.
1. **Use school link** — Check school name and branch; use the school-issued sign-in link.
2. **Sign in** — Use the student account assigned by school; no account enumeration or public pupil search.
3. **Outcome:** Own permitted enrollment contexts.

**Permission/invariant:** A public school slug is branding, never authorization.
**Failure/recovery:** Invalid school link offers school contact; invalid credentials remain generic.
**Persistence/data:** Published BrandProfile; UserAccount; verified StudentAccountLink; active Enrollment.
**Join/write contract:** Read account → verified institution link → dated active enrollment; resolve capability projection. Token consumption locks/consumes existing Access token only after intended-account and current school-policy checks. No self-selected student binding.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-02 — Activate an issued student account
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Accept the exact school-verified account binding.
1. **Review invitation** — See intended school and a safe account hint; do not select another child.
2. **Activate** — Authenticate intended identity and accept a valid, unrevoked invitation under school policy.
3. **Outcome:** Account link active with school-defined capabilities.

**Permission/invariant:** Mailbox possession does not establish pupil identity; a guardian token cannot activate student authority.
**Failure/recovery:** Expired, wrong-account or failed-delivery token routes to school help; no self-link.
**Persistence/data:** Access invitation + StudentAccountLink + non-sensitive verification reference.
**Join/write contract:** Read account → verified institution link → dated active enrollment; resolve capability projection. Token consumption locks/consumes existing Access token only after intended-account and current school-policy checks. No self-selected student binding.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-03 — Recover access
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Regain account access using the permitted policy.
1. **Request help** — Submit school identifier and permitted account identifier through a generic response.
2. **Complete recovery** — Follow account-wide trust policy; use school/operator assistance if required.
3. **Outcome:** Access restored and sessions handled by existing recovery policy.

**Permission/invariant:** Preserve OPERATOR_CLI/HYBRID/EMAIL and stricter cross-institution recovery checks.
**Failure/recovery:** No guarantee that an email was sent; delivery failure and operator-assisted routes remain explicit.
**Persistence/data:** Access recovery tokens, organization trust modes, active identity memberships.
**Join/write contract:** Read account → verified institution link → dated active enrollment; resolve capability projection. Token consumption locks/consumes existing Access token only after intended-account and current school-policy checks. No self-selected student binding.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-04 — Switch enrollment context
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Move safely between own authorized school contexts.
1. **Choose context** — List only active verified enrollments with institution, branch and academic year.
2. **Resolve current work** — Save/discard a changed draft; unresolved submission must be reconciled first.
3. **Outcome:** Destination context and capabilities are reloaded together.

**Permission/invariant:** Never keep one child identity with another branch; no independent arbitrary branch selector.
**Failure/recovery:** Revoked or stale destination becomes unavailable; clear protected cached content.
**Persistence/data:** StudentAccountLink + Enrollment + module entitlements + course assignment.
**Join/write contract:** Read account → verified institution link → dated active enrollment; resolve capability projection. Token consumption locks/consumes existing Access token only after intended-account and current school-policy checks. No self-selected student binding.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-05 — Handle expired or withdrawn access
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Understand why a workspace is unavailable.
1. **See safe state** — Clear protected content and explain sign-in or school help is needed.
2. **Resume safely** — Reauthenticate and recheck current assignment before recovering work.
3. **Outcome:** Authorized continuation or safe support route.

**Permission/invariant:** Historical access does not authorize current reads, downloads or status lookup.
**Failure/recovery:** Unknown submissions keep a reference; do not claim a failure or discard evidence.
**Persistence/data:** Session + account status + current account link/enrollment; command receipt.
**Join/write contract:** Read account → verified institution link → dated active enrollment; resolve capability projection. Token consumption locks/consumes existing Access token only after intended-account and current school-policy checks. No self-selected student binding.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
