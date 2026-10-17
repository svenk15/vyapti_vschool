# Principal engineering closure plan

Updated 18 October 2026 IST from the LEA-22 working checkpoint after repository HEAD `8d1cdbe`. This document reconciles engineering scope; it does not grant human acceptance or production readiness.

## Exact 46-workflow accounting

Engineering complete (45): `LEA-01`, `LEA-02`, `LEA-03`, `LEA-04`, `LEA-05`, `LEA-06`, `LEA-07`, `LEA-08`, `LEA-09`, `LEA-10`, `LEA-11`, `LEA-12`, `LEA-13`, `LEA-14`, `LEA-15`, `LEA-16`, `LEA-17`, `LEA-18`, `LEA-19`, `LEA-20`, `LEA-21`, `LEA-22`, `LEA-23`, `LEA-24`, `LEA-25`, `LEA-26`, `LEA-27`, `LEA-28`, `LEA-29`, `LEA-30`, `LEA-31`, `LEA-32`, `LEA-33`, `LEA-34`, `LEA-35`, `LEA-36`, `LEA-37`, `LEA-38`, `LEA-39`, `LEA-40`, `LEA-41`, `LEA-42`, `LEA-43`, `LEA-44`, `LEA-46`.

Partial (1): `LEA-45` has the complete deterministic source-linked Assistant boundary but lacks an approved real provider/data policy and real-provider evaluation.

Not started (0).

All rows retain human review `PENDING`. Direct comparison status and row-specific deviations remain authoritative in `../PRINCIPAL_WORKFLOW_MATRIX.md`.

## Supported scope and evidence

