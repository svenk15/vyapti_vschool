ALTER TABLE "vs_guardians_purpose_grant" DROP CONSTRAINT "vs_guardians_purpose_grant_purpose_check";
ALTER TABLE "vs_guardians_purpose_grant" ADD CONSTRAINT "vs_guardians_purpose_grant_purpose_check" CHECK ("purpose" IN ('child.summary.read', 'attendance.read_child', 'timetable.read_child', 'communication.notice.read'));
COMMENT ON TABLE "vs_guardians_purpose_grant" IS 'VSchool RLS Path A; class=BRANCH; owner=guardians; scope=organization_id,school_id; closureGate=TEN-03';
