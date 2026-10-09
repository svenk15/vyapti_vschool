# School services — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Library / Activities / Transport / Support. Earliest proposed phase: 6.

## Purpose and screens
Library, activities and transport are independently enabled.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Services. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: Loan; hold; registration; allocation; transport assignment; restricted request.
Application ports: ReadOwnLoan / RequestRenewal / RequestActivity / ReadTransport / RequestSupport.
Repository workflow: Each owner resolves own verified student projection. Renewal/allocation check current version and policy. Student interest never becomes consent/payment. Transport is assigned route/update, not a live location stream.
Prerequisite: Each service independently released and entitled; STW-41/43 approved separately. Specialist physical schema and LLD required before coding those commands.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-39 — Review my library loans
Phase: 6. Reconcile with owner release/dependency gates.

**Intent:** Know what is borrowed and when it is due.
1. **Open loans** — Show own current loans, due dates and service policy.
2. **Open item** — View return instructions and permitted renewal action.
3. **Outcome:** Own circulation record.

**Permission/invariant:** No other borrower history; fines if shown are read-only service data, not payer authority.
**Failure/recovery:** Unreturned/corrected records use library-help path.
**Persistence/data:** LibraryLoan + item catalogue + own borrower mapping.
**Join/write contract:** Each owner resolves own verified student projection. Renewal/allocation check current version and policy. Student interest never becomes consent/payment. Transport is assigned route/update, not a live location stream.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-40 — Request a library renewal
Phase: 6. Reconcile with owner release/dependency gates.

**Intent:** Ask for more borrowing time.
1. **Review rules** — Show eligibility, hold/renewal limits and proposed due date from library.
2. **Request renewal** — Recheck current loan/holds; show approved only if owner confirms.
3. **Outcome:** Confirmed renewal or pending/denied response.

**Permission/invariant:** Student cannot set loan due date.
**Failure/recovery:** Concurrent return/hold blocks stale renewal and preserves history.
**Persistence/data:** LibraryLoan version + hold policy + renewal decision.
**Join/write contract:** Each owner resolves own verified student projection. Renewal/allocation check current version and policy. Student interest never becomes consent/payment. Transport is assigned route/update, not a live location stream.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-41 — Join an enabled activity
Phase: 6. Explicit scope extension; allocate/approve before coding.

**Intent:** Explore eligible activities and request a place.
1. **Review activity** — Show schedule, eligibility, places and any required guardian consent.
2. **Request place** — Record interest; confirm only after allocation and required approvals.
3. **Outcome:** Requested/waitlisted/confirmed state from owner.

**Permission/invariant:** Interest is separate from guardian consent, payment and attendance.
**Failure/recovery:** Full activity offers waitlist only if enabled; changed schedule requires new review.
**Persistence/data:** ActivityOffer + registration + allocation + Consent reference.
**Join/write contract:** Each owner resolves own verified student projection. Renewal/allocation check current version and policy. Student interest never becomes consent/payment. Transport is assigned route/update, not a live location stream.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-42 — Read my transport assignment
Phase: 6. Reconcile with owner release/dependency gates.

**Intent:** Know my assigned service and published updates.
1. **Open transport** — Show assigned route/stop and school contact.
2. **Read update** — Show published delay/cancellation text with time and source.
3. **Outcome:** Current assigned service guidance.

**Permission/invariant:** No driver private data, other pupils, live location promise or self-changing pickup authority.
**Failure/recovery:** Unassigned/unavailable service routes to school; urgent change uses official contact.
**Persistence/data:** TransportAssignment + published service update; no location stream.
**Join/write contract:** Each owner resolves own verified student projection. Renewal/allocation check current version and policy. Student interest never becomes consent/payment. Transport is assigned route/update, not a live location stream.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-43 — Request student wellbeing support
Phase: 6. Explicit scope extension; allocate/approve before coding.

**Intent:** Ask the authorized school team for support.
1. **Understand visibility** — Show who receives the request and school contact for urgent help.
2. **Send minimal request** — Allow a brief description without compulsory health details; no confidentiality guarantee.
3. **Outcome:** Restricted request receipt.

**Permission/invariant:** No automated diagnosis, risk score, covert parent disclosure or full health-record access.
**Failure/recovery:** Unavailable channel clearly routes to school contact; do not imply 24/7 monitoring.
**Persistence/data:** Restricted support request + purpose grants + student-safe timeline.
**Join/write contract:** Each owner resolves own verified student projection. Renewal/allocation check current version and policy. Student interest never becomes consent/payment. Transport is assigned route/update, not a live location stream.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
