ALTER TABLE "vs_reporting_brief" ADD COLUMN "kind" VARCHAR(24);
UPDATE "vs_reporting_brief" SET "kind"='EVIDENCE_BRIEF' WHERE "kind" IS NULL;
ALTER TABLE "vs_reporting_brief" ALTER COLUMN "kind" SET NOT NULL;
ALTER TABLE "vs_reporting_brief" ADD CONSTRAINT "vs_reporting_brief_kind_check" CHECK ("kind" IN ('EVIDENCE_BRIEF','WEEKLY_REVIEW'));

ALTER TABLE "vs_reporting_brief_revision"
  ADD COLUMN "period_start" DATE,
  ADD COLUMN "period_end" DATE,
  ADD COLUMN "timezone" VARCHAR(64),
  ADD CONSTRAINT "vs_reporting_brief_revision_period_check" CHECK (
    ("period_start" IS NULL AND "period_end" IS NULL AND "timezone" IS NULL) OR
    ("period_start" IS NOT NULL AND "period_end" IS NOT NULL AND "period_start" <= "period_end" AND "period_end" - "period_start" BETWEEN 0 AND 30 AND length(btrim("timezone")) BETWEEN 1 AND 64)
  );

CREATE OR REPLACE FUNCTION vs_reporting_brief_revision_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF TG_OP='DELETE' OR NEW.organization_id<>OLD.organization_id OR NEW.brief_id<>OLD.brief_id OR NEW.number<>OLD.number OR NEW.title<>OLD.title OR NEW.purpose<>OLD.purpose OR NEW.interpretation<>OLD.interpretation OR NEW.next_actions IS DISTINCT FROM OLD.next_actions OR NEW.period_start IS DISTINCT FROM OLD.period_start OR NEW.period_end IS DISTINCT FROM OLD.period_end OR NEW.timezone IS DISTINCT FROM OLD.timezone OR NEW.created_by_account_id<>OLD.created_by_account_id OR NEW.created_at<>OLD.created_at OR NEW.input_hash<>OLD.input_hash OR OLD.state='FINALIZED' THEN RAISE EXCEPTION 'reporting brief revision is immutable'; END IF; RETURN NEW; END $$;

CREATE TABLE "vs_reporting_brief_action" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "brief_id" UUID NOT NULL,
  "revision_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "request_id" UUID NOT NULL,
  "request_version" INTEGER NOT NULL,
  CONSTRAINT "vs_reporting_brief_action_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_action_position_check" CHECK ("position" BETWEEN 1 AND 50),
  CONSTRAINT "vs_reporting_brief_action_version_check" CHECK ("request_version" > 0),
  CONSTRAINT "vs_reporting_brief_action_revision_fkey" FOREIGN KEY ("organization_id","brief_id","revision_id") REFERENCES "vs_reporting_brief_revision" ("organization_id","brief_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_action_brief_fkey" FOREIGN KEY ("organization_id","brief_id") REFERENCES "vs_reporting_brief" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_action_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_action_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_action_position_key" ON "vs_reporting_brief_action" ("revision_id","position");
CREATE UNIQUE INDEX "vs_reporting_brief_action_request_key" ON "vs_reporting_brief_action" ("revision_id","request_id");
CREATE INDEX "vs_reporting_brief_action_revision_idx" ON "vs_reporting_brief_action" ("organization_id","brief_id","revision_id");
CREATE INDEX "vs_reporting_brief_action_request_idx" ON "vs_reporting_brief_action" ("organization_id","school_id","request_id","revision_id");

CREATE FUNCTION vs_reporting_brief_action_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'reporting brief action reference is immutable'; END $$;
CREATE TRIGGER vs_reporting_brief_action_guard_trigger BEFORE UPDATE OR DELETE ON "vs_reporting_brief_action" FOR EACH ROW EXECUTE FUNCTION vs_reporting_brief_action_guard();

COMMENT ON TABLE "vs_reporting_brief_action" IS 'TEN-ADR-006 Path A; INSTITUTION class with anchor school scope; owner reporting; scope organization_id,school_id; closureGate TEN-03; application authorization remains required. Immutable reference to a Coordination-owned weekly-review action.';
