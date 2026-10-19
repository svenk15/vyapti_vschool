# Landing projection design delta

Date: 19 October 2026. This delta is limited to the five role landing pages and reuses existing owner contracts. It introduces no dashboard store and no cross-owner repository access.

## Teacher

`Learning.teacherWorkspace` already establishes the live account/token, active branch membership, exact Teacher identity, current dated teaching assignments, `learning.assignment.write`, and Homework release/licence/activation dependencies. Its repeatable-read projection may therefore include bounded aggregate feedback workload for those same currently authored assignment versions. The projection returns only counts (`acceptedSubmissions`, `awaitingFeedback`, `feedbackDrafts`) and existing assignment summaries; it exposes no Student identity or response text. The query uses the current assignment-version IDs in one bounded submission read and one feedback read, avoiding an assignment-by-assignment query.

The Teacher landing may show the current/next Attendance session before the full list, owned Learning drafts/publications, and the aggregate feedback workload. Attendance and Learning failures remain separate. No Learning data grants Attendance authority.

## Student and Parent / guardian

The landing pages reuse `Learning.queryStudent` / `Learning.listParent` and `Communication.listStudent` / `Communication.listParent`. Those owner reads recheck the exact accepted Student or Guardian access binding, live purpose, current school context, module availability and current enrollment. Landing lists are bounded presentation slices of those returned owner DTOs. They link to independently protected detail routes and do not expose private work or another child’s data.

Student notice attention means an unread current publication or an explicit acknowledgement still owed. Student due work and feedback remain distinguished by `workStatus`. Parent notice attention uses the same owner facts for the selected child and does not infer delivery from read or acknowledgement.

## Principal

The Principal landing composes bounded reads from the existing typed owner gateways: Leadership decisions, Coordination follow-ups, Learning completion, Assessment readiness and Communication coverage. Each owner independently reauthorizes the current Principal and branch before returning its safe DTO. The landing performs no direct owner-table joins, no writes and no authority inference from navigation. A failed owner read is unavailable, never zero.

## Events authority gaps

Events currently defines Administrator publisher/list, exact Parent child-reader and exact Student self-reader contracts. It has no Teacher or Principal published-event reader. The landing therefore keeps those calendars in the explicit unsupported state.

- Teacher decision needed: whether an active exact Teacher at the branch receives all branch-published events or only events associated with their assigned sections. Recommended: introduce `calendar.event.read_teacher` with an assigned-section filter plus school-wide events; this requires product approval of audience semantics.
- Principal decision needed: whether `leadership.read` includes the branch-published calendar or a separate `calendar.event.read_leadership` capability is required. Recommended: a separate capability and Events-owned branch reader so Leadership access cannot silently broaden.

These gaps affect only the Teacher and Principal calendar sections. They do not block the independent Learning, Communication, decision, follow-up, assessment or Attendance composition work.
