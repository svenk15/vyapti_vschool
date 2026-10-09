# Restricted student support — DESIGN

Owner: Specialist support owner. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-37 — Refer a concern to an authorized specialist
**Delivery:** phase 6 · Later
**Trigger:** A factual observation requires specialist support.
**Actors:** Principal; authorized Specialist support owner owner
**Preconditions:** School-defined referral channel and purpose grant; designated specialist service enabled.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Read allowed referral context. | Do not search for a broad student health/case history. |
| 2 | Principal | Record minimum factual concern. | Show who will receive it and the limits of this channel. |
| 3 | Principal | Route to designated specialist. | Receipt confirms referral, not diagnosis, intervention or accepted treatment. |
| 4 | System / owner | Track permitted handoff status only. | Case narrative and specialist notes remain restricted. |

**Inputs and validation**

- **Concern:** Observed facts, no automated diagnosis.
- **Recipient:** Designated specialist route.
- **Urgency:** School-defined routing, not automated medical triage.

**Outcome:** Restricted referral with an accountable recipient.
**Authorization:** Referral capability does not grant case-read or health-record access.
**Data read:** Minimal student identity/purpose context; authorized referral route.
**Data written:** Specialist referral and safe status evidence.

**Alternate and failure paths**

- Specialist channel unavailable: school-approved contact route shown.
- Principal lacks case access after referral: status-only projection if permitted.

**Demo acceptance:** No detailed health/support narrative appears in school-wide dashboard or analytics.


## LEA-38 — Follow the school’s urgent safety escalation procedure
**Delivery:** phase 6 · Later · Explicit scope extension
**Trigger:** An urgent safety concern is raised through an approved channel.
**Actors:** Principal; authorized Specialist support owner owner
**Preconditions:** Approved school procedure, authorized emergency roles and actual contact configuration.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Show the school’s urgent-contact instruction. | Ordinary software queue is not represented as continuously monitored. |
| 2 | Principal | Contact the designated responsible person through the approved process. | No autonomous notification to all staff or guardians. |
| 3 | Principal | Record minimum permitted handoff evidence after appropriate action. | Access remains need-to-know. |
| 4 | System / owner | Review restricted incident follow-up under owner policy. | Emergency access, if supported, is explicit, time-limited and independently reviewed. |

**Inputs and validation**

- **Handoff reference:** Minimum safe information.
- **Emergency access:** Not a default principal capability; reason/expiry/review required where designed.

**Outcome:** Human-led authorized safety handoff.
**Authorization:** No default break-glass, diagnosis or confidential case visibility.
**Data read:** Approved procedure/contact configuration and explicit emergency-role rules.
**Data written:** Restricted handoff/event only under incident owner.

**Alternate and failure paths**

- No configured procedure: show school contact gap, do not invent emergency policy.
- Complaint implicates a leader: use designated independent channel.

**Demo acceptance:** The portal never claims it has provided emergency assistance merely because a form was saved.
