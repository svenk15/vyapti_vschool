# EX-11 design delta

Date: 2026-10-10

- **Reference and routes:** approved Teacher Today and roll-call compositions at `/teacher/today` and `/teacher/sessions/[id]`.
- **Use cases:** select an allowed school date, review only assigned sessions, open and freeze the exact roster, explicitly mark every pupil, review totals, submit once, recover an uncertain submit by its retained key, and reload a read-only submitted register.
- **Existing seams:** teacher day/detail and open/submit/status calls remain on `attendanceGateway` and the existing Attendance APIs. The teacher portal shell continues to expose only My teaching day because separate class/history owner queries do not exist.
- **Reads and writes:** day/detail reads retain current dated assignment and resource authorization. Open writes the frozen roster/hash and advances the session. Submit writes the complete register, immutable revision, session metadata and evidence atomically. The existing account → Organization → School → session locks, version, roster revision and teacher-scoped command receipt remain unchanged.
- **Authorization:** teacher role alone remains insufficient. Every read/open/submit/status request rechecks live account, branch membership, Employee/Teacher eligibility, exact date-effective assignment, capability and module state. Another teacher receives resource-safe denial. Submitted registers expose no correction control to teachers.
- **Presentation and behavior:** use the teacher-width page stack, compact date toolbar, session rows, scoped session facts, explicit empty/error states, a contained roster table and a distinct review/confirmation footer. New roster rows begin unmarked; Present is never an implicit saved default. “Mark all present” is the explicit bulk command. Unknown submit outcome retains exact entries and key and offers status recovery.
- **Focused verification:** Attendance unit rules; real PostgreSQL roster/submit/replay/revocation/concurrency cases; desktop/mobile browser journey including assigned day, explicit marking, recovery, read-only reload and other-teacher denial; screenshot/overflow inspection.
- **Migration and seed impact:** no schema change expected. Existing connected teacher/attendance fixtures are reused; final date coherence remains in EX-13/EX-14.

Separate My classes/history and teacher correction-request workflows lack approved current owner queries and remain outside this slice. No unresolved decision blocks the supported roll-call workflow.
