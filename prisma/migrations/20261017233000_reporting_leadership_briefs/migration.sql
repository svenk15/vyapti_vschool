CREATE TABLE "vs_reporting_brief_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "capability" VARCHAR(20) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_reporting_brief_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_grant_capability_check" CHECK ("capability" IN ('GENERATE','SHARE')),
  CONSTRAINT "vs_reporting_brief_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_reporting_brief_grant_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_grant_scope_capability_key" ON "vs_reporting_brief_grant" ("organization_id","account_id","capability");
CREATE INDEX "vs_reporting_brief_grant_active_idx" ON "vs_reporting_brief_grant" ("organization_id","account_id","capability","revoked_at");

CREATE TABLE "vs_reporting_brief" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "anchor_school_id" UUID NOT NULL,
  "created_by_account_id" UUID NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "current_revision_number" INTEGER NOT NULL,
  "version" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "finalized_at" TIMESTAMPTZ(3),
  "shared_at" TIMESTAMPTZ(3),
  "withdrawn_at" TIMESTAMPTZ(3),
  "withdrawn_by_account_id" UUID,
  "withdrawal_reason" VARCHAR(500),
  CONSTRAINT "vs_reporting_brief_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_state_check" CHECK ("state" IN ('DRAFT','FINALIZED','WITHDRAWN')),
  CONSTRAINT "vs_reporting_brief_version_check" CHECK ("version" > 0 AND "current_revision_number" > 0),
  CONSTRAINT "vs_reporting_brief_state_times_check" CHECK (("state"='DRAFT' AND "finalized_at" IS NULL AND "shared_at" IS NULL AND "withdrawn_at" IS NULL AND "withdrawn_by_account_id" IS NULL AND "withdrawal_reason" IS NULL) OR ("state"='FINALIZED' AND "finalized_at" IS NOT NULL AND "withdrawn_at" IS NULL AND "withdrawn_by_account_id" IS NULL AND "withdrawal_reason" IS NULL) OR ("state"='WITHDRAWN' AND "finalized_at" IS NOT NULL AND "withdrawn_at" IS NOT NULL AND "withdrawn_by_account_id" IS NOT NULL AND "withdrawal_reason" IS NOT NULL)),
  CONSTRAINT "vs_reporting_brief_school_fkey" FOREIGN KEY ("organization_id","anchor_school_id") REFERENCES "vs_access_school" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_withdrawer_fkey" FOREIGN KEY ("withdrawn_by_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_scope_id_key" ON "vs_reporting_brief" ("organization_id","id");
CREATE INDEX "vs_reporting_brief_author_idx" ON "vs_reporting_brief" ("organization_id","created_by_account_id","created_at" DESC,"id" DESC);
CREATE INDEX "vs_reporting_brief_list_idx" ON "vs_reporting_brief" ("organization_id","state","created_at" DESC,"id" DESC);

