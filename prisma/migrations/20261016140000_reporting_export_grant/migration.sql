CREATE TABLE "vs_reporting_export_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_reporting_export_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_export_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_reporting_export_grant_membership_fkey" FOREIGN KEY ("organization_id", "school_id", "membership_id", "account_id") REFERENCES "vs_access_school_membership" ("organization_id", "school_id", "id", "account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_reporting_export_grant_scope_account_key" ON "vs_reporting_export_grant" ("organization_id", "school_id", "account_id");
CREATE INDEX "vs_reporting_export_grant_active_idx" ON "vs_reporting_export_grant" ("organization_id", "school_id", "account_id", "revoked_at");

COMMENT ON TABLE "vs_reporting_export_grant" IS 'TEN-ADR-006 Path A; BRANCH class; owner reporting; scope organization_id,school_id; RLS enforcement deferred to TEN-03; application authorization remains required. Operator-designated Principal aggregate export authority.';
