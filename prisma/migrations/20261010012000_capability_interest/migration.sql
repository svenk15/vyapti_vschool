CREATE TABLE "vs_tenancy_capability_interest" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "module_id" VARCHAR(40) NOT NULL,
  "need" VARCHAR(1000) NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "submitted_by_account_id" UUID NOT NULL,
  "submitted_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_tenancy_capability_interest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_tenancy_capability_interest_module_check" CHECK ("module_id" IN ('attendance','family','fees','transport')),
  CONSTRAINT "vs_tenancy_capability_interest_need_check" CHECK (length(btrim("need")) BETWEEN 5 AND 1000),
  CONSTRAINT "vs_tenancy_capability_interest_status_check" CHECK ("status" = 'SUBMITTED'),
  CONSTRAINT "vs_tenancy_capability_interest_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_tenancy_capability_interest_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_tenancy_capability_interest_submitter_fkey" FOREIGN KEY ("submitted_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_tenancy_capability_interest_scope_id_key" UNIQUE ("organization_id", "school_id", "id")
);

CREATE INDEX "vs_tenancy_capability_interest_branch_history_idx" ON "vs_tenancy_capability_interest"("organization_id", "school_id", "submitted_at" DESC, "id");
CREATE INDEX "vs_tenancy_capability_interest_review_idx" ON "vs_tenancy_capability_interest"("organization_id", "status", "submitted_at" DESC, "id");
CREATE INDEX "vs_tenancy_capability_interest_submitter_idx" ON "vs_tenancy_capability_interest"("submitted_by_account_id");

COMMENT ON TABLE "vs_tenancy_capability_interest" IS 'TEN-ADR-006 Path A; BRANCH class; owner tenancy; scope organization_id,school_id; closureGate TEN-03';
