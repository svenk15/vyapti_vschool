CREATE TABLE "vs_reporting_comparison_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "metric" VARCHAR(80) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_reporting_comparison_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_reporting_comparison_grant_metric_check" CHECK ("metric" = 'attendance-register-coverage.v1'),
  CONSTRAINT "vs_reporting_comparison_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_reporting_comparison_grant_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_comparison_grant_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school" ("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_reporting_comparison_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_reporting_comparison_grant_scope_metric_key" ON "vs_reporting_comparison_grant" ("organization_id", "account_id", "school_id", "metric");
CREATE INDEX "vs_reporting_comparison_grant_active_idx" ON "vs_reporting_comparison_grant" ("organization_id", "account_id", "metric", "revoked_at", "school_id");

COMMENT ON TABLE "vs_reporting_comparison_grant" IS 'TEN-ADR-006 Path A; INSTITUTION class; owner reporting; scope organization_id; school_id is an enumerated target resource; closureGate TEN-03; RLS enforcement deferred to TEN-03; application authorization remains required. Operator-designated Principal whole-branch aggregate comparison authority.';
