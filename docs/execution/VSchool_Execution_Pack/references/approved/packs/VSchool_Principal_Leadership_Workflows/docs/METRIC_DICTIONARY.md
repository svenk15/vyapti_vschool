# Metric dictionary and evidence contract
All metrics bind institution, branch set, school date/period, server cutoff, definition version, source watermark and access purpose. Exports retain the same metadata. A metric is not trustworthy merely because it has a percentage.

## Register submission coverage
Let E be exact, active, non-cancelled sessions whose register is due by cutoff under the configured school policy. The due rule must name whether the deadline derives from session end, a school cutoff or an owner-configured time; no undocumented hardcoded grace period.

Let R be sessions in E with an authoritative valid final submission at cutoff; a correction/revision does not count the same session twice. Missing = |E| − |R|. Coverage = |R| / |E| only when E is nonempty. Sessions scheduled later and not yet due are excluded from E, even if early submissions exist; show them separately. Cancelled rows and retroactive changes follow documented historical reporting rules.

Example: scheduled 24, due 15, received 12, awaiting 3, not due 9. Dashboard and detail list use the same source snapshot or explicitly signal the refreshed cutoff.

## Pupil attendance
Count exact submitted roster outcomes. A session not submitted is Awaiting submission, never Absent. If showing unique pupils, say Unique pupils and define deduplication/window. Do not silently convert session outcomes into daily attendance.

Present, Late, Absent and Excused remain separate. An attendance percentage needs a published rule describing included outcomes and denominator; no universal rule is assumed. Show register coverage beside any aggregate derived from incomplete submissions. Explain school-date/time basis and historical corrections.

## Repeated absence review
A factual rule counts submitted outcomes for a permitted pupil over a declared window. The school approves the criterion/version. It creates a human review list, not a prediction, diagnosis or disciplinary verdict. Separate source completeness and authorized explanations. Do not infer personal/family reasons.

## Follow-up workload
Open = nonterminal coordination records in the authorized scope. Overdue = open with due_at before cutoff. Evidence ready remains open until verified under the workflow. Closed with evidence means a permitted verifier accepted a fresh owner proof. Cancelled is not successful resolution. Reopened retains past closure history.

Count unique follow-up IDs, not attempts or reminders. One missing-source item has at most one active follow-up for the same purpose under the approved deduplication key.

## Assignment completion
Population = expected learner-assignment pairs due by cutoff, within published audience and current documented extension/excusal policy. Count at most one accepted qualifying submission per pair, regardless of retries or revisions. Distinguish submitted, returned, excused and missing. Private draft existence/content is not a leadership completion signal unless specifically approved and purpose-limited.

## Feedback turnaround
Define the start/end events and whether elapsed hours or school working time is used. Default proposal: accepted qualifying attempt → first returned student-facing feedback on that attempt; resubmission has its own interval. Do not combine private teacher draft save with Returned. Missing/withdrawn evidence follows a documented rule. No staff performance ranking from a raw average.

## Decisions
Awaiting decision, Waiting for information, Decided and Downstream pending are separate. A financial approval does not mean refund settled; notice approval does not mean delivered. Due time and escalation policy belong to each source module.

## Communication coverage
Published eligible audience, current contact eligibility, accepted deliveries, definitive failures and explicit acknowledgements are distinct sets. Opening a notice is not acknowledgement; acknowledgement is not guardian consent. Revisions can require fresh acknowledgement according to owner policy.

## Cross-branch comparison
Use compatible metric versions, periods, calendars and completeness. Never average branch percentages without their denominators; use underlying counts only when populations are comparable. Missing/not-enabled/not-authorized branches are not zero. Branch summary rights do not authorize drill-down.

## Privacy, quality and interpretation
Apply purpose restrictions and small-group suppression where required by school policy. Totals, overlapping filters and exports must not reconstruct suppressed details. A policy suppression threshold alone is not a guarantee of anonymization.

Show source freshness separately from completeness. Stale or unavailable data cannot drive irreversible approval without fresh owner validation. Trend claims require a comparable baseline. No causal assertion, risk label, student league table or private staff/case detail is inferred.
