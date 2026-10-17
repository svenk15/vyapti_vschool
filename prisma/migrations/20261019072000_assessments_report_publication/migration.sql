CREATE TABLE "vs_assessments_report_capability_grant" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL, "account_id" uuid NOT NULL, "capability" varchar(32) NOT NULL,
  "granted_by_operator_id" uuid NOT NULL, "granted_at" timestamptz(3) NOT NULL,
  "revoked_at" timestamptz(3), "version" integer NOT NULL,
  CONSTRAINT "vs_assessments_report_capability_values_check" CHECK ("capability" IN ('PUBLISH','WITHDRAW') AND "version">0)
);
CREATE UNIQUE INDEX "vs_assessments_report_capability_scope_id_key" ON "vs_assessments_report_capability_grant"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_capability_account_key" ON "vs_assessments_report_capability_grant"("organization_id","school_id","account_id","capability");
CREATE INDEX "vs_assessments_report_capability_active_idx" ON "vs_assessments_report_capability_grant"("organization_id","school_id","capability","revoked_at","account_id");

CREATE TABLE "vs_assessments_report_template" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "code" varchar(40) NOT NULL, "version_no" integer NOT NULL, "name" varchar(120) NOT NULL,
  "signatory_name" varchar(160) NOT NULL, "signatory_title" varchar(120) NOT NULL,
  "synthetic" boolean NOT NULL, "status" varchar(16) NOT NULL, "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_report_template_values_check" CHECK ("version_no">0 AND "status" IN ('ACTIVE','RETIRED'))
);
CREATE UNIQUE INDEX "vs_assessments_report_template_scope_id_key" ON "vs_assessments_report_template"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_template_version_key" ON "vs_assessments_report_template"("organization_id","school_id","code","version_no");
CREATE INDEX "vs_assessments_report_template_active_idx" ON "vs_assessments_report_template"("organization_id","school_id","status","code","version_no" DESC);

CREATE TABLE "vs_assessments_report_handoff" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "report_revision_id" uuid NOT NULL, "template_id" uuid NOT NULL, "audience" varchar(16) NOT NULL,
  "assigned_publisher_account_id" uuid NOT NULL, "assigned_by_account_id" uuid NOT NULL,
  "source_digest" char(64) NOT NULL, "status" varchar(16) NOT NULL, "version" integer NOT NULL,
  "assigned_at" timestamptz(3) NOT NULL, "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_report_handoff_values_check" CHECK ("audience" IN ('STUDENT','GUARDIANS','BOTH') AND "source_digest" ~ '^[0-9a-f]{64}$' AND "status" IN ('PENDING','PUBLISHED','WITHDRAWN') AND "version">0)
);
CREATE UNIQUE INDEX "vs_assessments_report_handoff_scope_id_key" ON "vs_assessments_report_handoff"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_handoff_revision_key" ON "vs_assessments_report_handoff"("organization_id","school_id","report_revision_id");
CREATE INDEX "vs_assessments_report_handoff_publisher_idx" ON "vs_assessments_report_handoff"("organization_id","school_id","assigned_publisher_account_id","status","assigned_at" DESC);

CREATE TABLE "vs_assessments_report_publication" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "handoff_id" uuid NOT NULL, "report_revision_id" uuid NOT NULL, "template_id" uuid NOT NULL,
  "audience" varchar(16) NOT NULL, "document_version_id" uuid NOT NULL, "document_grant_id" uuid NOT NULL,
  "published_by_account_id" uuid NOT NULL, "published_at" timestamptz(3) NOT NULL, "version" integer NOT NULL,
  CONSTRAINT "vs_assessments_report_publication_values_check" CHECK ("audience" IN ('STUDENT','GUARDIANS','BOTH') AND "version">0)
);
CREATE UNIQUE INDEX "vs_assessments_report_publication_scope_id_key" ON "vs_assessments_report_publication"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_publication_handoff_key" ON "vs_assessments_report_publication"("organization_id","school_id","handoff_id");
CREATE INDEX "vs_assessments_report_publication_report_idx" ON "vs_assessments_report_publication"("organization_id","school_id","report_revision_id","published_at" DESC);

CREATE TABLE "vs_assessments_report_guardian_recipient" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "publication_id" uuid NOT NULL, "access_id" uuid NOT NULL, "student_id" uuid NOT NULL,
  "account_id" uuid NOT NULL, "frozen_at" timestamptz(3) NOT NULL
);
CREATE UNIQUE INDEX "vs_assessments_report_guardian_recipient_scope_id_key" ON "vs_assessments_report_guardian_recipient"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_guardian_recipient_access_key" ON "vs_assessments_report_guardian_recipient"("organization_id","school_id","publication_id","access_id");
CREATE INDEX "vs_assessments_report_guardian_recipient_account_idx" ON "vs_assessments_report_guardian_recipient"("organization_id","school_id","account_id","publication_id");

CREATE TABLE "vs_assessments_report_student_recipient" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "publication_id" uuid NOT NULL, "access_id" uuid NOT NULL, "student_id" uuid NOT NULL,
  "account_id" uuid NOT NULL, "frozen_at" timestamptz(3) NOT NULL
);
CREATE UNIQUE INDEX "vs_assessments_report_student_recipient_scope_id_key" ON "vs_assessments_report_student_recipient"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_student_recipient_access_key" ON "vs_assessments_report_student_recipient"("organization_id","school_id","publication_id","access_id");
CREATE INDEX "vs_assessments_report_student_recipient_account_idx" ON "vs_assessments_report_student_recipient"("organization_id","school_id","account_id","publication_id");

