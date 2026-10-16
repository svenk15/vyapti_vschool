ALTER TABLE "vs_students_portal_purpose_grant" DROP CONSTRAINT "vs_students_portal_purpose_grant_purpose_check";
ALTER TABLE "vs_students_portal_purpose_grant" ADD CONSTRAINT "vs_students_portal_purpose_grant_purpose_check" CHECK ("purpose" IN ('profile.read_self', 'attendance.read_self', 'timetable.read_self', 'communication.notice.read_self'));

CREATE TABLE "vs_communication_student_recipient_binding" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  CONSTRAINT "vs_communication_student_recipient_binding_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_student_binding_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_communication_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_student_binding_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id","student_id") REFERENCES "vs_students_portal_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_student_binding_access_key" UNIQUE ("recipient_id","access_id")
);
CREATE INDEX "vs_communication_student_binding_student_idx" ON "vs_communication_student_recipient_binding"("organization_id","school_id","student_id","recipient_id");

COMMENT ON TABLE "vs_students_portal_purpose_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=students; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_student_recipient_binding" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
