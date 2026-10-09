# Account & preferences — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Access + Preferences. Earliest proposed phase: 2.

## Purpose and screens
Own sessions, verified changes and private-device choices.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Account. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: Own Session; AccountPreference; verified-change request.
Application ports: ReadOwnSessions / RevokeSession / SavePreference / RequestVerifiedChange.
Repository workflow: Session operations use server principal and Access revocation transaction. Preference update affects only approved keys. Identity/contact edits create verification request rather than direct official-record change.
Prerequisite: Existing account reauthentication/recovery/session conventions; school required notice and accessibility/privacy support policy.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-44 — Manage my sessions
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Protect my school account on shared devices.
1. **Review sessions** — Show only own session labels/time; no secrets or raw device identifiers.
2. **Revoke or sign out** — Reauthenticate when required; clear local protected state.
3. **Outcome:** Selected sessions revoked or current session ended.

**Permission/invariant:** Keep sign out separate from identity block; server revocation is authoritative.
**Failure/recovery:** Already-revoked is idempotent; failed revoke must not say completed.
**Persistence/data:** Access session + audit + revocation command.
**Join/write contract:** Session operations use server principal and Access revocation transaction. Preference update affects only approved keys. Identity/contact edits create verification request rather than direct official-record change.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-45 — Set preferences or request contact change
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Adjust communication/accessibility choices safely.
1. **Choose preference** — Readable text, notification categories and shared-device preference; required school notices labelled.
2. **Save or request change** — Preferences save directly; identity/contact changes require school/access verification.
3. **Outcome:** Saved preference or pending verified-change request.

**Permission/invariant:** No guardian link changes; required security notices cannot be silently disabled.
**Failure/recovery:** Invalid/failed save keeps prior preferences and announces failure.
**Persistence/data:** Account preference + school policy; verified-change request.
**Join/write contract:** Session operations use server principal and Access revocation transaction. Preference update affects only approved keys. Identity/contact edits create verification request rather than direct official-record change.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-46 — Get help with privacy or accessibility
Phase: 2. Reconcile with owner release/dependency gates.

**Intent:** Find clear help without collecting unnecessary detail.
1. **Choose help** — Offer accessibility issue, account help or privacy enquiry.
2. **Send request** — Show school contact/recipient and explicit pending response.
3. **Outcome:** Help reference or direct contact route.

**Permission/invariant:** No invented deletion promise, statutory deadline or automatic disclosure to another account.
**Failure/recovery:** Failed delivery remains visible; alternative contact shown when configured.
**Persistence/data:** School support configuration + minimum request metadata.
**Join/write contract:** Session operations use server principal and Access revocation transaction. Preference update affects only approved keys. Identity/contact edits create verification request rather than direct official-record change.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
