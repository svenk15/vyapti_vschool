CREATE TABLE "vs_people_person_name_revision" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "person_id" UUID NOT NULL,
  "version" INTEGER NOT NULL,
  "previous_first_name" VARCHAR(100) NOT NULL,
  "previous_last_name" VARCHAR(100) NOT NULL,
  "corrected_first_name" VARCHAR(100) NOT NULL,
  "corrected_last_name" VARCHAR(100) NOT NULL,
  "reason" VARCHAR(500) NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_people_person_name_revision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_people_person_name_revision_version_check" CHECK ("version" >= 2),
  CONSTRAINT "vs_people_person_name_revision_first_name_check" CHECK (
    char_length(btrim("previous_first_name")) BETWEEN 1 AND 100 AND
    char_length(btrim("corrected_first_name")) BETWEEN 1 AND 100
  ),
  CONSTRAINT "vs_people_person_name_revision_last_name_check" CHECK (
    "previous_last_name" = btrim("previous_last_name") AND
    "corrected_last_name" = btrim("corrected_last_name")
  ),
  CONSTRAINT "vs_people_person_name_revision_reason_check" CHECK (char_length(btrim("reason")) BETWEEN 5 AND 500),
  CONSTRAINT "vs_people_person_name_revision_version_key" UNIQUE ("organization_id", "person_id", "version"),
  CONSTRAINT "vs_people_person_name_revision_person_fkey" FOREIGN KEY ("organization_id", "person_id") REFERENCES "vs_people_person"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_people_person_name_revision_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_people_person_name_revision_school_fkey" FOREIGN KEY ("organization_id", "school_id") REFERENCES "vs_access_school"("organization_id", "id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE INDEX "vs_people_person_name_revision_history_idx"
  ON "vs_people_person_name_revision" ("organization_id", "person_id", "version" DESC);

CREATE TRIGGER "vs_people_person_name_revision_immutable"
  BEFORE UPDATE OR DELETE ON "vs_people_person_name_revision"
  FOR EACH ROW EXECUTE FUNCTION "vs_platform_deny_history_change"();

COMMENT ON TABLE "vs_people_person_name_revision" IS
  'TEN-ADR-006 Path A; INSTITUTION class; owner people; scope organization_id; closureGate TEN-03; RLS enforcement deferred; application authorization remains required.';
