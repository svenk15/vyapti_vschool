# Calendar & events — DESIGN
Design status: DESIGNED_FOR_UX_REVIEW. Production implementation: NOT_ASSESSED. Human acceptance: PENDING.
Owner: Calendar + Event owner. Earliest proposed phase: 3.

## Purpose and screens
Published agenda and eligibility-aware interest responses.
Use the shared UX_SYSTEM.md. Reference boards (desktop/mobile): Calendar. Every workflow also has a guided review under flow/STW-xx. Specialist walkthroughs are proposals, not fully connected downstream implementations.

## Domain and low-level boundary
Entities/tables to reconcile: PublishedEvent; audience; Interest; allocation; ConsentRequest.
Application ports: ReadPublishedAgenda / RecordStudentInterest.
Repository workflow: Published audience-filtered event read. Interest command versions event and eligibility, then stores student response. Only service owner grants place; guardian consent remains separate.
Prerequisite: Calendar publication; STW-32 event-interest extension approved; capacity and consent policy.

## Permission and transport
Authenticate server principal; derive current verified student enrollment. Check released module, institution entitlement, branch enablement, capability and object/audience scope on every read, command, status and download. Route/form identifiers are references only. Do not rely on client visibility or caller-settable tenant GUCs. HTTP DTOs cannot contain private teacher/guardian/peer data.

Use domain values for IDs, versions, publication state and school time. Commands validate before mutation, follow shared lock order, commit evidence atomically and return typed outcomes. Exact replay must reauthorize reads and return the same owner result. Do not hold DB locks over external provider I/O. Query DTOs are bounded/paginated.

## Shared failure states
Loading, legitimate empty state, recoverable request failure, session expiry, revoked access, version conflict and module unavailable. For mutating journeys, distinguish definitive rejection from transport uncertainty and preserve the intent. Full-page errors should not silently clear unsaved work. Every confirm/dialog action is keyboard accessible and has a safe cancellation path.

## STW-31 — Review published events and assessments
Phase: 3. Reconcile with owner release/dependency gates.

**Intent:** Plan around the school schedule.
1. **Browse agenda** — Show school-local dates, permitted event details and assessment schedule.
2. **Open event** — Read changes, venue, participation requirements and contact.
3. **Outcome:** Clear upcoming event context.

**Permission/invariant:** Draft assessment schedules remain hidden; published changes are visible.
**Failure/recovery:** Cancelled events are labelled and no longer accept interest actions.
**Persistence/data:** CalendarEvent publication + audience + assessment schedule projection.
**Join/write contract:** Published audience-filtered event read. Interest command versions event and eligibility, then stores student response. Only service owner grants place; guardian consent remains separate.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.

## STW-32 — Express event interest
Phase: 3. Explicit scope extension; allocate/approve before coding.

**Intent:** Tell school about interest without bypassing consent.
1. **Check eligibility** — Show capacity/age/class rules and whether guardian permission is required.
2. **Respond** — Record student interest and explicitly show Pending guardian/school approval where required.
3. **Outcome:** Interest/withdrawal receipt.

**Permission/invariant:** Student interest is not guardian consent, fee payment or confirmed allocation.
**Failure/recovery:** Capacity and eligibility are rechecked; waitlist never says confirmed.
**Persistence/data:** EventInterest + eligibility rule; service-owned allocation and separate ConsentRequest.
**Join/write contract:** Published audience-filtered event read. Interest command versions event and eligibility, then stores student response. Only service owner grants place; guardian consent remains separate.
**Demonstration:** show the successful result, then the stated permission or recovery branch with a distinct fictional fixture. The UI must name the actual resulting state. For an owner handoff, show Pending rather than pretending approval.
