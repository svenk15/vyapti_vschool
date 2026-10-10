-- SA-07: branch-scoped publication authority, separate from fixed access roles.
CREATE TABLE "vs_branding_publication_delegation" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "version" INTEGER NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "granted_by" UUID NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "revoked_by" UUID,
  CONSTRAINT "vs_branding_publication_delegation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_branding_publication_delegation_status_check" CHECK ("status" IN ('ACTIVE','REVOKED')),
  CONSTRAINT "vs_branding_publication_delegation_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_branding_publication_delegation_revocation_check" CHECK (("status" = 'ACTIVE' AND "revoked_at" IS NULL AND "revoked_by" IS NULL) OR ("status" = 'REVOKED' AND "revoked_at" IS NOT NULL AND "revoked_by" IS NOT NULL)),
  CONSTRAINT "vs_branding_publication_delegation_scope_account_key" UNIQUE ("organization_id","school_id","account_id"),
  CONSTRAINT "vs_branding_publication_delegation_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_branding_publication_delegation_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_branding_publication_delegation_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_branding_publication_delegation_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_branding_publication_delegation_grantor_fkey" FOREIGN KEY ("granted_by") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_branding_publication_delegation_revoker_fkey" FOREIGN KEY ("revoked_by") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE INDEX "vs_branding_publication_delegation_account_idx" ON "vs_branding_publication_delegation" ("account_id","status","organization_id","school_id");
CREATE INDEX "vs_branding_publication_delegation_scope_idx" ON "vs_branding_publication_delegation" ("organization_id","school_id","status","account_id");

COMMENT ON TABLE "vs_branding_publication_delegation" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=branding; scope=organization_id,school_id; closureGate=TEN-03';
