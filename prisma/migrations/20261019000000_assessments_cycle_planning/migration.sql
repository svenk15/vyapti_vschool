CREATE TABLE "vs_assessments_planning_grant" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "granted_by_operator_id" uuid NOT NULL,
  "granted_at" timestamptz(3) NOT NULL,
  "revoked_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_assessments_planning_version_check" CHECK ("version" > 0)
);

CREATE UNIQUE INDEX "vs_assessments_planning_scope_id_key" ON "vs_assessments_planning_grant"("organization_id", "school_id", "id");
CREATE UNIQUE INDEX "vs_assessments_planning_account_key" ON "vs_assessments_planning_grant"("organization_id", "school_id", "account_id");
CREATE INDEX "vs_assessments_planning_active_idx" ON "vs_assessments_planning_grant"("organization_id", "school_id", "account_id", "revoked_at");

ALTER TABLE "vs_assessments_planning_grant" ADD CONSTRAINT "vs_assessments_planning_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id") REFERENCES "vs_access_school_membership"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_planning_grant" ADD CONSTRAINT "vs_assessments_planning_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE "vs_assessments_command_receipt" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "command" varchar(80) NOT NULL,
  "key" uuid NOT NULL,
  "input_hash" char(64) NOT NULL,
  "response" jsonb NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_assessments_receipt_hash_check" CHECK ("input_hash" ~ '^[0-9a-f]{64}$')
);

CREATE UNIQUE INDEX "vs_assessments_receipt_scope_id_key" ON "vs_assessments_command_receipt"("organization_id", "school_id", "id");
CREATE UNIQUE INDEX "vs_assessments_receipt_intent_key" ON "vs_assessments_command_receipt"("organization_id", "school_id", "actor_account_id", "command", "key");
CREATE INDEX "vs_assessments_receipt_actor_idx" ON "vs_assessments_command_receipt"("organization_id", "school_id", "actor_account_id", "created_at" DESC);

ALTER TABLE "vs_assessments_command_receipt" ADD CONSTRAINT "vs_assessments_receipt_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_command_receipt" ADD CONSTRAINT "vs_assessments_receipt_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

COMMENT ON TABLE "vs_assessments_planning_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_command_receipt" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
