ALTER TABLE "vs_guardians_purpose_grant" DROP CONSTRAINT "vs_guardians_purpose_grant_purpose_check";
ALTER TABLE "vs_guardians_purpose_grant" ADD CONSTRAINT "vs_guardians_purpose_grant_purpose_check" CHECK ("purpose" IN ('child.summary.read','attendance.read_child','timetable.read_child','communication.notice.read','attendance.explanation.submit','calendar.event.read_child'));

ALTER TABLE "vs_students_portal_purpose_grant" DROP CONSTRAINT "vs_students_portal_purpose_grant_purpose_check";
ALTER TABLE "vs_students_portal_purpose_grant" ADD CONSTRAINT "vs_students_portal_purpose_grant_purpose_check" CHECK ("purpose" IN ('profile.read_self','attendance.read_self','timetable.read_self','communication.notice.read_self','calendar.event.read_self'));

COMMENT ON TABLE "vs_guardians_purpose_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_students_portal_purpose_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=students; scope=organization_id,school_id; closureGate=TEN-03';
