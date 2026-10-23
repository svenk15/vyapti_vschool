ALTER TABLE "vs_people_person_name_revision"
  ADD COLUMN "previous_contact_email" VARCHAR(254),
  ADD COLUMN "corrected_contact_email" VARCHAR(254);

CREATE TABLE "vs_people_staff_record_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "capability" VARCHAR(40) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_people_staff_record_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_people_staff_record_grant_capability_check" CHECK ("capability" IN ('PERSON_CORRECT')),
  CONSTRAINT "vs_people_staff_record_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_people_staff_record_grant_org_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_people_staff_record_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX "vs_people_staff_record_grant_scope_key"
  ON "vs_people_staff_record_grant" ("organization_id", "account_id", "capability");
CREATE INDEX "vs_people_staff_record_grant_active_idx"
  ON "vs_people_staff_record_grant" ("organization_id", "account_id", "capability", "revoked_at");

COMMENT ON TABLE "vs_people_staff_record_grant" IS
  'Organization-scoped explicit authority for People-owned Staff record corrections; branch roles alone are insufficient. TEN-ADR-006 Path A; classification=INSTITUTION; owner=people; scope=organization_id; closureGate=TEN-03';
COMMENT ON COLUMN "vs_people_person_name_revision"."previous_contact_email" IS
  'People-owned descriptive contact value before the correction; never Access login authority.';
COMMENT ON COLUMN "vs_people_person_name_revision"."corrected_contact_email" IS
  'People-owned descriptive contact value after the correction; never Access login authority.';
