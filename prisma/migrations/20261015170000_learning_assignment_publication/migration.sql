CREATE TABLE "vs_learning_assignment" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "offering_id" UUID NOT NULL,
  "author_teacher_id" UUID NOT NULL,
  "status" VARCHAR(16) NOT NULL,
  "revision" INTEGER NOT NULL,
  "current_version_id" UUID,
  "title" VARCHAR(120) NOT NULL,
  "instructions" VARCHAR(2000) NOT NULL,
  "due_at" TIMESTAMPTZ(3) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_learning_assignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_assignment_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_assignment_status_check" CHECK ("status" IN ('DRAFT','PUBLISHED')),
  CONSTRAINT "vs_learning_assignment_revision_check" CHECK ("revision" >= 1),
  CONSTRAINT "vs_learning_assignment_offering_fkey" FOREIGN KEY ("organization_id","school_id","offering_id") REFERENCES "vs_academics_course_offering"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_assignment_teacher_fkey" FOREIGN KEY ("organization_id","school_id","author_teacher_id") REFERENCES "vs_academics_teacher"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_learning_assignment_current_version_key" ON "vs_learning_assignment"("organization_id","school_id","current_version_id");
CREATE INDEX "vs_learning_assignment_list_idx" ON "vs_learning_assignment"("organization_id","school_id","status","updated_at" DESC,"id");
CREATE INDEX "vs_learning_assignment_teacher_idx" ON "vs_learning_assignment"("organization_id","school_id","author_teacher_id","updated_at" DESC,"id");

CREATE TABLE "vs_learning_assignment_version" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "assignment_id" UUID NOT NULL,
  "version_no" INTEGER NOT NULL,
  "offering_id" UUID NOT NULL,
  "year_id" UUID NOT NULL,
  "section_id" UUID NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "instructions" VARCHAR(2000) NOT NULL,
  "due_at" TIMESTAMPTZ(3) NOT NULL,
  "audience_digest" CHAR(64) NOT NULL,
  "published_by_account_id" UUID NOT NULL,
  "published_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_learning_assignment_version_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_assignment_version_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_assignment_version_number_key" UNIQUE ("organization_id","school_id","assignment_id","version_no"),
  CONSTRAINT "vs_learning_assignment_version_number_check" CHECK ("version_no" >= 1),
  CONSTRAINT "vs_learning_assignment_version_assignment_fkey" FOREIGN KEY ("organization_id","school_id","assignment_id") REFERENCES "vs_learning_assignment"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_assignment_version_offering_fkey" FOREIGN KEY ("organization_id","school_id","offering_id") REFERENCES "vs_academics_course_offering"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_assignment_version_publisher_fkey" FOREIGN KEY ("published_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_learning_assignment_version_due_idx" ON "vs_learning_assignment_version"("organization_id","school_id","due_at","id");
ALTER TABLE "vs_learning_assignment" ADD CONSTRAINT "vs_learning_assignment_current_version_fkey" FOREIGN KEY ("organization_id","school_id","current_version_id") REFERENCES "vs_learning_assignment_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE "vs_learning_assignment_recipient" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "assignment_version_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_learning_assignment_recipient_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_assignment_recipient_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_learning_assignment_recipient_version_student_key" UNIQUE ("organization_id","school_id","assignment_version_id","student_id"),
  CONSTRAINT "vs_learning_assignment_recipient_version_fkey" FOREIGN KEY ("organization_id","school_id","assignment_version_id") REFERENCES "vs_learning_assignment_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_assignment_recipient_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_learning_assignment_recipient_student_idx" ON "vs_learning_assignment_recipient"("organization_id","school_id","student_id","assignment_version_id");

CREATE TABLE "vs_learning_guardian_binding" (
  "id" UUID NOT NULL PRIMARY KEY,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  CONSTRAINT "vs_learning_guardian_binding_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_learning_assignment_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_guardian_binding_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id","student_id") REFERENCES "vs_guardians_child_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_learning_guardian_binding_access_key" ON "vs_learning_guardian_binding"("recipient_id","access_id");
CREATE INDEX "vs_learning_guardian_binding_student_idx" ON "vs_learning_guardian_binding"("organization_id","school_id","student_id","access_id");

CREATE TABLE "vs_learning_student_binding" (
  "id" UUID NOT NULL PRIMARY KEY,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  CONSTRAINT "vs_learning_student_binding_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_learning_assignment_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_student_binding_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id","student_id") REFERENCES "vs_students_portal_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_learning_student_binding_access_key" ON "vs_learning_student_binding"("recipient_id","access_id");
CREATE INDEX "vs_learning_student_binding_student_idx" ON "vs_learning_student_binding"("organization_id","school_id","student_id","access_id");

CREATE OR REPLACE FUNCTION vs_learning_reject_immutable_change() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'LEARNING_VERSION_IMMUTABLE' USING ERRCODE='23514'; END $$;
CREATE TRIGGER vs_learning_version_immutable BEFORE UPDATE OR DELETE ON "vs_learning_assignment_version" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_immutable_change();
CREATE TRIGGER vs_learning_recipient_immutable BEFORE UPDATE OR DELETE ON "vs_learning_assignment_recipient" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_immutable_change();
CREATE TRIGGER vs_learning_guardian_binding_immutable BEFORE UPDATE OR DELETE ON "vs_learning_guardian_binding" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_immutable_change();
CREATE TRIGGER vs_learning_student_binding_immutable BEFORE UPDATE OR DELETE ON "vs_learning_student_binding" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_immutable_change();

ALTER TABLE "vs_guardians_purpose_grant" DROP CONSTRAINT "vs_guardians_purpose_grant_purpose_check";
ALTER TABLE "vs_guardians_purpose_grant" ADD CONSTRAINT "vs_guardians_purpose_grant_purpose_check" CHECK ("purpose" IN ('child.summary.read','attendance.read_child','timetable.read_child','communication.notice.read','attendance.explanation.submit','calendar.event.read_child','learning.assignment.read_child'));
ALTER TABLE "vs_students_portal_purpose_grant" DROP CONSTRAINT "vs_students_portal_purpose_grant_purpose_check";
ALTER TABLE "vs_students_portal_purpose_grant" ADD CONSTRAINT "vs_students_portal_purpose_grant_purpose_check" CHECK ("purpose" IN ('profile.read_self','attendance.read_self','timetable.read_self','communication.notice.read_self','calendar.event.read_self','learning.assignment.read_self'));

COMMENT ON TABLE "vs_learning_assignment" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_learning_assignment_version" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_learning_assignment_recipient" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_learning_guardian_binding" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_learning_student_binding" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=learning; scope=organization_id,school_id; closureGate=TEN-03';
