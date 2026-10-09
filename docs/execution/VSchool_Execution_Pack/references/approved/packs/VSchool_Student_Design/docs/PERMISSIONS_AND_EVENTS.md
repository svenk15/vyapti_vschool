# Capabilities, audit and analytics proposal
Capability labels below are design names; map to actual registry before implementation. No wildcard Student grant.

| Action | Student default scope | Additional condition |
|---|---|---|
| Resolve context | Own verified active enrollment | School account policy; current account |
| Read assignment/resource | Own assigned Published work | Released/enabled module, audience dates, clean authorized file |
| Save private draft | Self + assigned work | Exact scope/version, bounded contents |
| Submit/revise | Self + exact draft/attempt | Current policy, deadline, ready files, intent receipt |
| Withdraw | Own submitted attempt | Policy, version and review lock |
| Read feedback | Own returned publication | Audience STUDENT; not teacher private notes |
| Read attendance | Own session roster record | Current access; no other pupils |
| Change attendance/marks | No | Authorized owner workflow only |
| Read/ack notice | Intended published recipient | Exact version |
| Message teacher | Explicit current conversation | No arbitrary recipient search or peer directory |
| Request school action | Self/allowed category | No self-approval |
| Read report | Own published version | Reauthorization on view/download |
| Guardian consent/payer action | No inferred authority | Separate persona/grant; never student role alone |
| Support case/health record | No generic read | Narrow specialist policy only |

## Audit
Store actor ID, verified institution/branch/student scope, operation, aggregate/ref ID, version, decision, timestamp and command correlation. Exclude response bodies, message text, filenames, bytes, content digests, private feedback, raw provider payload and tokens from general audit. Detailed scan/command evidence belongs in restricted owner tables. Do not leak another institution in public recovery refusal.

## Future product analytics
Gate analytics by approved policy and delivery phase. Suggested events: student_workspace_opened, assignment_opened, draft_save_outcome, submission_outcome_resolved, returned_feedback_opened, request_status_viewed. Record event version, module/phase, coarse device class, pseudonymous actor/context reference and bounded outcome category. No answer/message text, file name, raw student name, grades, health details, content hash, guardian restrictions or keystroke capture.

Aggregate workflow reliability, unknown-outcome recovery and completion friction. Do not compute behavioral risk labels, student rankings, hidden engagement scores or grade predictions. Specify retention, access, purpose and deletion policy before analytics collection. The prototype sends no analytics.

## Later AI contract
Permission-filter retrieval at query and source-open time; student-safe sources only; source provenance/version in output; untrusted resource content cannot alter tool policy. School/teacher rules govern assessed-work assistance. No autonomous submission, messages, grades, attendance, consent or account change. Choose providers and data/retention settings before implementation. Missing evidence produces uncertainty, not invented school policy.
