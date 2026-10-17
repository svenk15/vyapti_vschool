CREATE TABLE "vs_assessments_oversight_grant" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL, "account_id" uuid NOT NULL, "granted_by_operator_id" uuid NOT NULL,
  "granted_at" timestamptz(3) NOT NULL, "revoked_at" timestamptz(3), "version" integer NOT NULL,
  CONSTRAINT "vs_assessments_oversight_version_check" CHECK ("version">0)
);
CREATE UNIQUE INDEX "vs_assessments_oversight_scope_id_key" ON "vs_assessments_oversight_grant"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_oversight_account_key" ON "vs_assessments_oversight_grant"("organization_id","school_id","account_id");
CREATE INDEX "vs_assessments_oversight_active_idx" ON "vs_assessments_oversight_grant"("organization_id","school_id","account_id","revoked_at");

CREATE TABLE "vs_assessments_scale" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "code" varchar(40) NOT NULL, "name" varchar(120) NOT NULL, "minimum_scaled" integer NOT NULL,
  "maximum_scaled" integer NOT NULL, "precision" integer NOT NULL, "rounding" varchar(16) NOT NULL,
  "status" varchar(16) NOT NULL, "version" integer NOT NULL, "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_scale_values_check" CHECK ("minimum_scaled">=0 AND "maximum_scaled">"minimum_scaled" AND "precision" BETWEEN 0 AND 4 AND "rounding" IN ('HALF_UP','HALF_EVEN') AND "status" IN ('ACTIVE','RETIRED') AND "version">0)
);
CREATE UNIQUE INDEX "vs_assessments_scale_scope_id_key" ON "vs_assessments_scale"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_scale_code_key" ON "vs_assessments_scale"("organization_id","school_id","code");

CREATE TABLE "vs_assessments_cycle" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "academic_year_id" uuid NOT NULL, "section_id" uuid NOT NULL, "scale_id" uuid NOT NULL,
  "code" varchar(40) NOT NULL, "name" varchar(160) NOT NULL, "scheme_version" integer NOT NULL,
  "state" varchar(20) NOT NULL, "source_cutoff" timestamptz(3) NOT NULL, "version" integer NOT NULL,
  "created_at" timestamptz(3) NOT NULL, "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_cycle_state_check" CHECK ("scheme_version">0 AND "version">0 AND "state" IN ('DRAFT','OPEN','MARKING','MODERATION','APPROVED','RELEASED','WITHDRAWN'))
);
CREATE UNIQUE INDEX "vs_assessments_cycle_scope_id_key" ON "vs_assessments_cycle"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_cycle_code_key" ON "vs_assessments_cycle"("organization_id","school_id","code");
CREATE INDEX "vs_assessments_cycle_state_idx" ON "vs_assessments_cycle"("organization_id","school_id","state","updated_at" DESC,"id" DESC);

CREATE TABLE "vs_assessments_plan_item" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "cycle_id" uuid NOT NULL, "subject_id" uuid NOT NULL, "maximum_scaled" integer NOT NULL,
  "weight_basis_points" integer NOT NULL, "required" boolean NOT NULL, "position" integer NOT NULL,
  CONSTRAINT "vs_assessments_plan_values_check" CHECK ("maximum_scaled">0 AND "weight_basis_points" BETWEEN 0 AND 10000 AND "position">0)
);
CREATE UNIQUE INDEX "vs_assessments_plan_scope_id_key" ON "vs_assessments_plan_item"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_plan_subject_key" ON "vs_assessments_plan_item"("organization_id","school_id","cycle_id","subject_id");
CREATE INDEX "vs_assessments_plan_cycle_idx" ON "vs_assessments_plan_item"("organization_id","school_id","cycle_id","required","position");

