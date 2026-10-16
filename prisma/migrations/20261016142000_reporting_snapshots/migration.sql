CREATE TABLE "vs_reporting_snapshot_manager_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_reporting_snapshot_manager_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_snapshot_manager_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_reporting_snapshot_manager_grant_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id", "account_id") REFERENCES "vs_access_school_membership" ("organization_id", "school_id", "id", "account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_reporting_snapshot_manager_grant_scope_account_key" ON "vs_reporting_snapshot_manager_grant" ("organization_id", "school_id", "account_id");
CREATE INDEX "vs_reporting_snapshot_manager_grant_active_idx" ON "vs_reporting_snapshot_manager_grant" ("organization_id", "school_id", "account_id", "revoked_at");

CREATE TABLE "vs_reporting_snapshot" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "report_type" VARCHAR(80) NOT NULL,
  "definition_version" VARCHAR(80) NOT NULL,
  "query" JSONB NOT NULL,
  "school_date" DATE NOT NULL,
  "source_as_of" TIMESTAMPTZ(3) NOT NULL,
  "captured_at" TIMESTAMPTZ(3) NOT NULL,
  "payload" JSONB,
  "payload_hash" CHAR(64),
  "row_count" INTEGER NOT NULL,
  "idempotency_key" VARCHAR(100) NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "version" INTEGER NOT NULL,
  "removed_at" TIMESTAMPTZ(3),
  "removed_by_account_id" UUID,
  "removal_key" VARCHAR(100),
  "removal_input_hash" CHAR(64),
  CONSTRAINT "vs_reporting_snapshot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_snapshot_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_reporting_snapshot_row_count_check" CHECK ("row_count" > 0 AND "row_count" <= 51),
  CONSTRAINT "vs_reporting_snapshot_payload_state_check" CHECK (("removed_at" IS NULL AND "payload" IS NOT NULL AND "payload_hash" IS NOT NULL AND "removed_by_account_id" IS NULL AND "removal_key" IS NULL AND "removal_input_hash" IS NULL) OR ("removed_at" IS NOT NULL AND "payload" IS NULL AND "payload_hash" IS NULL AND "removed_by_account_id" IS NOT NULL AND "removal_key" IS NOT NULL AND "removal_input_hash" IS NOT NULL)),
  CONSTRAINT "vs_reporting_snapshot_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school" ("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_snapshot_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_snapshot_removed_by_fkey" FOREIGN KEY ("removed_by_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_reporting_snapshot_scope_id_key" ON "vs_reporting_snapshot" ("organization_id", "school_id", "id");
CREATE UNIQUE INDEX "vs_reporting_snapshot_capture_intent_key" ON "vs_reporting_snapshot" ("organization_id", "school_id", "actor_account_id", "idempotency_key");
CREATE INDEX "vs_reporting_snapshot_list_idx" ON "vs_reporting_snapshot" ("organization_id", "school_id", "captured_at" DESC, "id" DESC);
CREATE INDEX "vs_reporting_snapshot_actor_idx" ON "vs_reporting_snapshot" ("actor_account_id");

COMMENT ON TABLE "vs_reporting_snapshot_manager_grant" IS 'TEN-ADR-006 Path A; BRANCH class; owner reporting; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Operator-designated Principal snapshot-management authority.';
COMMENT ON TABLE "vs_reporting_snapshot" IS 'TEN-ADR-006 Path A; BRANCH class; owner reporting; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Immutable bounded Principal aggregate snapshot with removable payload.';
