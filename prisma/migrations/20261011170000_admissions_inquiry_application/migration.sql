CREATE TABLE "vs_admissions_cycle" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "code" VARCHAR(40) NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "opens_on" DATE NOT NULL,
  "closes_on" DATE NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_admissions_cycle_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_admissions_cycle_range_check" CHECK ("opens_on" <= "closes_on"),
  CONSTRAINT "vs_admissions_cycle_state_check" CHECK ("state" IN ('OPEN','CLOSED')),
  CONSTRAINT "vs_admissions_cycle_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_admissions_cycle_code_check" CHECK ("code" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$'),
  CONSTRAINT "vs_admissions_cycle_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_cycle_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_cycle_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_admissions_cycle_scope_code_key" UNIQUE ("organization_id","school_id","code")
);
CREATE INDEX "vs_admissions_cycle_open_idx" ON "vs_admissions_cycle"("organization_id","school_id","state","opens_on","closes_on","id");

CREATE TABLE "vs_admissions_applicant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "display_name" VARCHAR(160) NOT NULL,
  "normalized_name" VARCHAR(160) NOT NULL,
  "contact_email" VARCHAR(254) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_admissions_applicant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_admissions_applicant_text_check" CHECK (length(btrim("display_name")) BETWEEN 1 AND 160 AND length(btrim("normalized_name")) BETWEEN 1 AND 160 AND length("contact_email") BETWEEN 3 AND 254),
  CONSTRAINT "vs_admissions_applicant_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_applicant_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_applicant_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE INDEX "vs_admissions_applicant_contact_idx" ON "vs_admissions_applicant"("organization_id","school_id","contact_email","id");

CREATE TABLE "vs_admissions_application" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "applicant_id" UUID NOT NULL,
  "cycle_id" UUID NOT NULL,
  "grade_id" UUID NOT NULL,
  "reference" VARCHAR(40) NOT NULL,
  "state" VARCHAR(20) NOT NULL,
  "collection_notice_provided_at" TIMESTAMPTZ(3) NOT NULL,
  "dedupe_key" CHAR(64) NOT NULL,
  "version" INTEGER NOT NULL,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_admissions_application_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_admissions_application_state_check" CHECK ("state" IN ('STARTED')),
  CONSTRAINT "vs_admissions_application_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_admissions_application_reference_check" CHECK ("reference" ~ '^APP-[A-Z0-9]{8,32}$'),
  CONSTRAINT "vs_admissions_application_dedupe_check" CHECK ("dedupe_key" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_admissions_application_organization_fkey" FOREIGN KEY ("organization_id") REFERENCES "vs_access_organization"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_application_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_application_applicant_fkey" FOREIGN KEY ("organization_id","school_id","applicant_id") REFERENCES "vs_admissions_applicant"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_application_cycle_fkey" FOREIGN KEY ("organization_id","school_id","cycle_id") REFERENCES "vs_admissions_cycle"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_application_grade_fkey" FOREIGN KEY ("organization_id","school_id","grade_id") REFERENCES "vs_academics_grade_level"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_application_creator_fkey" FOREIGN KEY ("created_by") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_admissions_application_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_admissions_application_reference_key" UNIQUE ("organization_id","school_id","reference"),
  CONSTRAINT "vs_admissions_application_dedupe_key" UNIQUE ("organization_id","school_id","cycle_id","dedupe_key")
);
CREATE INDEX "vs_admissions_application_created_idx" ON "vs_admissions_application"("organization_id","school_id","created_at" DESC,"id" DESC);

COMMENT ON TABLE "vs_admissions_cycle" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=admissions; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_admissions_applicant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=admissions; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_admissions_application" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=admissions; scope=organization_id,school_id; closureGate=TEN-03';