CREATE TABLE "vs_assessments_cohort_member" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "cycle_id" uuid NOT NULL, "student_id" uuid NOT NULL, "enrollment_id" uuid NOT NULL, "placement_id" uuid NOT NULL, "year_id" uuid NOT NULL,
  "state" varchar(16) NOT NULL, "position" integer NOT NULL, "frozen_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_cohort_values_check" CHECK ("state" IN ('ACTIVE','WITHDRAWN') AND "position">0)
);
CREATE UNIQUE INDEX "vs_assessments_cohort_scope_id_key" ON "vs_assessments_cohort_member"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_cohort_student_key" ON "vs_assessments_cohort_member"("organization_id","school_id","cycle_id","student_id");
CREATE INDEX "vs_assessments_cohort_cycle_idx" ON "vs_assessments_cohort_member"("organization_id","school_id","cycle_id","state","position");

CREATE TABLE "vs_assessments_outcome" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "cycle_id" uuid NOT NULL, "plan_item_id" uuid NOT NULL, "cohort_member_id" uuid NOT NULL,
  "state" varchar(20) NOT NULL, "score_scaled" integer, "recorder_account_id" uuid NOT NULL,
  "current_revision" integer NOT NULL, "version" integer NOT NULL, "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_outcome_value_check" CHECK ("state" IN ('NUMERIC','NOT_ASSESSED','ABSENT','EXCUSED') AND (("state"='NUMERIC' AND "score_scaled" IS NOT NULL) OR ("state"<>'NUMERIC' AND "score_scaled" IS NULL)) AND "current_revision">0 AND "version">0)
);
CREATE UNIQUE INDEX "vs_assessments_outcome_scope_id_key" ON "vs_assessments_outcome"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_outcome_slot_key" ON "vs_assessments_outcome"("organization_id","school_id","plan_item_id","cohort_member_id");
CREATE INDEX "vs_assessments_outcome_cycle_state_idx" ON "vs_assessments_outcome"("organization_id","school_id","cycle_id","state");

CREATE TABLE "vs_assessments_outcome_revision" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "outcome_id" uuid NOT NULL, "number" integer NOT NULL, "state" varchar(20) NOT NULL,
  "score_scaled" integer, "recorder_account_id" uuid NOT NULL, "recorded_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_outcome_revision_value_check" CHECK ("number">0 AND "state" IN ('NUMERIC','NOT_ASSESSED','ABSENT','EXCUSED') AND (("state"='NUMERIC' AND "score_scaled" IS NOT NULL) OR ("state"<>'NUMERIC' AND "score_scaled" IS NULL)))
);
CREATE UNIQUE INDEX "vs_assessments_outcome_revision_scope_id_key" ON "vs_assessments_outcome_revision"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_outcome_revision_number_key" ON "vs_assessments_outcome_revision"("organization_id","school_id","outcome_id","number");

CREATE TABLE "vs_assessments_moderation" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "cycle_id" uuid NOT NULL, "plan_item_id" uuid NOT NULL, "evidence_version" integer NOT NULL,
  "evidence_digest" char(64) NOT NULL, "status" varchar(16) NOT NULL, "version" integer NOT NULL,
  "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_moderation_values_check" CHECK ("evidence_version">0 AND "evidence_digest" ~ '^[0-9a-f]{64}$' AND "status" IN ('PENDING','APPROVED','RETURNED','REJECTED') AND "version">0)
);
CREATE UNIQUE INDEX "vs_assessments_moderation_scope_id_key" ON "vs_assessments_moderation"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_moderation_plan_key" ON "vs_assessments_moderation"("organization_id","school_id","cycle_id","plan_item_id");
CREATE INDEX "vs_assessments_moderation_cycle_status_idx" ON "vs_assessments_moderation"("organization_id","school_id","cycle_id","status");

