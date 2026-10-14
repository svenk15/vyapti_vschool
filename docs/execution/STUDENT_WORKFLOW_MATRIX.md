# Student workspace workflow matrix

Cross-workspace capability planning is consolidated in [Combined Parent/Student implementation backlog](./PARENT_STUDENT_IMPLEMENTATION_BACKLOG.md). This matrix remains authoritative for Student workflow status.

Last reconciled: 14 October 2026. Canonical inventory: Student Workspace Edition 01, 47 workflows, source SHA-256 `74dc76af2e3b2000dfeb4b1258d49c6081aa255d6294f9ac6fe10ae59253cc9b`. Functional/security, visual comparison and human acceptance are independent.

| Workflow | Area | Functional/security | Visual comparison | Dependency / next action | Human review | Overall |
|---|---|---|---|---|---|---|
| STW-01 — Find the correct school sign-in | access | VERIFIED — existing authentication resolves only accepted Student contexts; no public lookup or inferred role. | VERIFIED through unchanged shared branded-sign-in evidence; Student landing was directly inspected. | School-specific sign-in remains the existing branding owner contract. | PENDING | ENGINEERING_COMPLETE |
| STW-02 — Activate an issued student account | access | VERIFIED — single-use intended-account setup, existing-account sign-in, exact Person binding, expiry/replay/revocation and OPERATOR_CLI assistance. | PARTIAL — activation was directly compared desktop/mobile; the anonymous secure setup is a labelled extension because the prototype embeds an authenticated review shell. | No security authority was copied from the prototype shell. | PENDING | ENGINEERING_COMPLETE |
| STW-03 — Recover access | access | VERIFIED — Student affiliation participates in account-wide strictest-trust recovery; there is no weaker Student reset. | VERIFIED through unchanged shared recovery evidence; no Student-specific visual fork. | Account recovery remains Access-owned. | PENDING | ENGINEERING_COMPLETE |
| STW-04 — Switch enrollment context | access | VERIFIED — two independently authorized and accepted organization contexts are projected; switching clears prior scoped data and revoking one retains the unrelated binding. | VERIFIED — populated two-context desktop/mobile selector and switched identity state directly inspected. | No known implementation gap; each context still requires its own exact authorization and acceptance. | PENDING | ENGINEERING_COMPLETE |
| STW-05 — Handle expired or withdrawn access | access | VERIFIED — revoked/expired/reused setup is denied and an open Student page loses access after per-Student revocation. | VERIFIED through focused browser unavailable-state coverage; desktop/mobile shell comparisons completed. | No known implementation gap. | PENDING | ENGINEERING_COMPLETE |
| STW-06 — Plan my school day | day | Current class, authorized context and real Timetable/Attendance entry are implemented; next-class/learning-task projection is absent. | PARTIAL — supported home/current-context composition directly inspected; prototype learning cards are not faked. | Learning/task owner data and projection contract are missing. | PENDING | PARTIAL |
| STW-07 — Read my timetable | day | VERIFIED — self-only published occurrences and effective configured day/period patterns are bounded by active Enrollment/Placement and module availability. | VERIFIED — six-day weekly grid/day tabs, configured break and genuine empty week directly inspected at desktop/mobile sizes. | Rooms and dated substitutions remain absent when owner data is absent; no values are fabricated. | PENDING | ENGINEERING_COMPLETE |
| STW-08 — Respond to a changed class | day | NOT_STARTED | NOT_STARTED | Timetable room/change projection is not in the current owner schema. | PENDING | BLOCKED |
| STW-09 — Open an assigned class space | day | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-10 — Find and organize assignments | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-11 — Understand an assignment | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-12 — Open learning resources | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-13 — Save and resume my draft | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-14 — Attach and check a file | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-15 — Review and submit work | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-16 — Recover an uncertain submission | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-17 — Submit under late or extended rules | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-18 — Revise and resubmit returned work | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-19 — Withdraw a submission when allowed | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-20 — Request more time | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-21 — Continue safely on a poor connection | assignments | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-22 — Read returned teacher feedback | feedback | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-23 — Understand criteria and subject progress | feedback | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-24 — Ask about feedback | feedback | NOT_STARTED | NOT_STARTED | Learning/assignment owner contract and persistence are absent. | PENDING | BLOCKED |
| STW-25 — View my recorded attendance | attendance | VERIFIED — exact own roster history; OPEN is awaiting submission and never absence; no mark/correct/cancel authority. | VERIFIED — populated desktop/mobile table and factual status treatment directly compared. | Aggregate percentage and correction request stay absent because their owner semantics are unresolved. | PENDING | ENGINEERING_COMPLETE |
| STW-26 — Query an attendance discrepancy | attendance | NOT_STARTED | NOT_STARTED | Requests owner lifecycle is absent. | PENDING | BLOCKED |
| STW-27 — Read a school notice | communication | NOT_STARTED | NOT_STARTED | Communication owner/audience lifecycle is absent. | PENDING | BLOCKED |
| STW-28 — Acknowledge a notice | communication | NOT_STARTED | NOT_STARTED | Communication owner/audience lifecycle is absent. | PENDING | BLOCKED |
| STW-29 — Message a permitted teacher | communication | NOT_STARTED | NOT_STARTED | Communication owner/audience lifecycle is absent. | PENDING | BLOCKED |
| STW-30 — Recover a message delivery problem | communication | NOT_STARTED | NOT_STARTED | Communication owner/audience lifecycle is absent. | PENDING | BLOCKED |
| STW-31 — Review published events and assessments | calendar | NOT_STARTED | NOT_STARTED | Calendar/events owner and response rules are absent. | PENDING | BLOCKED |
| STW-32 — Express event interest | calendar | NOT_STARTED | NOT_STARTED | Calendar/events owner and response rules are absent. | PENDING | BLOCKED |
| STW-33 — View my published report | results | NOT_STARTED | NOT_STARTED | Assessment publication/report owner is absent. | PENDING | BLOCKED |
| STW-34 — Download a published report | results | NOT_STARTED | NOT_STARTED | Assessment publication/report owner is absent. | PENDING | BLOCKED |
| STW-35 — Ask about a result | results | NOT_STARTED | NOT_STARTED | Assessment publication/report owner is absent. | PENDING | BLOCKED |
| STW-36 — Create a school support request | requests | NOT_STARTED | NOT_STARTED | Requests owner lifecycle is absent. | PENDING | BLOCKED |
| STW-37 — Track or withdraw my request | requests | NOT_STARTED | NOT_STARTED | Requests owner lifecycle is absent. | PENDING | BLOCKED |
| STW-38 — Request a profile correction | requests | NOT_STARTED | NOT_STARTED | Requests owner lifecycle is absent. | PENDING | BLOCKED |
| STW-39 — Review my library loans | services | NOT_STARTED | NOT_STARTED | The named service owner and authorization contract are absent. | PENDING | BLOCKED |
| STW-40 — Request a library renewal | services | NOT_STARTED | NOT_STARTED | The named service owner and authorization contract are absent. | PENDING | BLOCKED |
| STW-41 — Join an enabled activity | services | NOT_STARTED | NOT_STARTED | The named service owner and authorization contract are absent. | PENDING | BLOCKED |
| STW-42 — Read my transport assignment | services | NOT_STARTED | NOT_STARTED | The named service owner and authorization contract are absent. | PENDING | BLOCKED |
| STW-43 — Request student wellbeing support | services | NOT_STARTED | NOT_STARTED | The named service owner and authorization contract are absent. | PENDING | BLOCKED |
| STW-44 — Manage my sessions | account | Current-session sign-out is verified; other-session inventory and revocation are absent. | PARTIAL — supported Account composition exercised; unsupported controls are omitted. | Cross-session inventory/revocation owner contract and capability mapping are missing. | PENDING | PARTIAL |
| STW-45 — Set preferences or request contact change | account | NOT_STARTED | NOT_STARTED | Preference keys and verified contact-change lifecycle are not approved. | PENDING | BLOCKED |
| STW-46 — Get help with privacy or accessibility | account | Static account-help guidance exists; an actionable privacy/accessibility request is absent. | PARTIAL — supported Account help is exercised; no dead request action is shown. | Requests owner, routing, authority and lifecycle require a product contract. | PENDING | PARTIAL |
| STW-47 — Ask a learning question with sources | assistant | NOT_STARTED | NOT_STARTED | AI provider, retrieval, safety and retention contracts are absent. | PENDING | BLOCKED |

## Current-release extension

The authorized minimal `/student/profile` route is a Student self projection of existing Student, Person, Enrollment and Placement data. It adds no edit/correction authority and is tracked under STW-A01 because the Edition 01 catalog has no separate read-profile workflow.
