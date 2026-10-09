<!-- TT-01 contract -->
## TT-01 integration
See [the shared timetable source of truth](timetable/README.md) and [persona mapping](TIMETABLE_INTEGRATION.md). Existing task and verification entries below are baseline unless explicitly refreshed in timetable-evidence.json.

# School Administrator product scope

Design edition 01. The administrator is the branch’s operational coordinator. Their first questions are: what needs attention, what should I do next, and did the change succeed?

## Relationship to the Operator pack

Operator provisions institution, branches, module entitlements and verified administrative handover. School Administrator works inside explicitly granted branches. Institution and operator authority do not automatically grant access to students, finance or sensitive case records. The same account can hold several roles; the active workspace and permissions remain explicit.

## Delivery map

| Phase | Administrator experience | Current design boundary |
|---|---|---|
| 1 | Entry/context, school settings, academic structure, staff/access, student registration/enrollment, imports, session attendance oversight, reports | Detailed UX contracts; reconcile actual source and LLD before implementation |
| 2 | Verified guardian linking, invitations/restrictions, communication, family requests, absence explanation, basic analytics | Proposed UX. Structured follow-up is an extension needing approved scope |
| 3 | Admissions, richer student lifecycle, recurring timetable/cover, learning oversight, documents/forms, approved integrations | Proposed UX. Connector delivery and documents start with a consuming module, not a mandatory all-at-once release |
| 4 | Assessment readiness, moderation coordination, delegated approval and publication | Proposed UX; versioning and publication LLD required |
| 5 | Delegated fee configuration, invoice/collection, adjustment/refund/reconciliation | Proposed UX; finance rules must be designed independently |
| 6 | Delegated transport, people operations, library, facilities, restricted referral/health coordination | Proposed UX; each service has independent authority and release gates |
| 7 | Permission-filtered evidence and reviewed drafts | Proposed UX; provider and evaluation gates apply |

Phase mapping is based on the locally available Bible 4.4 product blueprint, not a claim about the current live repository. Preserve approved later revisions during reconciliation. A phase badge is a roadmap marker, not implementation evidence.

## Permission matrix

| Area | School administrator | Institution administrator | Platform operator | Explicit specialist / teacher |
|---|---|---|---|---|
| Branch information | Permitted branch fields | Configuration authority if granted | Provisioning/configuration authority | No implied access |
| Institution identity, branch creation, commercial modules | Review/request only | Authorized configuration | Verified control-plane operations | None by default |
| School records, enrollment, import | Own granted branch | No automatic operational access | No automatic pupil access | Minimal assigned scope |
| Staff identity and branch access | `user.manage`; verified evidence | Explicit grant authority | Verified operator override | No self-elevation |
| Attendance marking | No default `attendance.mark` | None by ownership alone | None by operator role | Eligible dated teacher assignment |
| Attendance correction / school report | Explicit school capabilities | Needs separate branch grant | No default | Separately granted only |
| Guardian relationship approval | Proposed scoped relationship capability | No automatic child access | No automatic child access | Explicit verification role |
| Branding publish | Explicit delegation only | Branding authority if granted | Controlled configuration | No default |
| Finance approval, refunds, payroll | Coordination unless delegated | No automatic sensitive-data authority | No automatic authority | Narrow financial/payroll grants |
| Health / safeguarding case content | Minimal referral only if granted | No automatic case access | No automatic case access | Need-to-know specialist grant |
| Emergency access | No default | No default | No default | Approved emergency role, reason, expiry, independent review |

Permission labels for later modules are proposed capabilities. Resolve them against the actual permission registry before coding; do not create broad wildcard grants to make a screen work.

## Module visibility

`visible = released AND institution-entitled AND branch-enabled AND permitted-for-this-actor`.

Dependencies may add internal foundational data capabilities without adding irrelevant navigation. Attendance-only clients should see a complete workflow with no Fees setup requirement. A licensed module may still be unavailable to a particular role. Disabling a module must not erase its records or cancel obligations without its own workflow.

## The administrator’s student record

Identity and enrollment form the core. Attendance, family links, learning, results, financial information, transport and documents are independent panels with their own permissions. A generic Student 360 screen must not bypass owning-module access checks. Child-to-guardian linking begins from the student’s **Family links** tab or the authorized Families directory; it is not embedded in Phase 1 roster CSV.

Verified relationship, global account, emergency contact, pickup authority, communication preference and payer authority are separate facts. A guardian can have several independently verified child links and different purposes for each. Email control establishes mailbox control only. Restricted family/custody notes stay outside general activity and notifications.

## Breadth of this pack

All administrator journeys in the current Bible’s module blueprint are represented at product/UX level. Specialist work appears as a permission-scoped handoff or delegated flow. This does not define every teacher, parent, principal, driver, clinician or finance-officer screen; those deserve their own persona packs. Jurisdiction-specific school policy, statutory reports, local payroll rules and additional service modules need explicit discovery rather than invented defaults.

<!-- EDITION02 -->
## Edition 02 — family integration
Family Access is incorporated into the existing Families area (Phase 2), not a new administrator role or application. The complete pack still contains 63 journeys / 22 areas. First slice: verified child/adult relationship, attendance-only purpose grant, policy-aware invitation, intended-parent acceptance, exact-child attendance, access revision/revocation and access-help handoff. Notices and other purpose owners are designed later and must not be silently bundled. Parent preview is a fictional review tool, not administrator impersonation authority.

<!-- EDITION03 -->
## Edition 03 — Communication & Notices
This essential Phase 2 module is integrated in the existing School Administrator Communication area. It covers text notice creation, reviewed recipient manifest, draft/resume, teacher approval, publish/schedule/cancel, exact-version read/acknowledgement, correction/withdrawal, delivery recovery, reminders and verified offline acknowledgement. Parent/teacher sides are labeled handoff previews. Secure attachments, private conversations, meetings and full request-owner implementation remain later slices.

The review opens on Communication, with Families and Communication directly visible in the main navigation. This default preview scope does not change production entitlements or release flags. School-notice access is a separately approved purpose; it is never inferred from attendance access.