| Workflows | Implemented owner scope | Principal evidence | Restriction |
|---|---|---|---|
| LEA-01–04, LEA-46 | Explicit Leadership workspace/context, temporary exact delegation, live access loss and account/session controls | `docs/evidence/principal-ldr-01-2026-10-16/`, `principal-lea-02-context-2026-10-16/`, `principal-f02-delegation-2026-10-17/`, `principal-lea-04-access-change-2026-10-16/`, `principal-lea-46-account-2026-10-16/` | D02 delegation issuance and all production use remain synthetic-only; access never implies owner capability. |
| LEA-05–07 | Attendance-backed Today, freshness/retained snapshots and bounded weekly review | `principal-ldr-02-2026-10-16/`, `principal-lea-06-snapshots-2026-10-16/`, `principal-lea-07-weekly-review-2026-10-17/` | Only implemented aggregates; retention/disclosure policy remains a production gate. |
| LEA-08–15 | Attendance coverage, single/bulk Coordination, named-pupil patterns, explanation review, correction requests and guarded cancellation | `principal-lea-08-controls-2026-10-16/`, `principal-coordination-lea-09-11-15-2026-10-16/`, `principal-coordination-lea-10-2026-10-17/`, `principal-lea-12-pupil-attendance-2026-10-18/`, `principal-lea-13-explanation-2026-10-18/`, `principal-lea-14-correction-request-2026-10-18/` | Protected text/real-data retention is not approved; Coordination never gains Attendance write authority. |
| LEA-16 | Published timetable staffing/availability exceptions | `principal-lea-16-timetable-2026-10-16/` | Exact configured occurrence scope only; no inferred HR availability. |
| LEA-17–19 | Learning completion, feedback-awaiting and exact recipient/submission Coordination sources | `principal-lea-17-learning-2026-10-16/`, `principal-f08-learning-followup-2026-10-17/`, `principal-f08-feedback-followup-2026-10-17/` | Aggregate or explicitly named authorized evidence only; private learner work remains excluded. |
| LEA-20–22 | Exact-cycle readiness, typed Coordination handoff, Teacher mark revisions, independent moderation and explicit-audience report publication | `principal-lea-20-completion-2026-10-19/`, `principal-f11-d-assessment-moderation-2026-10-19/`, `principal-lea-22-report-publication-2026-10-18/` | Synthetic report template and local real-scanned portal delivery only; production template/signatory/storage/retention/scanner-service policy remains unavailable. |
| LEA-23–24 | Safe staff availability and exact-occurrence cover | `principal-f07-availability-2026-10-17/`, `principal-f07-cover-2026-10-17/` | Operational facts only; no private reason or general substitution authority. |
| LEA-25, LEA-35 | Synthetic staff-request and protected family-concern lifecycles | `principal-f09-requests-2026-10-18/`, `principal-lea-35-lifecycle-2026-10-18/` | Synthetic protected content only; retention and independent school route remain release configuration. |
| LEA-26 | Bounded Coordination handover | `principal-f04-handover-2026-10-17/` | Only eligible current assignees; source-owner authority is unchanged. |
| LEA-27–31 | Registered-owner inbox, information, decision, recusal/routing and protected recovery | `principal-f03-decisions-2026-10-17/`, `principal-lea-27-decisions-2026-10-17/`, `principal-lea-28-information-2026-10-17/`, `principal-lea-29-decision-2026-10-17/`, `principal-lea-30-recusal-2026-10-17/`, `principal-lea-31-recovery-2026-10-17/` | Covers registered owners only; a generic decision record never grants source authority. |
| LEA-33–34 | Exact-revision notice review/publish and provider-less portal acknowledgement reminders | `principal-f10-notice-review-2026-10-17/`, `principal-f10-communication-reminder-2026-10-17/` | Text/portal only; no attachment or external delivery claim. |
| LEA-36 | Explicit meeting lifecycle and action handoff | `principal-lea-36-meetings-2026-10-19/` | Synthetic meeting scope; no external calendar/provider delivery. |
| LEA-37–38 | Restricted support referral, responsible-person handoff and acknowledgement | `principal-lea-37-38-support-2026-10-19/` | Synthetic protected content; no invented emergency procedure. |
| LEA-39–42 | Bounded aggregate exports, branch comparison, leadership brief and immutable Coordination history | `principal-lea-39-export-2026-10-16/` plus owner-specific LEA-39 directories, `principal-f05-branch-comparison-2026-10-17/`, `principal-f05-leadership-brief-2026-10-17/`, `principal-f04-history-2026-10-17/` | Approved aggregates only; no sensitive subgroup inference or universal export authority. |
| LEA-43 | Exact-money synthetic Finance summary and assigned exception decision | `principal-lea-43-finance-2026-10-19/` | No provider payment, settlement or production financial authority. |
| LEA-44 | Facilities incident, assigned coordination and independent restoration verification | `principal-lea-44-facilities-2026-10-19/` | Facilities only; no broad service/emergency claim. |
| LEA-32 | Real-scanned immutable Notice attachments, exact-digest review, separate publication and current-authority downloads | `principal-f10-notice-review-2026-10-17/`, `documents-f12-foundation-2026-10-17/`, `principal-lea-32-attachments-2026-10-18/` | Synthetic portal scope only; production storage/scanner/retention remains unavailable. |
| LEA-45 | Minimized deterministic Assistant draft, citations, review/discard and source revocation | `principal-lea-45-assistant-2026-10-19/` | PARTIAL: synthetic adapter only; no approved model/provider or transmitted data. |

The D02–D19 approval is explicitly synthetic-only. TEN-03, real-data retention/deletion, restore/load, provider/scanner security, native accessibility, font portability and human acceptance remain independent gates.

## Documents closure classification

### LEA-32 — targeted notice attachment

- **A — authorized code now:** complete Documents promotion/grant/receipt operations; add Next composition and bounded routes; add the Communication owner adapter; bind ordered immutable DocumentVersion IDs into a proposal revision digest; reauthorize Parent/Student recipient purpose, current NoticeVersion, active grant and current clean scan on every same-origin download; add author/reviewer/publisher states, seed and tests.
- **B — local runtime prerequisite:** install a real ClamAV executable, configure/update official signatures and point the host adapter to it; configure ignored `artifacts/documents-private/` mode `0700`. The current Apple Silicon Mac has no ClamAV tools, has about 21 GiB free, and can use one-shot sequential `clamscan` for the bounded 10 MiB first slice. Signature download requires network access. No daemon is required initially.
- **C — external/provider or school policy:** production object provider/region/KMS, scanner service/update SLA, production quota, purpose retention/deletion/legal hold/backup expiry. Email delivery and scheduling are separate Communication decisions and do not block the portal attachment slice.
- **D — missing verification:** real clean PDF/JPEG/PNG; official EICAR test detection; scanner unavailable; mismatched signature, oversize, quota and expiry; replay/conflict; cross-branch and revoked-authority denial; post-link rescan invalidation; withdrawn notice and revoked child/student purpose blocking an old download link; desktop/mobile and keyboard comparison.

