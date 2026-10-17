CREATE TABLE "vs_learning_manager_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "section_id" UUID NOT NULL,
  "subject_id" UUID NOT NULL,
  "capability" VARCHAR(40) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_learning_manager_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_manager_grant_capability_check" CHECK ("capability" IN ('RECIPIENT_POLICY_MANAGE','RECIPIENT_STATUS_READ')),
  CONSTRAINT "vs_learning_manager_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_learning_manager_grant_revoke_check" CHECK ("revoked_at" IS NULL OR "revoked_at" >= "granted_at"),
  CONSTRAINT "vs_learning_manager_grant_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_manager_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_manager_grant_section_fkey" FOREIGN KEY ("organization_id","school_id","section_id") REFERENCES "vs_academics_section"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_manager_grant_subject_fkey" FOREIGN KEY ("organization_id","school_id","subject_id") REFERENCES "vs_academics_subject"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_learning_manager_grant_scope_key" ON "vs_learning_manager_grant"("organization_id","school_id","account_id","section_id","subject_id","capability");
CREATE INDEX "vs_learning_manager_grant_active_idx" ON "vs_learning_manager_grant"("organization_id","school_id","account_id","capability","revoked_at");

CREATE TABLE "vs_learning_recipient_policy_event" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "assignment_version_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "event_no" INTEGER NOT NULL,
  "action" VARCHAR(24) NOT NULL,
  "previous_due_at" TIMESTAMPTZ(3) NOT NULL,
  "effective_due_at" TIMESTAMPTZ(3) NOT NULL,
  "previous_excused" BOOLEAN NOT NULL,
  "effective_excused" BOOLEAN NOT NULL,
  "reason" VARCHAR(500) NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_learning_recipient_policy_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_learning_recipient_policy_event_event_check" CHECK ("event_no" > 0),
  CONSTRAINT "vs_learning_recipient_policy_event_action_check" CHECK ("action" IN ('EXTEND','EXCUSE','REVERSE_EXCUSAL')),
  CONSTRAINT "vs_learning_recipient_policy_event_reason_check" CHECK (char_length(btrim("reason")) BETWEEN 4 AND 500),
  CONSTRAINT "vs_learning_recipient_policy_event_shape_check" CHECK (
    ("action" = 'EXTEND' AND NOT "previous_excused" AND NOT "effective_excused" AND "effective_due_at" > "previous_due_at") OR
    ("action" = 'EXCUSE' AND NOT "previous_excused" AND "effective_excused" AND "effective_due_at" = "previous_due_at") OR
    ("action" = 'REVERSE_EXCUSAL' AND "previous_excused" AND NOT "effective_excused" AND "effective_due_at" >= "previous_due_at")
  ),
  CONSTRAINT "vs_learning_recipient_policy_event_version_fkey" FOREIGN KEY ("organization_id","school_id","assignment_version_id") REFERENCES "vs_learning_assignment_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_recipient_policy_event_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_learning_assignment_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_recipient_policy_event_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_learning_recipient_policy_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_learning_recipient_policy_event_scope_id_key" ON "vs_learning_recipient_policy_event"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_learning_recipient_policy_event_number_key" ON "vs_learning_recipient_policy_event"("organization_id","school_id","recipient_id","event_no");
CREATE INDEX "vs_learning_recipient_policy_event_assignment_idx" ON "vs_learning_recipient_policy_event"("organization_id","school_id","assignment_version_id","recipient_id","event_no" DESC);
CREATE INDEX "vs_learning_recipient_policy_event_student_idx" ON "vs_learning_recipient_policy_event"("organization_id","school_id","student_id","occurred_at" DESC,"id");

CREATE OR REPLACE FUNCTION vs_learning_reject_recipient_policy_event_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'learning recipient policy events are immutable' USING ERRCODE = '23514';
END;
$$;
CREATE TRIGGER "vs_learning_recipient_policy_event_immutable" BEFORE UPDATE OR DELETE ON "vs_learning_recipient_policy_event" FOR EACH ROW EXECUTE FUNCTION vs_learning_reject_recipient_policy_event_change();

COMMENT ON TABLE "vs_learning_manager_grant" IS 'TEN-ADR-006 Path A; BRANCH class; owner learning; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Exact class/subject synthetic-only Learning manager designation.';
COMMENT ON TABLE "vs_learning_recipient_policy_event" IS 'TEN-ADR-006 Path A; BRANCH class; owner learning; scope organization_id,school_id; RLS enforcement deferred to TEN-03; closureGate TEN-03; application authorization remains required. Immutable synthetic-only per-recipient effective-deadline and excusal history.';
