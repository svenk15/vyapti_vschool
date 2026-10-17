ALTER TABLE "vs_access_school"
  ADD COLUMN "support_label" VARCHAR(160),
  ADD COLUMN "support_email" VARCHAR(254),
  ADD COLUMN "support_phone" VARCHAR(40),
  ADD COLUMN "support_hours" VARCHAR(500),
  ADD COLUMN "support_published_at" TIMESTAMPTZ(3);

ALTER TABLE "vs_access_school"
  ADD CONSTRAINT "vs_access_school_support_complete_check" CHECK (
    ("support_label" IS NULL AND "support_email" IS NULL AND "support_phone" IS NULL AND "support_hours" IS NULL AND "support_published_at" IS NULL)
    OR
    (length(btrim("support_label")) BETWEEN 1 AND 160
      AND ("support_email" IS NOT NULL OR "support_phone" IS NOT NULL)
      AND ("support_email" IS NULL OR (length(btrim("support_email")) BETWEEN 3 AND 254 AND "support_email" = lower(btrim("support_email"))))
      AND ("support_phone" IS NULL OR length(btrim("support_phone")) BETWEEN 5 AND 40)
      AND length(btrim("support_hours")) BETWEEN 1 AND 500
      AND "support_published_at" IS NOT NULL)
  );

CREATE TABLE "vs_access_account_preference" (
  "id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "key" VARCHAR(40) NOT NULL,
  "value" VARCHAR(40) NOT NULL,
  "version" INTEGER NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_access_account_preference_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_account_preference_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_access_account_preference_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_access_account_preference_value_check" CHECK (
    ("key" = 'TABLE_DENSITY' AND "value" IN ('COMFORTABLE','COMPACT'))
    OR ("key" = 'REDUCED_MOTION' AND "value" IN ('SYSTEM','REDUCE'))
  )
);
CREATE UNIQUE INDEX "vs_access_account_preference_account_key_key" ON "vs_access_account_preference"("account_id","key");
CREATE INDEX "vs_access_account_preference_account_updated_idx" ON "vs_access_account_preference"("account_id","updated_at" DESC,"id");

CREATE TABLE "vs_access_account_preference_receipt" (
  "id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "command" VARCHAR(60) NOT NULL,
  "key" VARCHAR(100) NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "response" JSONB NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_access_account_preference_receipt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_account_preference_receipt_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_access_account_preference_receipt_command_check" CHECK ("command" = 'UpdateOwnPreferences'),
  CONSTRAINT "vs_access_account_preference_receipt_key_check" CHECK (length("key") BETWEEN 16 AND 100),
  CONSTRAINT "vs_access_account_preference_receipt_hash_check" CHECK ("input_hash" ~ '^[0-9a-f]{64}$')
);
CREATE UNIQUE INDEX "vs_access_account_preference_receipt_account_command_key_key" ON "vs_access_account_preference_receipt"("account_id","command","key");
CREATE INDEX "vs_access_account_preference_receipt_account_occurred_idx" ON "vs_access_account_preference_receipt"("account_id","occurred_at" DESC,"id");

COMMENT ON TABLE "vs_access_account_preference" IS 'TEN-ADR-006 Path A; GLOBAL_IDENTITY class; owner access; scope account_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application self-account authorization remains required.';
COMMENT ON TABLE "vs_access_account_preference_receipt" IS 'TEN-ADR-006 Path A; GLOBAL_IDENTITY class; owner access; scope account_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; protected replay is reauthorized before disclosure.';
