CREATE TABLE "vs_assistant_capability_grant" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "capability" varchar(20) NOT NULL,
  "granted_by_operator_id" uuid NOT NULL,
  "granted_at" timestamptz(3) NOT NULL,
  "revoked_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_assistant_capability_grant_capability_check" CHECK ("capability" = 'GENERATE'),
  CONSTRAINT "vs_assistant_capability_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_assistant_capability_grant_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id", "account_id") REFERENCES "vs_access_school_membership" ("organization_id", "school_id", "id", "account_id") ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT "vs_assistant_capability_grant_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school" ("organization_id", "id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE UNIQUE INDEX "vs_assistant_capability_grant_scope_key" ON "vs_assistant_capability_grant" ("organization_id", "school_id", "account_id", "capability");
CREATE INDEX "vs_assistant_capability_grant_active_idx" ON "vs_assistant_capability_grant" ("organization_id", "school_id", "account_id", "capability", "revoked_at");

CREATE TABLE "vs_assistant_draft" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "created_by_account_id" uuid NOT NULL,
  "source_snapshot_id" uuid NOT NULL,
  "source_version" integer NOT NULL,
  "source_definition" varchar(80) NOT NULL,
  "source_as_of" timestamptz(3) NOT NULL,
  "question" varchar(500) NOT NULL,
  "generated_text" varchar(4000) NOT NULL,
  "reviewed_text" varchar(4000),
  "citations" jsonb NOT NULL,
  "evaluation" jsonb NOT NULL,
  "provider_code" varchar(40) NOT NULL,
  "state" varchar(20) NOT NULL,
  "version" integer NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  "updated_at" timestamptz(3) NOT NULL,
  "reviewed_at" timestamptz(3),
  "discarded_at" timestamptz(3),
  CONSTRAINT "vs_assistant_draft_state_check" CHECK ("state" IN ('GENERATED','HUMAN_REVIEWED','DISCARDED')),
  CONSTRAINT "vs_assistant_draft_version_check" CHECK ("source_version" > 0 AND "version" > 0),
  CONSTRAINT "vs_assistant_draft_question_check" CHECK (char_length(btrim("question")) BETWEEN 10 AND 500),
  CONSTRAINT "vs_assistant_draft_text_check" CHECK (char_length(btrim("generated_text")) BETWEEN 20 AND 4000 AND ("reviewed_text" IS NULL OR char_length(btrim("reviewed_text")) BETWEEN 20 AND 4000)),
  CONSTRAINT "vs_assistant_draft_terminal_check" CHECK (("state" = 'GENERATED' AND "reviewed_at" IS NULL AND "discarded_at" IS NULL) OR ("state" = 'HUMAN_REVIEWED' AND "reviewed_at" IS NOT NULL AND "discarded_at" IS NULL AND "reviewed_text" IS NOT NULL) OR ("state" = 'DISCARDED' AND "discarded_at" IS NOT NULL AND "reviewed_at" IS NULL)),
  CONSTRAINT "vs_assistant_draft_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school" ("organization_id", "id") ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT "vs_assistant_draft_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT "vs_assistant_draft_source_fkey" FOREIGN KEY ("organization_id", "school_id", "source_snapshot_id") REFERENCES "vs_reporting_snapshot" ("organization_id", "school_id", "id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE UNIQUE INDEX "vs_assistant_draft_scope_id_key" ON "vs_assistant_draft" ("organization_id", "school_id", "id");
CREATE INDEX "vs_assistant_draft_creator_idx" ON "vs_assistant_draft" ("organization_id", "school_id", "created_by_account_id", "updated_at" DESC, "id" DESC);
CREATE INDEX "vs_assistant_draft_source_idx" ON "vs_assistant_draft" ("organization_id", "school_id", "source_snapshot_id");

CREATE TABLE "vs_assistant_draft_event" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "draft_id" uuid NOT NULL,
  "number" integer NOT NULL,
  "type" varchar(20) NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "draft_version" integer NOT NULL,
  "evidence" jsonb NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assistant_draft_event_type_check" CHECK ("type" IN ('REQUESTED','GENERATED','HUMAN_REVIEWED','DISCARDED')),
  CONSTRAINT "vs_assistant_draft_event_number_check" CHECK ("number" > 0 AND "draft_version" > 0),
  CONSTRAINT "vs_assistant_draft_event_draft_fkey" FOREIGN KEY ("organization_id", "school_id", "draft_id") REFERENCES "vs_assistant_draft" ("organization_id", "school_id", "id") ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT "vs_assistant_draft_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE UNIQUE INDEX "vs_assistant_draft_event_number_key" ON "vs_assistant_draft_event" ("organization_id", "school_id", "draft_id", "number");
CREATE INDEX "vs_assistant_draft_event_history_idx" ON "vs_assistant_draft_event" ("organization_id", "school_id", "draft_id", "occurred_at", "id");

CREATE TABLE "vs_assistant_command_receipt" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "command" varchar(32) NOT NULL,
  "idempotency_key" uuid NOT NULL,
  "input_hash" char(64) NOT NULL,
  "draft_id" uuid NOT NULL,
  "result" jsonb NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assistant_command_receipt_command_check" CHECK ("command" IN ('GENERATE','REVIEW','DISCARD')),
  CONSTRAINT "vs_assistant_command_receipt_draft_fkey" FOREIGN KEY ("organization_id", "school_id", "draft_id") REFERENCES "vs_assistant_draft" ("organization_id", "school_id", "id") ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT "vs_assistant_command_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE UNIQUE INDEX "vs_assistant_command_receipt_intent_key" ON "vs_assistant_command_receipt" ("organization_id", "school_id", "actor_account_id", "idempotency_key");
CREATE INDEX "vs_assistant_command_receipt_draft_idx" ON "vs_assistant_command_receipt" ("organization_id", "school_id", "draft_id", "created_at");

CREATE FUNCTION "vs_assistant_block_history_mutation"() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'assistant history is append-only'; END $$;
CREATE TRIGGER "vs_assistant_draft_event_append_only" BEFORE UPDATE OR DELETE ON "vs_assistant_draft_event" FOR EACH ROW EXECUTE FUNCTION "vs_assistant_block_history_mutation"();
CREATE TRIGGER "vs_assistant_command_receipt_append_only" BEFORE UPDATE OR DELETE ON "vs_assistant_command_receipt" FOR EACH ROW EXECUTE FUNCTION "vs_assistant_block_history_mutation"();

COMMENT ON TABLE "vs_assistant_capability_grant" IS 'classification=BRANCH; owner=assistant; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assistant_draft" IS 'classification=BRANCH; owner=assistant; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assistant_draft_event" IS 'classification=BRANCH; owner=assistant; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assistant_command_receipt" IS 'classification=BRANCH; owner=assistant; scope=organization_id,school_id; closureGate=TEN-03';