CREATE TABLE "vs_reporting_brief_revision" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "brief_id" UUID NOT NULL,
  "number" INTEGER NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "purpose" VARCHAR(200) NOT NULL,
  "interpretation" VARCHAR(4000) NOT NULL,
  "next_actions" VARCHAR(2000),
  "created_by_account_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "finalized_at" TIMESTAMPTZ(3),
  "input_hash" CHAR(64) NOT NULL,
  CONSTRAINT "vs_reporting_brief_revision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_revision_state_check" CHECK ("state" IN ('DRAFT','FINALIZED')),
  CONSTRAINT "vs_reporting_brief_revision_content_check" CHECK ("number" > 0 AND length(btrim("title")) BETWEEN 1 AND 160 AND length(btrim("purpose")) BETWEEN 1 AND 200 AND length(btrim("interpretation")) BETWEEN 1 AND 4000 AND ("next_actions" IS NULL OR length(btrim("next_actions")) BETWEEN 1 AND 2000) AND "input_hash" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_reporting_brief_revision_state_time_check" CHECK (("state"='DRAFT' AND "finalized_at" IS NULL) OR ("state"='FINALIZED' AND "finalized_at" IS NOT NULL)),
  CONSTRAINT "vs_reporting_brief_revision_brief_fkey" FOREIGN KEY ("organization_id","brief_id") REFERENCES "vs_reporting_brief" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_revision_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_revision_number_key" ON "vs_reporting_brief_revision" ("organization_id","brief_id","number");
CREATE UNIQUE INDEX "vs_reporting_brief_revision_scope_id_key" ON "vs_reporting_brief_revision" ("organization_id","brief_id","id");
CREATE INDEX "vs_reporting_brief_revision_lookup_idx" ON "vs_reporting_brief_revision" ("organization_id","brief_id","number" DESC);

CREATE TABLE "vs_reporting_brief_section" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "brief_id" UUID NOT NULL,
  "revision_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "school_id" UUID NOT NULL,
  "snapshot_id" UUID NOT NULL,
  "metric" VARCHAR(80) NOT NULL,
  CONSTRAINT "vs_reporting_brief_section_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_section_position_check" CHECK ("position" BETWEEN 1 AND 20),
  CONSTRAINT "vs_reporting_brief_section_metric_check" CHECK ("metric"='attendance-register-coverage.v1'),
  CONSTRAINT "vs_reporting_brief_section_revision_fkey" FOREIGN KEY ("organization_id","brief_id","revision_id") REFERENCES "vs_reporting_brief_revision" ("organization_id","brief_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_section_brief_fkey" FOREIGN KEY ("organization_id","brief_id") REFERENCES "vs_reporting_brief" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_section_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_section_snapshot_fkey" FOREIGN KEY ("organization_id","school_id","snapshot_id") REFERENCES "vs_reporting_snapshot" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_section_position_key" ON "vs_reporting_brief_section" ("revision_id","position");
CREATE UNIQUE INDEX "vs_reporting_brief_section_snapshot_key" ON "vs_reporting_brief_section" ("revision_id","snapshot_id");
CREATE INDEX "vs_reporting_brief_section_revision_idx" ON "vs_reporting_brief_section" ("organization_id","brief_id","revision_id");

CREATE TABLE "vs_reporting_brief_recipient" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "brief_id" UUID NOT NULL,
  "revision_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "account_id" UUID NOT NULL,
  "shared_at" TIMESTAMPTZ(3),
  "first_read_at" TIMESTAMPTZ(3),
  CONSTRAINT "vs_reporting_brief_recipient_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_recipient_position_check" CHECK ("position" BETWEEN 1 AND 20),
  CONSTRAINT "vs_reporting_brief_recipient_read_check" CHECK ("first_read_at" IS NULL OR "shared_at" IS NOT NULL),
  CONSTRAINT "vs_reporting_brief_recipient_revision_fkey" FOREIGN KEY ("organization_id","brief_id","revision_id") REFERENCES "vs_reporting_brief_revision" ("organization_id","brief_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_recipient_brief_fkey" FOREIGN KEY ("organization_id","brief_id") REFERENCES "vs_reporting_brief" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_recipient_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_recipient_position_key" ON "vs_reporting_brief_recipient" ("revision_id","position");
CREATE UNIQUE INDEX "vs_reporting_brief_recipient_account_key" ON "vs_reporting_brief_recipient" ("revision_id","account_id");
CREATE INDEX "vs_reporting_brief_recipient_inbox_idx" ON "vs_reporting_brief_recipient" ("organization_id","account_id","shared_at","brief_id");

CREATE TABLE "vs_reporting_brief_receipt" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "command" VARCHAR(32) NOT NULL,
  "idempotency_key" VARCHAR(100) NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "brief_id" UUID NOT NULL,
  "revision_number" INTEGER NOT NULL,
  "result" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_reporting_brief_receipt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_brief_receipt_command_check" CHECK ("command" IN ('CREATE','REVISE','FINALIZE','SHARE','WITHDRAW')),
  CONSTRAINT "vs_reporting_brief_receipt_content_check" CHECK ("revision_number" > 0 AND "input_hash" ~ '^[0-9a-f]{64}$' AND jsonb_typeof("result")='object'),
  CONSTRAINT "vs_reporting_brief_receipt_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_brief_receipt_brief_fkey" FOREIGN KEY ("organization_id","brief_id") REFERENCES "vs_reporting_brief" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_reporting_brief_receipt_intent_key" ON "vs_reporting_brief_receipt" ("organization_id","actor_account_id","command","idempotency_key");
CREATE INDEX "vs_reporting_brief_receipt_brief_idx" ON "vs_reporting_brief_receipt" ("organization_id","brief_id","created_at","id");

CREATE FUNCTION vs_reporting_brief_revision_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF TG_OP='DELETE' OR NEW.organization_id<>OLD.organization_id OR NEW.brief_id<>OLD.brief_id OR NEW.number<>OLD.number OR NEW.title<>OLD.title OR NEW.purpose<>OLD.purpose OR NEW.interpretation<>OLD.interpretation OR NEW.next_actions IS DISTINCT FROM OLD.next_actions OR NEW.created_by_account_id<>OLD.created_by_account_id OR NEW.created_at<>OLD.created_at OR NEW.input_hash<>OLD.input_hash OR OLD.state='FINALIZED' THEN RAISE EXCEPTION 'reporting brief revision is immutable'; END IF; RETURN NEW; END $$;
CREATE TRIGGER vs_reporting_brief_revision_guard_trigger BEFORE UPDATE OR DELETE ON "vs_reporting_brief_revision" FOR EACH ROW EXECUTE FUNCTION vs_reporting_brief_revision_guard();
CREATE FUNCTION vs_reporting_brief_section_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'reporting brief section is immutable'; END $$;
CREATE TRIGGER vs_reporting_brief_section_guard_trigger BEFORE UPDATE OR DELETE ON "vs_reporting_brief_section" FOR EACH ROW EXECUTE FUNCTION vs_reporting_brief_section_guard();
CREATE FUNCTION vs_reporting_brief_recipient_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF TG_OP='DELETE' OR NEW.organization_id<>OLD.organization_id OR NEW.brief_id<>OLD.brief_id OR NEW.revision_id<>OLD.revision_id OR NEW.position<>OLD.position OR NEW.account_id<>OLD.account_id OR (OLD.shared_at IS NOT NULL AND NEW.shared_at IS DISTINCT FROM OLD.shared_at) OR (OLD.first_read_at IS NOT NULL AND NEW.first_read_at IS DISTINCT FROM OLD.first_read_at) THEN RAISE EXCEPTION 'reporting brief recipient content is immutable'; END IF; RETURN NEW; END $$;
CREATE TRIGGER vs_reporting_brief_recipient_guard_trigger BEFORE UPDATE OR DELETE ON "vs_reporting_brief_recipient" FOR EACH ROW EXECUTE FUNCTION vs_reporting_brief_recipient_guard();
CREATE FUNCTION vs_reporting_brief_receipt_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'reporting brief receipt is immutable'; END $$;
CREATE TRIGGER vs_reporting_brief_receipt_guard_trigger BEFORE UPDATE OR DELETE ON "vs_reporting_brief_receipt" FOR EACH ROW EXECUTE FUNCTION vs_reporting_brief_receipt_guard();

COMMENT ON TABLE "vs_reporting_brief_grant" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; closureGate TEN-03; application authorization remains required. Separate synthetic brief generation/share authority.';
COMMENT ON TABLE "vs_reporting_brief" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; closureGate TEN-03; application authorization remains required. Snapshot-backed leadership brief root.';
COMMENT ON TABLE "vs_reporting_brief_revision" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; closureGate TEN-03; application authorization remains required. Immutable reviewed brief revision.';
COMMENT ON TABLE "vs_reporting_brief_section" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; closureGate TEN-03; application authorization remains required. Allowlisted immutable snapshot pointer.';
COMMENT ON TABLE "vs_reporting_brief_recipient" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; closureGate TEN-03; application authorization remains required. Explicit portal recipient and delivery/read facts.';
COMMENT ON TABLE "vs_reporting_brief_receipt" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; closureGate TEN-03; application authorization remains required. Exact brief command recovery metadata.';
