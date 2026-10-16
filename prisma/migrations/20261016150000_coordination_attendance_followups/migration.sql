CREATE TABLE "vs_coordination_capability_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "capability" VARCHAR(40) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_coordination_capability_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_capability_grant_capability_check" CHECK ("capability" IN ('coordination.create','coordination.assign','coordination.work','coordination.verify','coordination.manage')),
  CONSTRAINT "vs_coordination_capability_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_coordination_capability_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership" ("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_coordination_capability_grant_scope_key" ON "vs_coordination_capability_grant" ("organization_id","school_id","account_id","capability");
CREATE INDEX "vs_coordination_capability_grant_active_idx" ON "vs_coordination_capability_grant" ("organization_id","school_id","account_id","revoked_at");

CREATE TABLE "vs_coordination_request" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "kind" VARCHAR(40) NOT NULL,
  "source_type" VARCHAR(40) NOT NULL,
  "source_id" UUID NOT NULL,
  "source_version" INTEGER NOT NULL,
  "concern" VARCHAR(40) NOT NULL,
  "status" VARCHAR(30) NOT NULL,
  "creator_account_id" UUID NOT NULL,
  "assignee_account_id" UUID,
  "due_at" TIMESTAMPTZ(3),
  "note" VARCHAR(1000),
  "resolution_proposer_account_id" UUID,
  "resolution_kind" VARCHAR(40),
  "resolution_revision" INTEGER,
  "resolution_reason" VARCHAR(1000),
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "resolved_at" TIMESTAMPTZ(3),
  "withdrawn_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_coordination_request_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_request_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_source_fkey" FOREIGN KEY ("organization_id","school_id","source_id") REFERENCES "vs_attendance_session" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_creator_fkey" FOREIGN KEY ("creator_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_assignee_fkey" FOREIGN KEY ("assignee_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_proposer_fkey" FOREIGN KEY ("resolution_proposer_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_kind_check" CHECK ("kind" IN ('MISSING_REGISTER','SESSION_SETUP_REVIEW')),
  CONSTRAINT "vs_coordination_request_source_type_check" CHECK ("source_type" = 'ATTENDANCE_SESSION'),
  CONSTRAINT "vs_coordination_request_concern_check" CHECK ("concern" IN ('MISSING_REGISTER','WRONG_TIME','WRONG_OFFERING','DUPLICATE','OTHER')),
  CONSTRAINT "vs_coordination_request_status_check" CHECK ("status" IN ('OPEN','IN_PROGRESS','AWAITING_VERIFICATION','RESOLVED','WITHDRAWN')),
  CONSTRAINT "vs_coordination_request_evidence_check" CHECK ("resolution_kind" IS NULL OR "resolution_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','NO_CHANGE_NEEDED')),
  CONSTRAINT "vs_coordination_request_version_check" CHECK ("version" > 0 AND "source_version" > 0 AND ("resolution_revision" IS NULL OR "resolution_revision" > 0)),
  CONSTRAINT "vs_coordination_request_text_check" CHECK (("note" IS NULL OR (char_length("note") BETWEEN 1 AND 1000)) AND ("resolution_reason" IS NULL OR (char_length("resolution_reason") BETWEEN 1 AND 1000))),
  CONSTRAINT "vs_coordination_request_resolution_pair_check" CHECK (("status" NOT IN ('AWAITING_VERIFICATION','RESOLVED')) OR ("resolution_proposer_account_id" IS NOT NULL AND "resolution_kind" IS NOT NULL AND "resolution_reason" IS NOT NULL)),
  CONSTRAINT "vs_coordination_request_terminal_time_check" CHECK (("status" = 'RESOLVED') = ("resolved_at" IS NOT NULL) AND ("status" = 'WITHDRAWN') = ("withdrawn_at" IS NOT NULL))
);
CREATE UNIQUE INDEX "vs_coordination_request_scope_id_key" ON "vs_coordination_request" ("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_coordination_request_active_source_key" ON "vs_coordination_request" ("organization_id","school_id","source_type","source_id","kind") WHERE "status" NOT IN ('RESOLVED','WITHDRAWN');
CREATE INDEX "vs_coordination_request_queue_idx" ON "vs_coordination_request" ("organization_id","school_id","status","updated_at" DESC,"id" DESC);
CREATE INDEX "vs_coordination_request_assignee_idx" ON "vs_coordination_request" ("organization_id","school_id","assignee_account_id","status","updated_at" DESC,"id" DESC);

CREATE TABLE "vs_coordination_request_event" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "request_id" UUID NOT NULL,
  "number" INTEGER NOT NULL,
  "event_type" VARCHAR(40) NOT NULL,
  "from_status" VARCHAR(30),
  "to_status" VARCHAR(30),
  "actor_account_id" UUID NOT NULL,
  "previous_assignee_account_id" UUID,
  "assignee_account_id" UUID,
  "reason" VARCHAR(1000),
  "evidence_kind" VARCHAR(40),
  "evidence_revision" INTEGER,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_coordination_request_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_request_event_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_request_event_number_check" CHECK ("number" > 0),
  CONSTRAINT "vs_coordination_request_event_reason_check" CHECK ("reason" IS NULL OR char_length("reason") BETWEEN 1 AND 1000),
  CONSTRAINT "vs_coordination_request_event_evidence_check" CHECK ("evidence_kind" IS NULL OR "evidence_kind" IN ('ATTENDANCE_CORRECTION','ATTENDANCE_CANCELLATION','NO_CHANGE_NEEDED'))
);
CREATE UNIQUE INDEX "vs_coordination_request_event_number_key" ON "vs_coordination_request_event" ("organization_id","school_id","request_id","number");
CREATE INDEX "vs_coordination_request_event_list_idx" ON "vs_coordination_request_event" ("organization_id","school_id","request_id","occurred_at","id");

CREATE TABLE "vs_coordination_command_receipt" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "command" VARCHAR(50) NOT NULL,
  "idempotency_key" VARCHAR(100) NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "request_id" UUID NOT NULL,
  "result" JSONB NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_coordination_command_receipt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_command_receipt_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_command_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_coordination_command_receipt_intent_key" ON "vs_coordination_command_receipt" ("organization_id","school_id","actor_account_id","command","idempotency_key");
CREATE INDEX "vs_coordination_command_receipt_request_idx" ON "vs_coordination_command_receipt" ("organization_id","school_id","request_id","occurred_at");

CREATE FUNCTION vs_coordination_request_event_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'coordination request events are immutable'; END $$;
CREATE TRIGGER vs_coordination_request_event_immutable_trigger BEFORE UPDATE OR DELETE ON "vs_coordination_request_event" FOR EACH ROW EXECUTE FUNCTION vs_coordination_request_event_immutable();

COMMENT ON TABLE "vs_coordination_capability_grant" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Operator-designated request capability.';
COMMENT ON TABLE "vs_coordination_request" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Synthetic-only operational follow-up aggregate pending retention policy.';
COMMENT ON TABLE "vs_coordination_request_event" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Immutable authorized lifecycle history.';
COMMENT ON TABLE "vs_coordination_command_receipt" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Exact-key command recovery metadata.';
