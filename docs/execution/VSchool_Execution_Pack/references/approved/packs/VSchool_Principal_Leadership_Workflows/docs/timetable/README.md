# Timetable & Daily Changes — TT-01

8 October 2026 · Coordinated design release · Proposed Phase 3 module

This is the **single shared timetable specification** for the six persona packs. The coordinated release keeps its editable master in `shared/docs/`. Each standalone pack contains a byte-identical offline snapshot in `docs/timetable/`; change the master and regenerate snapshots, never maintain six different task lists. `SHARED_CONTRACT.json` records content hashes.

The browser model and interface are shared too. Standalone previews have independent fictional in-memory state. They do not synchronize with one another, send messages, authorize real users or update the Next.js application.

## Read in this order
1. `WORKFLOWS.md`: owners, navigation, happy paths, exceptions, screen contracts.
2. `HLD.md`: boundaries, aggregates, ports and entitlement dependencies.
3. `LLD.md`: candidate PostgreSQL schemas, joins, transactions and sequence diagrams.
4. `TASKS.md`: one implementation sequence and demo acceptance for every slice.
5. `TEST_STRATEGY.md`: meaningful verification and evidence requirements.
6. `CURRENT_STATE.md`: what is designed, demonstrated and still unimplemented/unverified.

## First cut
Manual weekly timetable with clash detection; working days and periods; effective-dated publication; dated cover, same-day time/room moves, cancellation and restoration; teacher requests and cover acknowledgement; permitted teacher/student/parent views; attendance handoff; principal exceptions; operator license and branch activation preview.

Keep two-week cycles, automatic timetable optimization, cross-branch teacher travel optimization, payroll calculations and medical leave reasons outside this first cut. Existing outline references to two-week schedules describe a later extension, not a supported input in TT-01.

## Where to open it
| Pack | Navigation / stable journey |
|---|---|
| Administrator | Timetable & daily changes → Timetables / Daily changes; SA-41, SA-42 |
| Teacher | My timetable; My teaching day → Open my timetable; TEA-22, TEA-23, TEA-24 |
| Student | My timetable; STW-07, STW-08 |
| Parent / guardian | Select child → Child’s timetable; extends PAR-18 with an explicit timetable purpose |
| Principal | School planning → Review timetable exceptions; LEA-16. LEA-24 remains separately delegated, not implicitly granted |
| Operator | Institutions → chosen institution → Modules → Review Timetable; OP-J11, OP-J12 extension |

Opening an operational preview without a hash starts on its new timetable screen. All existing routes remain available. The operator retains its institutions-first entry.

## Connected demonstration
Use the administrator preview to keep one shared review state while changing the fictional viewing role:
1. Open Timetables. Inspect the seeded published week of 12 October.
2. Edit timetable. Open Monday Mathematics; change its teacher to Rohan Das. Save lesson. Save draft, view published, and resume to prove the separation.
3. Review & publish. Check the effective date and impact; confirm. Open the published timetable.
4. Daily changes → New daily change. Choose a later lesson and assign eligible cover. Rohan is unavailable during Grade 6B’s Mathematics slot, so that option must be excluded where it clashes.
5. Expand Design review tools → Review as substitute. Open the covered lesson and acknowledge it. Open attendance, advance the fictional review clock, open the roster and record every pupil before submitting.
6. Back to administrator. Attempt to change that opened/submitted session; it must be refused.
7. Design review tools → Student view / Parent view. Inspect the same published lesson; there are no editing controls. Staff operational reasons are not exposed.
8. Principal view shows pending acknowledgements or uncovered lessons with school coordinator ownership. No marking or editing authority is granted.

The simulated attendance dialog illustrates the owner handoff; the live implementation must call the existing Attendance application use cases, not create a second register implementation.

## Integration note
This pack does not renumber Bible phases, complete TEN-03, bypass IAM acceptance, retire prior workflows or claim release readiness. Reconcile the current live repository before assigning production task IDs. The canonical Bible receives the proposed addition only through the normal product-document update; no unseen live Bible was overwritten.
