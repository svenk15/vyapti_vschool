-- F07-A / D09 Path A: People-owned operational availability.
-- TEN-ADR-006 classification=BRANCH owner=people scope=organization_id,school_id closureGate=TEN-03.

CREATE TABLE "vs_people_availability_recorder_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "designated_by_operator_id" UUID NOT NULL,
  "designated_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_people_availability_recorder_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_people_availability_recorder_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_people_availability_recorder_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_people_availability_recorder_grant_scope_id_key" ON "vs_people_availability_recorder_grant"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_people_availability_recorder_grant_scope_account_key" ON "vs_people_availability_recorder_grant"("organization_id","school_id","account_id");
CREATE INDEX "vs_people_availability_recorder_grant_runtime_idx" ON "vs_people_availability_recorder_grant"("organization_id","school_id","account_id","revoked_at");

CREATE TABLE "vs_people_availability_interval" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "employee_id" UUID NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "starts_at" TIMESTAMPTZ(3) NOT NULL,
  "ends_at" TIMESTAMPTZ(3) NOT NULL,
  "timezone" VARCHAR(64) NOT NULL,
  "source_kind" VARCHAR(30) NOT NULL,
  "source_reference" VARCHAR(120) NOT NULL,
  "recorded_by_account_id" UUID NOT NULL,
  "recorded_at" TIMESTAMPTZ(3) NOT NULL,
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_people_availability_interval_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_people_availability_interval_state_check" CHECK ("state" IN ('AVAILABLE','UNAVAILABLE')),
  CONSTRAINT "vs_people_availability_interval_source_check" CHECK ("source_kind" IN ('OPERATIONAL','APPROVED_REQUEST','CORRECTION')),
  CONSTRAINT "vs_people_availability_interval_window_check" CHECK ("ends_at" > "starts_at" AND "ends_at" <= "starts_at" + INTERVAL '31 days'),
  CONSTRAINT "vs_people_availability_interval_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_people_availability_interval_employee_fkey" FOREIGN KEY ("organization_id","school_id","employee_id") REFERENCES "vs_people_employee"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_people_availability_interval_actor_fkey" FOREIGN KEY ("recorded_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_people_availability_interval_scope_id_key" ON "vs_people_availability_interval"("organization_id","school_id","id");
CREATE INDEX "vs_people_availability_interval_employee_window_idx" ON "vs_people_availability_interval"("organization_id","school_id","employee_id","starts_at","ends_at");
CREATE INDEX "vs_people_availability_interval_branch_window_idx" ON "vs_people_availability_interval"("organization_id","school_id","starts_at","ends_at","state");

CREATE TABLE "vs_people_availability_revision" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "interval_id" UUID NOT NULL,
  "version" INTEGER NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "starts_at" TIMESTAMPTZ(3) NOT NULL,
  "ends_at" TIMESTAMPTZ(3) NOT NULL,
  "timezone" VARCHAR(64) NOT NULL,
  "source_kind" VARCHAR(30) NOT NULL,
  "source_reference" VARCHAR(120) NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_people_availability_revision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_people_availability_revision_state_check" CHECK ("state" IN ('AVAILABLE','UNAVAILABLE')),
  CONSTRAINT "vs_people_availability_revision_source_check" CHECK ("source_kind" IN ('OPERATIONAL','APPROVED_REQUEST','CORRECTION')),
  CONSTRAINT "vs_people_availability_revision_window_check" CHECK ("ends_at" > "starts_at" AND "ends_at" <= "starts_at" + INTERVAL '31 days'),
  CONSTRAINT "vs_people_availability_revision_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_people_availability_revision_interval_fkey" FOREIGN KEY ("organization_id","school_id","interval_id") REFERENCES "vs_people_availability_interval"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_people_availability_revision_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_people_availability_revision_version_key" ON "vs_people_availability_revision"("organization_id","school_id","interval_id","version");
CREATE INDEX "vs_people_availability_revision_history_idx" ON "vs_people_availability_revision"("organization_id","school_id","interval_id","occurred_at");

COMMENT ON TABLE "vs_people_availability_recorder_grant" IS 'TEN-ADR-006 Path A: classification=BRANCH; owner=people; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_people_availability_interval" IS 'TEN-ADR-006 Path A: classification=BRANCH; owner=people; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_people_availability_revision" IS 'TEN-ADR-006 Path A: classification=BRANCH; owner=people; scope=organization_id,school_id; closureGate=TEN-03';