Authenticated serving and the application lifecycle are category A engineering work. They are not external-provider blockers.

### LEA-22 — assessment report publication

- **A — authorized code:** complete. Assessments owns exact immutable revisions, explicit publisher handoff, non-empty Student/Guardian audience, exact receipts, withdrawal and new-revision correction. Documents owns real-scanned immutable bytes, grants and current-authority serving.
- **B — local runtime prerequisite:** complete for the synthetic development checkpoint with the same real local ClamAV and ignored private storage used by DOC-02A.
- **C — external/provider or school policy:** production PDF template/signatory, object storage/region/KMS, scanner service/update SLA and purpose-specific retention/deletion/legal hold/backup expiry remain release gates.
- **D — verification:** focused domain and PostgreSQL lifecycle/security, exact replay, recipient revocation, withdrawal and sequential desktop/mobile role journeys passed. Human review, native accessibility and actual browser 200% zoom remain pending.

## LEA-22 rules applied

D11 already settles exact decimal outcomes, frozen plan/cohort, distinct missing states, independent moderation, no stale/unapproved publication, explicit `results.read_self`/`results.read_child` purposes with no backfill, school-approved PDF via Documents, and new immutable revision or withdrawal for changes. D15 already settles private bytes, real fail-closed scan, clean-only linking, current-authority/current-safety download and safe streaming headers.

The 18 October approval is implemented exactly: publisher differs from the mark recorder; the synthetic versioned template contains the required fields and a visibly synthetic signatory without a fake signature; audience is explicit Student/Guardians/Both with no default or backfill; release is immediate; Assessments owns the handoff; withdrawal uses separate live authority and a required reason. A final moderator can publish only when separately designated and still subject to recorder separation. Production policy remains separate.

## Recommended development path

DOC-02A, the real local scanner checkpoint, DOC-05/LEA-32 and F11-E/LEA-22 are complete for synthetic development. No further Principal workflow is independently implementable: LEA-45 is the sole partial and requires the external configuration decisions below before real-provider integration or evaluation.

## LEA-45 configuration checklist

- Approved provider and exact model/version; no automatic model substitution.
- Permitted minimized source fields and prohibited data, including no pupil narrative, secrets, protected explanations or unsupported owner data.
- Processing region/residency where the provider supports region selection.
- Provider input/output retention, training use, abuse logging and deletion terms.
- Credential storage/rotation and environment names; never browser-exposed or committed.
- Per-request/token/monthly cost caps, timeout/rate limits and a provider-off kill switch.
- Evaluations for invented numbers, missing citations, contradictory evidence, prompt injection, revoked source, permission changes, no tool invocation and human review before any separate action.

No provider is selected, no credential is requested and no data may be transmitted until these items are explicitly approved.

## Timestamp provenance and next action

At reconciliation time both the machine timezone and explicit `Asia/Kolkata` time are 18 October 2026 IST. Git commits `0ffaf54`, `bdf6e3b` and `86f2fae` and filesystem timestamps are also 18 October. The `principal-lea-20-completion-2026-10-19` path inherited a future queue label; its evidence remains valid and is not renamed because published historical paths are stable.

DOC-02A, COM-05 and F11-E are complete for synthetic use with real local ClamAV. Exact next task after user decisions is **F17 / WF-45 / LEA-45 real-provider configuration and evaluation**. Until then there is no independently eligible Principal implementation task. Human acceptance remains pending.
