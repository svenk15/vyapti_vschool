-- F02 / D02 Path A: Access-owned temporary leadership delegations.
-- Runtime RLS enforcement remains the consolidated TEN-03 production gate.

CREATE TABLE "vs_access_leadership_delegation" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "employee_id" UUID NOT NULL,
  "starts_at" TIMESTAMPTZ(3) NOT NULL,
  "ends_at" TIMESTAMPTZ(3) NOT NULL,
  "reason" VARCHAR(500) NOT NULL,
  "issued_by_operator_id" UUID NOT NULL,
  "issued_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "revoked_by_operator_id" UUID,
  "revoke_reason" VARCHAR(500),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_access_leadership_delegation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_leadership_delegation_window_check" CHECK ("ends_at" > "starts_at" AND "ends_at" <= "starts_at" + INTERVAL '30 days'),
  CONSTRAINT "vs_access_leadership_delegation_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_access_leadership_delegation_revocation_check" CHECK (("revoked_at" IS NULL AND "revoked_by_operator_id" IS NULL AND "revoke_reason" IS NULL) OR ("revoked_at" IS NOT NULL AND "revoked_by_operator_id" IS NOT NULL AND "revoke_reason" IS NOT NULL)),
  CONSTRAINT "vs_access_leadership_delegation_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id", "account_id") REFERENCES "vs_access_school_membership"("organization_id", "school_id", "id", "account_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_access_leadership_delegation_employee_fkey" FOREIGN KEY ("organization_id", "school_id", "employee_id") REFERENCES "vs_people_employee"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_access_leadership_delegation_scope_id_key" ON "vs_access_leadership_delegation"("organization_id", "school_id", "id");
CREATE INDEX "vs_access_leadership_delegation_runtime_idx" ON "vs_access_leadership_delegation"("organization_id", "school_id", "account_id", "starts_at", "ends_at");
CREATE INDEX "vs_access_leadership_delegation_employee_idx" ON "vs_access_leadership_delegation"("organization_id", "school_id", "employee_id", "starts_at", "ends_at");

CREATE TABLE "vs_access_leadership_delegation_action" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "delegation_id" UUID NOT NULL,
  "action" VARCHAR(80) NOT NULL,
  CONSTRAINT "vs_access_leadership_delegation_action_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_leadership_delegation_action_allowlist_check" CHECK ("action" IN ('leadership.read','attendance.read_leadership','timetable.read_leadership','learning.read_leadership','communication.read_leadership')),
  CONSTRAINT "vs_access_leadership_delegation_action_delegation_fkey" FOREIGN KEY ("organization_id", "school_id", "delegation_id") REFERENCES "vs_access_leadership_delegation"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_access_leadership_delegation_action_key" ON "vs_access_leadership_delegation_action"("organization_id", "school_id", "delegation_id", "action");
CREATE INDEX "vs_access_leadership_delegation_action_lookup_idx" ON "vs_access_leadership_delegation_action"("organization_id", "school_id", "action", "delegation_id");

CREATE TABLE "vs_access_leadership_delegation_receipt" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "operator_id" UUID NOT NULL,
  "command" VARCHAR(80) NOT NULL,
  "key" UUID NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "response" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_access_leadership_delegation_receipt_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_leadership_delegation_receipt_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_access_leadership_delegation_receipt_key" ON "vs_access_leadership_delegation_receipt"("organization_id", "school_id", "operator_id", "command", "key");
CREATE INDEX "vs_access_leadership_delegation_receipt_scope_idx" ON "vs_access_leadership_delegation_receipt"("organization_id", "school_id", "created_at" DESC, "id");

CREATE TABLE "vs_access_leadership_delegation_event" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "delegation_id" UUID NOT NULL,
  "operator_id" UUID NOT NULL,
  "kind" VARCHAR(30) NOT NULL,
  "version" INTEGER NOT NULL,
  "reason" VARCHAR(500) NOT NULL,
  "safe_details" JSONB NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_access_leadership_delegation_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_access_leadership_delegation_event_kind_check" CHECK ("kind" IN ('ISSUED','REVOKED')),
  CONSTRAINT "vs_access_leadership_delegation_event_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_access_leadership_delegation_event_delegation_fkey" FOREIGN KEY ("organization_id", "school_id", "delegation_id") REFERENCES "vs_access_leadership_delegation"("organization_id", "school_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_access_leadership_delegation_event_version_key" ON "vs_access_leadership_delegation_event"("organization_id", "school_id", "delegation_id", "version");
CREATE INDEX "vs_access_leadership_delegation_event_sequence_idx" ON "vs_access_leadership_delegation_event"("organization_id", "school_id", "delegation_id", "occurred_at", "id");
