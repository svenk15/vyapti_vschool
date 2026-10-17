ALTER TABLE "vs_guardians_purpose_grant"
  DROP CONSTRAINT "vs_guardians_purpose_grant_purpose_check";

ALTER TABLE "vs_guardians_purpose_grant"
  ADD CONSTRAINT "vs_guardians_purpose_grant_purpose_check"
  CHECK ("purpose" IN (
    'child.summary.read',
    'attendance.read_child',
    'attendance.correction.request_child',
    'timetable.read_child',
    'communication.notice.read',
    'attendance.explanation.submit',
    'calendar.event.read_child',
    'learning.assignment.read_child'
  ));

ALTER TABLE "vs_students_portal_purpose_grant"
  DROP CONSTRAINT "vs_students_portal_purpose_grant_purpose_check";

ALTER TABLE "vs_students_portal_purpose_grant"
  ADD CONSTRAINT "vs_students_portal_purpose_grant_purpose_check"
  CHECK ("purpose" IN (
    'profile.read_self',
    'attendance.read_self',
    'attendance.correction.request_self',
    'timetable.read_self',
    'communication.notice.read_self',
    'calendar.event.read_self',
    'learning.assignment.read_self'
  ));

COMMENT ON CONSTRAINT "vs_guardians_purpose_grant_purpose_check" ON "vs_guardians_purpose_grant"
  IS 'Explicit Guardian purpose allowlist; attendance correction request access does not grant mark mutation authority.';

COMMENT ON CONSTRAINT "vs_students_portal_purpose_grant_purpose_check" ON "vs_students_portal_purpose_grant"
  IS 'Explicit Student purpose allowlist; attendance correction request access does not grant mark mutation authority.';
