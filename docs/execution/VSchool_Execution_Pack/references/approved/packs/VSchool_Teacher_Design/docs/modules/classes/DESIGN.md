# My classes — Teacher design

Edition 01 · First phase 1 · UX design proposal

See assigned teaching contexts and only the pupil facts needed for them.

Domain owner(s): academics, students. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-07 — Review my assigned classes

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `classes`. Required capability/condition: **class.read for dated assignments**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Class context** — Choose an assigned offering, not an institution-wide class directory.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
2. **Class workspace** — Show the relevant year, subject, assignment dates and upcoming sessions.
   - View: `select`; required; choices: Roster, Upcoming sessions, Authorized attendance history.

### Outcome and domain invariant

The class workspace explains what the teacher can do and for which dates.

Recheck the dated assignment on every protected read. Historical visibility follows the current approved access contract, not lifelong access from one past lesson.

### Failure and recovery

Ended or changed assignments show unavailable content and an administrator handoff.

### Data workflow and ownership

Academics Offering/Assignment/Teacher eligibility compose an authorized class DTO; Students supplies only minimal roster facts.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-08 — Review a minimal class roster

Phase: 1 (Attendance pilot). Reconcile the approved module scope before implementation.

Entry: `classes/c1`. Required capability/condition: **class.read + assigned-roster student.read**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Roster scope** — The effective class/date determines membership.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Roster date: `date`; required.
2. **Student context** — See only the data needed for assigned teaching.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - View: `select`; required; choices: Student name and school reference, Assigned-session attendance.

### Outcome and domain invariant

The teacher can identify the correct pupil without gaining full student-record access.

No institution-wide person search, unrelated pupil directory, bulk pupil export, financial ledger, custody detail or clinical narrative.

### Failure and recovery

A pupil joining/leaving on a boundary changes future roster eligibility; already opened session rosters remain frozen.

### Data workflow and ownership

Students Student → Person → effective Enrollment/SectionPlacement → authorized class. Session view uses frozen roster instead of live enrollment.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
