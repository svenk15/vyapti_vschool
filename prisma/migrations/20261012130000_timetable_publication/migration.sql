ALTER TABLE "vs_academics_timetable_revision"
 ADD COLUMN "effective_until" date,
 ADD COLUMN "validated_until" date,
 ADD COLUMN "published_at" timestamptz(3),
 ADD COLUMN "published_by_account_id" uuid,
 ADD COLUMN "based_on_revision_id" uuid,
 ADD COLUMN "based_on_draft_version" integer,
 ADD COLUMN "source_command_id" uuid,
 ADD COLUMN "calendar_revision_id" uuid,
 ADD COLUMN "content_snapshot" jsonb;

ALTER TABLE "vs_academics_timetable_revision" DROP CONSTRAINT "vs_academics_timetable_revision_state_check";
ALTER TABLE "vs_academics_timetable_revision" ADD CONSTRAINT "vs_academics_timetable_revision_state_check" CHECK ("state" IN ('DRAFT','DISCARDED','PUBLISHED'));
ALTER TABLE "vs_academics_timetable_revision" ADD CONSTRAINT "vs_academics_timetable_revision_publication_check" CHECK (
 ("state"='PUBLISHED' AND "validated_until" IS NOT NULL AND "published_at" IS NOT NULL AND "published_by_account_id" IS NOT NULL AND "based_on_revision_id" IS NOT NULL AND "based_on_draft_version">0 AND "source_command_id" IS NOT NULL AND "calendar_revision_id" IS NOT NULL AND "content_snapshot" IS NOT NULL AND "validated_until">"effective_from" AND ("effective_until" IS NULL OR "effective_until">"effective_from"))
 OR ("state"<>'PUBLISHED' AND "effective_until" IS NULL AND "validated_until" IS NULL AND "published_at" IS NULL AND "published_by_account_id" IS NULL AND "based_on_revision_id" IS NULL AND "based_on_draft_version" IS NULL AND "source_command_id" IS NULL AND "calendar_revision_id" IS NULL AND "content_snapshot" IS NULL)
);
ALTER TABLE "vs_academics_timetable_revision" ADD CONSTRAINT "vs_academics_timetable_revision_publisher_fkey" FOREIGN KEY ("published_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_academics_timetable_revision" ADD CONSTRAINT "vs_academics_timetable_revision_source_fkey" FOREIGN KEY ("organization_id","school_id","based_on_revision_id") REFERENCES "vs_academics_timetable_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_academics_timetable_revision" ADD CONSTRAINT "vs_academics_timetable_revision_calendar_fkey" FOREIGN KEY ("organization_id","school_id","calendar_revision_id") REFERENCES "vs_academics_calendar_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_academics_timetable_revision" ADD CONSTRAINT "vs_academics_timetable_revision_number_key" UNIQUE ("organization_id","school_id","academic_year_id","revision_no");
CREATE UNIQUE INDEX "vs_academics_timetable_revision_open_published_key" ON "vs_academics_timetable_revision"("organization_id","school_id","academic_year_id") WHERE "state"='PUBLISHED' AND "effective_until" IS NULL;
CREATE INDEX "vs_academics_timetable_revision_effective_idx" ON "vs_academics_timetable_revision"("organization_id","school_id","academic_year_id","effective_from","effective_until");

CREATE OR REPLACE FUNCTION vs_academics_guard_published_revision() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='DELETE' AND OLD.state='PUBLISHED' THEN RAISE EXCEPTION 'published timetable revisions are immutable' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' AND OLD.state='PUBLISHED' THEN
  IF OLD.effective_until IS NOT NULL OR NEW.effective_until IS NULL OR (to_jsonb(NEW)-'effective_until') IS DISTINCT FROM (to_jsonb(OLD)-'effective_until') THEN
   RAISE EXCEPTION 'published timetable revisions are immutable' USING ERRCODE='23514';
  END IF;
 END IF;
 RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER vs_academics_timetable_revision_immutable BEFORE UPDATE OR DELETE ON "vs_academics_timetable_revision" FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_published_revision();

CREATE OR REPLACE FUNCTION vs_academics_guard_published_timetable_child() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE pattern uuid; revision uuid;
BEGIN
 IF TG_TABLE_NAME='vs_academics_timetable_slot' THEN revision:=OLD.revision_id;
 ELSIF TG_TABLE_NAME='vs_academics_day_period' THEN pattern:=OLD.day_pattern_id;
 ELSE pattern:=OLD.id;
 END IF;
 IF (revision IS NOT NULL AND EXISTS(SELECT 1 FROM "vs_academics_timetable_revision" r WHERE r.id=revision AND r.state='PUBLISHED'))
 OR (pattern IS NOT NULL AND EXISTS(SELECT 1 FROM "vs_academics_timetable_revision" r WHERE r.day_pattern_id=pattern AND r.state='PUBLISHED')) THEN
  RAISE EXCEPTION 'published timetable content is immutable' USING ERRCODE='23514';
 END IF;
 RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER vs_academics_timetable_slot_immutable BEFORE UPDATE OR DELETE ON "vs_academics_timetable_slot" FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_published_timetable_child();
CREATE TRIGGER vs_academics_day_period_published_immutable BEFORE UPDATE OR DELETE ON "vs_academics_day_period" FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_published_timetable_child();
CREATE TRIGGER vs_academics_day_pattern_published_immutable BEFORE UPDATE OR DELETE ON "vs_academics_day_pattern" FOR EACH ROW EXECUTE FUNCTION vs_academics_guard_published_timetable_child();

COMMENT ON TABLE "vs_academics_timetable_revision" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; immutable publication; closureGate=TEN-03';
