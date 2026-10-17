CREATE TABLE "vs_support_capability_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "capability" VARCHAR(32) NOT NULL,
  "student_id" UUID,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_support_capability_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_support_capability_grant_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_support_capability_grant_pair_check" CHECK (("capability"='REFERRAL_CREATE' AND "student_id" IS NOT NULL) OR ("capability" IN ('SPECIALIST','POLICY_STEWARD','HANDOFF_RECORD') AND "student_id" IS NULL)),
  CONSTRAINT "vs_support_capability_grant_version_check" CHECK ("version">0),
  CONSTRAINT "vs_support_capability_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_capability_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_capability_grant_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_support_capability_grant_resource_key" ON "vs_support_capability_grant"("organization_id","school_id","account_id","capability","student_id") WHERE "student_id" IS NOT NULL;
CREATE UNIQUE INDEX "vs_support_capability_grant_branch_key" ON "vs_support_capability_grant"("organization_id","school_id","account_id","capability") WHERE "student_id" IS NULL;
CREATE INDEX "vs_support_capability_grant_active_idx" ON "vs_support_capability_grant"("organization_id","school_id","account_id","capability","student_id","revoked_at");

CREATE TABLE "vs_support_procedure" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "version_no" INTEGER NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "instruction" VARCHAR(1200) NOT NULL,
  "contact_label" VARCHAR(160) NOT NULL,
  "responsible_account_id" UUID NOT NULL,
  "status" VARCHAR(12) NOT NULL,
  "published_by_account_id" UUID NOT NULL,
  "published_at" TIMESTAMPTZ(3) NOT NULL,
  "retired_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_support_procedure_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_support_procedure_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_support_procedure_version_key" UNIQUE ("organization_id","school_id","version_no"),
  CONSTRAINT "vs_support_procedure_status_check" CHECK (("status"='PUBLISHED' AND "retired_at" IS NULL) OR ("status"='RETIRED' AND "retired_at" IS NOT NULL)),
  CONSTRAINT "vs_support_procedure_version_check" CHECK ("version_no">0 AND "version">0),
  CONSTRAINT "vs_support_procedure_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_procedure_responsible_fkey" FOREIGN KEY ("responsible_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_procedure_publisher_fkey" FOREIGN KEY ("published_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_support_procedure_published_key" ON "vs_support_procedure"("organization_id","school_id") WHERE "status"='PUBLISHED';
CREATE INDEX "vs_support_procedure_current_idx" ON "vs_support_procedure"("organization_id","school_id","status","version_no" DESC);

CREATE TABLE "vs_support_referral" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "student_name_snapshot" VARCHAR(210) NOT NULL,
  "admission_snapshot" VARCHAR(80) NOT NULL,
  "referrer_account_id" UUID NOT NULL,
  "specialist_account_id" UUID NOT NULL,
  "specialist_name" VARCHAR(210) NOT NULL,
  "factual_concern" VARCHAR(2000) NOT NULL,
  "status" VARCHAR(16) NOT NULL,
  "version" INTEGER NOT NULL,
  "sent_at" TIMESTAMPTZ(3) NOT NULL,
  "acknowledged_at" TIMESTAMPTZ(3),
  "returned_at" TIMESTAMPTZ(3),
  "closed_at" TIMESTAMPTZ(3),
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_support_referral_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_support_referral_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_support_referral_status_check" CHECK ("status" IN ('SENT','ACKNOWLEDGED','RETURNED','CLOSED')),
  CONSTRAINT "vs_support_referral_version_check" CHECK ("version">0),
  CONSTRAINT "vs_support_referral_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_referral_referrer_fkey" FOREIGN KEY ("referrer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_referral_specialist_fkey" FOREIGN KEY ("specialist_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_support_referral_referrer_idx" ON "vs_support_referral"("organization_id","school_id","referrer_account_id","updated_at" DESC,"id");
CREATE INDEX "vs_support_referral_specialist_idx" ON "vs_support_referral"("organization_id","school_id","specialist_account_id","status","updated_at" DESC,"id");

CREATE TABLE "vs_support_referral_event" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "referral_id" UUID NOT NULL,
  "number" INTEGER NOT NULL,
  "type" VARCHAR(24) NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "safe_details" JSONB NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_support_referral_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_support_referral_event_number_key" UNIQUE ("organization_id","school_id","referral_id","number"),
  CONSTRAINT "vs_support_referral_event_number_check" CHECK ("number">0),
  CONSTRAINT "vs_support_referral_event_referral_fkey" FOREIGN KEY ("organization_id","school_id","referral_id") REFERENCES "vs_support_referral"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_referral_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_support_referral_event_history_idx" ON "vs_support_referral_event"("organization_id","school_id","referral_id","occurred_at","id");

CREATE TABLE "vs_support_handoff" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "procedure_id" UUID NOT NULL,
  "procedure_version" INTEGER NOT NULL,
  "recorder_account_id" UUID NOT NULL,
  "responsible_account_id" UUID NOT NULL,
  "safe_reference" VARCHAR(500) NOT NULL,
  "status" VARCHAR(16) NOT NULL,
  "version" INTEGER NOT NULL,
  "recorded_at" TIMESTAMPTZ(3) NOT NULL,
  "acknowledged_at" TIMESTAMPTZ(3),
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_support_handoff_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_support_handoff_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_support_handoff_status_check" CHECK (("status"='RECORDED' AND "acknowledged_at" IS NULL) OR ("status"='ACKNOWLEDGED' AND "acknowledged_at" IS NOT NULL)),
  CONSTRAINT "vs_support_handoff_version_check" CHECK ("version">0 AND "procedure_version">0),
  CONSTRAINT "vs_support_handoff_procedure_fkey" FOREIGN KEY ("organization_id","school_id","procedure_id") REFERENCES "vs_support_procedure"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_handoff_recorder_fkey" FOREIGN KEY ("recorder_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_support_handoff_responsible_fkey" FOREIGN KEY ("responsible_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_support_handoff_recorder_idx" ON "vs_support_handoff"("organization_id","school_id","recorder_account_id","recorded_at" DESC,"id");
CREATE INDEX "vs_support_handoff_responsible_idx" ON "vs_support_handoff"("organization_id","school_id","responsible_account_id","status","recorded_at" DESC,"id");

CREATE FUNCTION "vs_support_block_referral_event_mutation"() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'support referral events are append-only'; END $$;
CREATE TRIGGER "vs_support_referral_event_append_only" BEFORE UPDATE OR DELETE ON "vs_support_referral_event" FOR EACH ROW EXECUTE FUNCTION "vs_support_block_referral_event_mutation"();

COMMENT ON TABLE "vs_support_capability_grant" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_procedure" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_referral" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_referral_event" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_support_handoff" IS 'TEN-ADR-006 Path A; class=BRANCH; owner=support; scope=organization_id,school_id; closureGate=TEN-03';