CREATE TABLE "vs_assessments_report_withdrawal" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "publication_id" uuid NOT NULL, "withdrawn_by_account_id" uuid NOT NULL,
  "reason" varchar(500) NOT NULL, "withdrawn_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_report_withdrawal_reason_check" CHECK (char_length(btrim("reason")) BETWEEN 5 AND 500)
);
CREATE UNIQUE INDEX "vs_assessments_report_withdrawal_scope_id_key" ON "vs_assessments_report_withdrawal"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_withdrawal_publication_key" ON "vs_assessments_report_withdrawal"("organization_id","school_id","publication_id");

CREATE TABLE "vs_assessments_report_event" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "handoff_id" uuid NOT NULL, "publication_id" uuid, "type" varchar(32) NOT NULL,
  "actor_account_id" uuid NOT NULL, "details" jsonb NOT NULL, "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_report_event_type_check" CHECK ("type" IN ('ASSIGNED','PUBLISHED','WITHDRAWN'))
);
CREATE UNIQUE INDEX "vs_assessments_report_event_scope_id_key" ON "vs_assessments_report_event"("organization_id","school_id","id");
CREATE INDEX "vs_assessments_report_event_history_idx" ON "vs_assessments_report_event"("organization_id","school_id","handoff_id","occurred_at","id");

ALTER TABLE "vs_assessments_report_capability_grant" ADD CONSTRAINT "vs_assessments_report_capability_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_capability_grant" ADD CONSTRAINT "vs_assessments_report_capability_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_template" ADD CONSTRAINT "vs_assessments_report_template_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_handoff" ADD CONSTRAINT "vs_assessments_report_handoff_report_fkey" FOREIGN KEY ("organization_id","school_id","report_revision_id") REFERENCES "vs_assessments_report_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_handoff" ADD CONSTRAINT "vs_assessments_report_handoff_template_fkey" FOREIGN KEY ("organization_id","school_id","template_id") REFERENCES "vs_assessments_report_template"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_publication" ADD CONSTRAINT "vs_assessments_report_publication_handoff_fkey" FOREIGN KEY ("organization_id","school_id","handoff_id") REFERENCES "vs_assessments_report_handoff"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_publication" ADD CONSTRAINT "vs_assessments_report_publication_report_fkey" FOREIGN KEY ("organization_id","school_id","report_revision_id") REFERENCES "vs_assessments_report_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_publication" ADD CONSTRAINT "vs_assessments_report_publication_template_fkey" FOREIGN KEY ("organization_id","school_id","template_id") REFERENCES "vs_assessments_report_template"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_publication" ADD CONSTRAINT "vs_assessments_report_publication_document_version_fkey" FOREIGN KEY ("document_version_id") REFERENCES "vs_documents_document_version"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_publication" ADD CONSTRAINT "vs_assessments_report_publication_document_grant_fkey" FOREIGN KEY ("document_grant_id") REFERENCES "vs_documents_document_grant"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_guardian_recipient" ADD CONSTRAINT "vs_assessments_report_guardian_recipient_publication_fkey" FOREIGN KEY ("organization_id","school_id","publication_id") REFERENCES "vs_assessments_report_publication"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_guardian_recipient" ADD CONSTRAINT "vs_assessments_report_guardian_recipient_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id") REFERENCES "vs_guardians_child_access"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_student_recipient" ADD CONSTRAINT "vs_assessments_report_student_recipient_publication_fkey" FOREIGN KEY ("organization_id","school_id","publication_id") REFERENCES "vs_assessments_report_publication"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_student_recipient" ADD CONSTRAINT "vs_assessments_report_student_recipient_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id") REFERENCES "vs_students_portal_access"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_withdrawal" ADD CONSTRAINT "vs_assessments_report_withdrawal_publication_fkey" FOREIGN KEY ("organization_id","school_id","publication_id") REFERENCES "vs_assessments_report_publication"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_event" ADD CONSTRAINT "vs_assessments_report_event_handoff_fkey" FOREIGN KEY ("organization_id","school_id","handoff_id") REFERENCES "vs_assessments_report_handoff"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "vs_guardians_purpose_grant" DROP CONSTRAINT "vs_guardians_purpose_grant_purpose_check";
ALTER TABLE "vs_guardians_purpose_grant" ADD CONSTRAINT "vs_guardians_purpose_grant_purpose_check" CHECK ("purpose" IN ('child.summary.read','attendance.read_child','attendance.correction.request_child','timetable.read_child','communication.notice.read','attendance.explanation.submit','calendar.event.read_child','learning.assignment.read_child','results.read_child'));
ALTER TABLE "vs_students_portal_purpose_grant" DROP CONSTRAINT "vs_students_portal_purpose_grant_purpose_check";
ALTER TABLE "vs_students_portal_purpose_grant" ADD CONSTRAINT "vs_students_portal_purpose_grant_purpose_check" CHECK ("purpose" IN ('profile.read_self','attendance.read_self','attendance.correction.request_self','timetable.read_self','communication.notice.read_self','calendar.event.read_self','learning.assignment.read_self','results.read_self'));

CREATE TRIGGER "vs_assessments_report_publication_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_publication" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();
CREATE TRIGGER "vs_assessments_report_guardian_recipient_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_guardian_recipient" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();
CREATE TRIGGER "vs_assessments_report_student_recipient_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_student_recipient" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();
CREATE TRIGGER "vs_assessments_report_withdrawal_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_withdrawal" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();
CREATE TRIGGER "vs_assessments_report_event_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_event" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();

COMMENT ON TABLE "vs_assessments_report_capability_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_template" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_handoff" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_publication" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_guardian_recipient" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_student_recipient" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_withdrawal" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