CREATE TABLE "vs_assessments_report_revision" (
  "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
  "cycle_id" uuid NOT NULL, "cohort_member_id" uuid NOT NULL, "number" integer NOT NULL,
  "source_cycle_version" integer NOT NULL, "source_digest" char(64) NOT NULL, "status" varchar(16) NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_report_values_check" CHECK ("number">0 AND "source_cycle_version">0 AND "source_digest" ~ '^[0-9a-f]{64}$' AND "status" IN ('WITHHELD','APPROVED','PUBLISHED','WITHDRAWN'))
);
CREATE UNIQUE INDEX "vs_assessments_report_scope_id_key" ON "vs_assessments_report_revision"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_report_number_key" ON "vs_assessments_report_revision"("organization_id","school_id","cycle_id","cohort_member_id","number");
CREATE INDEX "vs_assessments_report_cycle_status_idx" ON "vs_assessments_report_revision"("organization_id","school_id","cycle_id","status");

ALTER TABLE "vs_assessments_oversight_grant" ADD CONSTRAINT "vs_assessments_oversight_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_oversight_grant" ADD CONSTRAINT "vs_assessments_oversight_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_scale" ADD CONSTRAINT "vs_assessments_scale_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cycle" ADD CONSTRAINT "vs_assessments_cycle_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cycle" ADD CONSTRAINT "vs_assessments_cycle_year_fkey" FOREIGN KEY ("organization_id","school_id","academic_year_id") REFERENCES "vs_academics_academic_year"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cycle" ADD CONSTRAINT "vs_assessments_cycle_section_fkey" FOREIGN KEY ("organization_id","school_id","section_id") REFERENCES "vs_academics_section"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cycle" ADD CONSTRAINT "vs_assessments_cycle_scale_fkey" FOREIGN KEY ("organization_id","school_id","scale_id") REFERENCES "vs_assessments_scale"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_plan_item" ADD CONSTRAINT "vs_assessments_plan_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_plan_item" ADD CONSTRAINT "vs_assessments_plan_subject_fkey" FOREIGN KEY ("organization_id","school_id","subject_id") REFERENCES "vs_academics_subject"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_students_section_placement" ADD CONSTRAINT "vs_students_placement_scope_year_id_key" UNIQUE ("organization_id","school_id","id","year_id");
ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_enrollment_fkey" FOREIGN KEY ("organization_id","school_id","enrollment_id","year_id") REFERENCES "vs_students_enrollment"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_placement_fkey" FOREIGN KEY ("organization_id","school_id","placement_id","year_id") REFERENCES "vs_students_section_placement"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_outcome" ADD CONSTRAINT "vs_assessments_outcome_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_outcome" ADD CONSTRAINT "vs_assessments_outcome_plan_fkey" FOREIGN KEY ("organization_id","school_id","plan_item_id") REFERENCES "vs_assessments_plan_item"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_outcome" ADD CONSTRAINT "vs_assessments_outcome_cohort_fkey" FOREIGN KEY ("organization_id","school_id","cohort_member_id") REFERENCES "vs_assessments_cohort_member"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_outcome_revision" ADD CONSTRAINT "vs_assessments_outcome_revision_root_fkey" FOREIGN KEY ("organization_id","school_id","outcome_id") REFERENCES "vs_assessments_outcome"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_plan_fkey" FOREIGN KEY ("organization_id","school_id","plan_item_id") REFERENCES "vs_assessments_plan_item"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_revision" ADD CONSTRAINT "vs_assessments_report_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_report_revision" ADD CONSTRAINT "vs_assessments_report_cohort_fkey" FOREIGN KEY ("organization_id","school_id","cohort_member_id") REFERENCES "vs_assessments_cohort_member"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE FUNCTION public.vs_assessments_immutable_row() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'assessments immutable row'; END $$;
CREATE TRIGGER "vs_assessments_outcome_revision_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_outcome_revision" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();
CREATE TRIGGER "vs_assessments_report_revision_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_revision" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();

COMMENT ON TABLE "vs_assessments_oversight_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_scale" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_cycle" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_plan_item" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_cohort_member" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_outcome" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_outcome_revision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_moderation" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_revision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
