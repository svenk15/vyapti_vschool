CREATE TABLE "vs_coordination_batch" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "idempotency_key" VARCHAR(100) NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "payload" JSONB NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "item_count" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "completed_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_coordination_batch_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_batch_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school" ("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_batch_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_batch_state_check" CHECK ("state" IN ('PROCESSING','COMPLETED','PARTIAL')),
  CONSTRAINT "vs_coordination_batch_count_check" CHECK ("item_count" BETWEEN 1 AND 50),
  CONSTRAINT "vs_coordination_batch_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_coordination_batch_completion_check" CHECK (("state" = 'PROCESSING') = ("completed_at" IS NULL))
);
CREATE UNIQUE INDEX "vs_coordination_batch_scope_id_key" ON "vs_coordination_batch" ("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_coordination_batch_intent_key" ON "vs_coordination_batch" ("organization_id","school_id","actor_account_id","idempotency_key");
CREATE INDEX "vs_coordination_batch_state_idx" ON "vs_coordination_batch" ("organization_id","school_id","state","updated_at" DESC,"id" DESC);

CREATE TABLE "vs_coordination_batch_item" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "batch_id" UUID NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "source_id" UUID NOT NULL,
  "status" VARCHAR(24) NOT NULL,
  "request_id" UUID,
  "error_code" VARCHAR(40),
  "error_message" VARCHAR(240),
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "completed_at" TIMESTAMPTZ(3),
  CONSTRAINT "vs_coordination_batch_item_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_coordination_batch_item_batch_fkey" FOREIGN KEY ("organization_id","school_id","batch_id") REFERENCES "vs_coordination_batch" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_batch_item_request_fkey" FOREIGN KEY ("organization_id","school_id","request_id") REFERENCES "vs_coordination_request" ("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_coordination_batch_item_ordinal_check" CHECK ("ordinal" BETWEEN 1 AND 50),
  CONSTRAINT "vs_coordination_batch_item_status_check" CHECK ("status" IN ('PENDING','CREATED','ALREADY_EXISTS','FAILED')),
  CONSTRAINT "vs_coordination_batch_item_result_check" CHECK (
    ("status" = 'PENDING' AND "request_id" IS NULL AND "error_code" IS NULL AND "error_message" IS NULL AND "completed_at" IS NULL)
    OR ("status" IN ('CREATED','ALREADY_EXISTS') AND "request_id" IS NOT NULL AND "error_code" IS NULL AND "error_message" IS NULL AND "completed_at" IS NOT NULL)
    OR ("status" = 'FAILED' AND "request_id" IS NULL AND "error_code" IS NOT NULL AND "error_message" IS NOT NULL AND "completed_at" IS NOT NULL)
  )
);
CREATE UNIQUE INDEX "vs_coordination_batch_item_ordinal_key" ON "vs_coordination_batch_item" ("organization_id","school_id","batch_id","ordinal");
CREATE UNIQUE INDEX "vs_coordination_batch_item_source_key" ON "vs_coordination_batch_item" ("organization_id","school_id","batch_id","source_id");
CREATE INDEX "vs_coordination_batch_item_status_idx" ON "vs_coordination_batch_item" ("organization_id","school_id","batch_id","status","ordinal");

COMMENT ON TABLE "vs_coordination_batch" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Synthetic-only durable reviewed LEA-10 batch intent.';
COMMENT ON TABLE "vs_coordination_batch_item" IS 'TEN-ADR-006 Path A; BRANCH class; owner coordination; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Explicit source selection and safe per-item outcome.';
