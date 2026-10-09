# Query and join design

These are explanatory parameterized SELECT shapes, not authorization replacements or SQL to run against production. Run only through an owner adapter after its current guard. Preserve ORM query semantics unless intentionally changing the owner read model. `$1/$2` are verified organization/school; resource/date values are separately validated.

## Student detail history
```sql
SELECT s.id AS student_id, s.admission_number,
       p.first_name, p.last_name,
       e.id AS enrollment_id, e.year_id,
       e.valid_from AS enrolled_from, e.valid_to AS enrolled_until,
       sp.id AS placement_id, sp.section_id,
       sp.valid_from AS placed_from, sp.valid_to AS placed_until,
       sec.name AS section_name, g.name AS grade_name
FROM vs_students_student s
JOIN vs_people_person p
  ON p.organization_id = s.organization_id AND p.id = s.person_id
LEFT JOIN vs_students_enrollment e
  ON e.organization_id = s.organization_id AND e.school_id = s.school_id
 AND e.student_id = s.id
LEFT JOIN vs_students_section_placement sp
  ON sp.organization_id = e.organization_id AND sp.school_id = e.school_id
 AND sp.enrollment_id = e.id
LEFT JOIN vs_academics_section sec
  ON sec.organization_id = sp.organization_id AND sec.school_id = sp.school_id
 AND sec.id = sp.section_id
LEFT JOIN vs_academics_grade_level g
  ON g.organization_id = sec.organization_id AND g.school_id = sec.school_id
 AND g.id = sec.grade_id
WHERE s.organization_id = $1 AND s.school_id = $2 AND s.id = $3
ORDER BY e.valid_from, sp.valid_from, sp.id;
```

A one-to-many join multiplies rows; group by enrollment/placement identities when mapping DTO, never count rows as pupils. Current implementation uses scoped includes/secondary queries; do not replace working queries solely to match this illustrative SQL. For the current placement add `valid_from <= $4::date AND valid_to > $4::date`; history view intentionally omits that filter.

## Frozen attendance display
```sql
SELECT r.student_id, r.display_name_snapshot, r.roll_number_snapshot,
       a.status, a.late_minutes, a.current_revision
FROM vs_attendance_session_roster_entry r
LEFT JOIN vs_attendance_record a
  ON a.organization_id = r.organization_id AND a.school_id = r.school_id
 AND a.session_id = r.session_id AND a.student_id = r.student_id
WHERE r.organization_id = $1 AND r.school_id = $2 AND r.session_id = $3
ORDER BY r.student_id;
```

Display the pinned name/roll snapshots, not a newly joined current placement as if it were the original register. NULL mark in an open register means unmarked, not absent. Session detail must authorize this session before the join; a scoped school predicate alone is insufficient for a teacher.

## Teacher session path
Resolve verified account binding in Organization → Person → active branch Employee/Teacher with valid employment date → dated TeacherAssignment → CourseOffering → AttendanceSession for schoolDate. Assignment validity uses valid_from<=date<valid_to. Reference the existing PrismaSessionRepository.currentTeacher/teacherDay/assignedTeacher checks. Do not authorize only by teacher_id supplied in a query parameter. Cancelled visibility and permitted date interval are current owner rules.

## Report aggregation
Use session-level status counts separately from pupil mark aggregates to avoid multiplying a session by its roster size. Preserve current reporting denominator and asOf. Filter year/section/subject through offering relationships with the same scope. Pagination applies to detail rows, not the total query. A single transaction/snapshot or explicitly documented cutoff keeps summary and details interpretable.

## Query plans and bounds
Existing index declarations are listed per table and additional indexes in migration SQL. Do not add speculative indexes for every field. For changed large queries capture EXPLAIN (ANALYZE, BUFFERS) on the guarded synthetic test environment, inspect actual rows/loops/sort/spill and query count. Parameters and logs must not contain real pupil data. Read-only plan inspection does not require mutating production data.

TEN-03 load profile remains 5,000 pupils/branch ×20 branches, attendance submit p95<1 second excluding client network. Specify session roster size (current pilot limit200), concurrent users, arrival rate, warmup, duration, pool/hardware and dataset distribution in its benchmark. Do not claim p95 merely from100k pupil fixtures or extrapolate unit-test duration. No invented concurrency number becomes an accepted release SLO without recording the benchmark profile.
