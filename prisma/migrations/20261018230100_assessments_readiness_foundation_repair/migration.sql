-- Compatibility repair for local PostgreSQL where the preceding migration's
-- DDL before its rejected Subject FK was retained. Every operation is
-- idempotent so a fresh database that applied the corrected predecessor is unchanged.
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='vs_assessments_cohort_member' AND column_name='year_id') THEN
  ALTER TABLE "vs_assessments_cohort_member" ADD COLUMN "year_id" uuid;
  UPDATE "vs_assessments_cohort_member" c SET "year_id"=e."year_id" FROM "vs_students_enrollment" e WHERE e."id"=c."enrollment_id";
  ALTER TABLE "vs_assessments_cohort_member" ALTER COLUMN "year_id" SET NOT NULL;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_students_placement_scope_year_id_key') THEN
  ALTER TABLE "vs_students_section_placement" ADD CONSTRAINT "vs_students_placement_scope_year_id_key" UNIQUE ("organization_id","school_id","id","year_id");
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_plan_subject_fkey') THEN
  ALTER TABLE "vs_assessments_plan_item" ADD CONSTRAINT "vs_assessments_plan_subject_fkey" FOREIGN KEY ("organization_id","school_id","subject_id") REFERENCES "vs_academics_subject"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_cohort_cycle_fkey') THEN
  ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_cohort_student_fkey') THEN
  ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_cohort_enrollment_fkey') THEN
  ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_enrollment_fkey" FOREIGN KEY ("organization_id","school_id","enrollment_id","year_id") REFERENCES "vs_students_enrollment"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_cohort_placement_fkey') THEN
  ALTER TABLE "vs_assessments_cohort_member" ADD CONSTRAINT "vs_assessments_cohort_placement_fkey" FOREIGN KEY ("organization_id","school_id","placement_id","year_id") REFERENCES "vs_students_section_placement"("organization_id","school_id","id","year_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_outcome_cycle_fkey') THEN
  ALTER TABLE "vs_assessments_outcome" ADD CONSTRAINT "vs_assessments_outcome_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_outcome_plan_fkey') THEN
  ALTER TABLE "vs_assessments_outcome" ADD CONSTRAINT "vs_assessments_outcome_plan_fkey" FOREIGN KEY ("organization_id","school_id","plan_item_id") REFERENCES "vs_assessments_plan_item"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_outcome_cohort_fkey') THEN
  ALTER TABLE "vs_assessments_outcome" ADD CONSTRAINT "vs_assessments_outcome_cohort_fkey" FOREIGN KEY ("organization_id","school_id","cohort_member_id") REFERENCES "vs_assessments_cohort_member"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_outcome_revision_root_fkey') THEN
  ALTER TABLE "vs_assessments_outcome_revision" ADD CONSTRAINT "vs_assessments_outcome_revision_root_fkey" FOREIGN KEY ("organization_id","school_id","outcome_id") REFERENCES "vs_assessments_outcome"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_moderation_cycle_fkey') THEN
  ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_moderation_plan_fkey') THEN
  ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_plan_fkey" FOREIGN KEY ("organization_id","school_id","plan_item_id") REFERENCES "vs_assessments_plan_item"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_report_cycle_fkey') THEN
  ALTER TABLE "vs_assessments_report_revision" ADD CONSTRAINT "vs_assessments_report_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_assessments_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='vs_assessments_report_cohort_fkey') THEN
  ALTER TABLE "vs_assessments_report_revision" ADD CONSTRAINT "vs_assessments_report_cohort_fkey" FOREIGN KEY ("organization_id","school_id","cohort_member_id") REFERENCES "vs_assessments_cohort_member"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
 END IF;
END $$;

CREATE OR REPLACE FUNCTION public.vs_assessments_immutable_row() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'assessments immutable row'; END $$;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='vs_assessments_outcome_revision_immutable') THEN CREATE TRIGGER "vs_assessments_outcome_revision_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_outcome_revision" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row(); END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='vs_assessments_report_revision_immutable') THEN CREATE TRIGGER "vs_assessments_report_revision_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_report_revision" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row(); END IF;
END $$;

COMMENT ON TABLE "vs_assessments_oversight_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_scale" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_cycle" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_plan_item" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_cohort_member" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_outcome" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_outcome_revision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_moderation" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_report_revision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
