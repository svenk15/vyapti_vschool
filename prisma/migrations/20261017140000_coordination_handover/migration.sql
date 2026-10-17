CREATE TABLE "vs_coordination_handover" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "from_account_id" UUID NOT NULL,
  "to_account_id" UUID NOT NULL,
  "idempotency_key" VARCHAR(100) NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "payload" JSONB NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "item_count" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "completed_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_coordination_handover_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_handover_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_handover_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_handover_from_fkey" FOREIGN KEY ("from_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_handover_to_fkey" FOREIGN KEY ("to_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_handover_accounts_check" CHECK ("from_account_id" <> "to_account_id"),
  CONSTRAINT "vs_coordination_handover_state_check" CHECK ("state" IN ('PROCESSING','COMPLETED','PARTIAL')),
  CONSTRAINT "vs_coordination_handover_count_check" CHECK ("item_count" BETWEEN 1 AND 50),
  CONSTRAINT "vs_coordination_handover_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_coordination_handover_completion_check" CHECK (("state" = 'PROCESSING') = ("completed_at" IS NULL))
);
CREATE UNIQUE INDEX "vs_coordination_handover_scope_id_key" ON "vs_coordination_handover" ("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_coordination_handover_intent_key" ON "vs_coordination_handover" ("organization_id","school_id","actor_account_id","idempotency_key");
CREATE INDEX "vs_coordination_handover_state_idx" ON "vs_coordination_handover" ("organization_id","school_id","state","updated_at" DESC,"id" DESC);

CREATE TABLE "vs_coordination_handover_item" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "handover_id" UUID NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "request_id" UUID NOT NULL,
  "expected_version" INTEGER NOT NULL,
  "status" VARCHAR(24) NOT NULL,
  "result_version" INTEGER,
  "error_code" VARCHAR(40),
  "error_message" VARCHAR(240),
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "completed_at" TIMESTAMPTZ(3),
  CONSTRAINT "vs_coordination_handover_item_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_handover_item_handover_fkey" FOREIGN KEY ("organization_id","school_id","handover_id") REFERENCES "vs_coordination_handover" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_handover_item_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_handover_item_ordinal_check" CHECK ("ordinal" BETWEEN 1 AND 50),
  CONSTRAINT "vs_coordination_handover_item_expected_version_check" CHECK ("expected_version" > 0),
  CONSTRAINT "vs_coordination_handover_item_status_check" CHECK ("status" IN ('PENDING','TRANSFERRED','FAILED')),
  CONSTRAINT "vs_coordination_handover_item_result_check" CHECK (
    ("status" = 'PENDING' AND "result_version" IS NULL AND "error_code" IS NULL AND "error_message" IS NULL AND "completed_at" IS NULL)
    OR ("status" = 'TRANSFERRED' AND "result_version" IS NOT NULL AND "error_code" IS NULL AND "error_message" IS NULL AND "completed_at" IS NOT NULL)
    OR ("status" = 'FAILED' AND "result_version" IS NULL AND "error_code" IS NOT NULL AND "error_message" IS NOT NULL AND "completed_at" IS NOT NULL)
  )
);
CREATE UNIQUE INDEX "vs_coordination_handover_item_ordinal_key" ON "vs_coordination_handover_item" ("organization_id","school_id","handover_id","ordinal");
CREATE UNIQUE INDEX "vs_coordination_handover_item_request_key" ON "vs_coordination_handover_item" ("organization_id","school_id","handover_id","request_id");
CREATE INDEX "vs_coordination_handover_item_status_idx" ON "vs_coordination_handover_item" ("organization_id","school_id","handover_id","status","ordinal");

COMMENT ON TABLE "vs_coordination_handover" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Synthetic-only durable F04 handover intent.';
COMMENT ON TABLE "vs_coordination_handover_item" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Per-request transfer outcome with retained Coordination events.';
