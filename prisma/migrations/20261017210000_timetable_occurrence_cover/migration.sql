-- F07-B / D09 synthetic-only exact-occurrence cover. Path A metadata is explicit;
-- restricted-role RLS enforcement remains the independent TEN-03 production gate.

ALTER TABLE "vs_access_leadership_delegation_action" DROP CONSTRAINT "vs_access_leadership_delegation_action_allowlist_check";
ALTER TABLE "vs_access_leadership_delegation_action" ADD CONSTRAINT "vs_access_leadership_delegation_action_allowlist_check" CHECK ("action" IN ('leadership.read','attendance.read_leadership','timetable.read_leadership','learning.read_leadership','communication.read_leadership','timetable.cover.approve'));

CREATE TABLE "vs_academics_timetable_cover" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "occurrence_id" UUID NOT NULL,
  "original_teacher_assignment_id" UUID NOT NULL,
  "substitute_teacher_id" UUID NOT NULL,
  "proposed_by_account_id" UUID NOT NULL,
  "reason" VARCHAR(500) NOT NULL,
  "approval_state" VARCHAR(16) NOT NULL,
  "response_state" VARCHAR(16) NOT NULL,
  "lifecycle" VARCHAR(16) NOT NULL,
  "approved_by_account_id" UUID,
  "approved_at" TIMESTAMPTZ(3),
  "responded_by_account_id" UUID,
  "responded_at" TIMESTAMPTZ(3),
  "activated_at" TIMESTAMPTZ(3),
  "closed_by_account_id" UUID,
  "closed_at" TIMESTAMPTZ(3),
  "close_reason" VARCHAR(500),
  "version" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_academics_timetable_cover_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_academics_timetable_cover_approval_check" CHECK ("approval_state" IN ('PENDING','APPROVED','RETURNED','REJECTED')),
  CONSTRAINT "vs_academics_timetable_cover_response_check" CHECK ("response_state" IN ('PENDING','ACCEPTED','DECLINED')),
  CONSTRAINT "vs_academics_timetable_cover_lifecycle_check" CHECK ("lifecycle" IN ('OPEN','ACTIVE','WITHDRAWN','CANCELLED','REPLACED')),
  CONSTRAINT "vs_academics_timetable_cover_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_academics_timetable_cover_reason_check" CHECK (char_length("reason") BETWEEN 5 AND 500),
  CONSTRAINT "vs_academics_timetable_cover_approval_evidence_check" CHECK (("approval_state" = 'PENDING' AND "approved_by_account_id" IS NULL AND "approved_at" IS NULL) OR ("approval_state" <> 'PENDING' AND "approved_by_account_id" IS NOT NULL AND "approved_at" IS NOT NULL)),
  CONSTRAINT "vs_academics_timetable_cover_response_evidence_check" CHECK (("response_state" = 'PENDING' AND "responded_by_account_id" IS NULL AND "responded_at" IS NULL) OR ("response_state" <> 'PENDING' AND "responded_by_account_id" IS NOT NULL AND "responded_at" IS NOT NULL)),
  CONSTRAINT "vs_academics_timetable_cover_activation_check" CHECK (("lifecycle" = 'ACTIVE' AND "approval_state" = 'APPROVED' AND "response_state" = 'ACCEPTED' AND "activated_at" IS NOT NULL AND "closed_at" IS NULL) OR ("lifecycle" <> 'ACTIVE' AND "activated_at" IS NULL OR "closed_at" IS NOT NULL)),
  CONSTRAINT "vs_academics_timetable_cover_close_check" CHECK (("lifecycle" IN ('WITHDRAWN','CANCELLED','REPLACED') AND "closed_by_account_id" IS NOT NULL AND "closed_at" IS NOT NULL AND "close_reason" IS NOT NULL) OR ("lifecycle" IN ('OPEN','ACTIVE') AND "closed_by_account_id" IS NULL AND "closed_at" IS NULL AND "close_reason" IS NULL)),
  CONSTRAINT "vs_academics_timetable_cover_occurrence_fkey" FOREIGN KEY ("organization_id","school_id","occurrence_id") REFERENCES "vs_academics_lesson_occurrence"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_original_assignment_fkey" FOREIGN KEY ("organization_id","school_id","original_teacher_assignment_id") REFERENCES "vs_academics_teacher_assignment"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_substitute_fkey" FOREIGN KEY ("organization_id","school_id","substitute_teacher_id") REFERENCES "vs_academics_teacher"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_proposer_fkey" FOREIGN KEY ("proposed_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_approver_fkey" FOREIGN KEY ("approved_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_responder_fkey" FOREIGN KEY ("responded_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_closer_fkey" FOREIGN KEY ("closed_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_academics_timetable_cover_scope_id_key" ON "vs_academics_timetable_cover"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_academics_timetable_cover_one_live_idx" ON "vs_academics_timetable_cover"("organization_id","school_id","occurrence_id") WHERE "lifecycle" IN ('OPEN','ACTIVE');
CREATE INDEX "vs_academics_timetable_cover_occurrence_idx" ON "vs_academics_timetable_cover"("organization_id","school_id","occurrence_id","lifecycle");
CREATE INDEX "vs_academics_timetable_cover_substitute_idx" ON "vs_academics_timetable_cover"("organization_id","school_id","substitute_teacher_id","lifecycle");

CREATE TABLE "vs_academics_timetable_cover_event" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "cover_id" UUID NOT NULL,
  "number" INTEGER NOT NULL,
  "kind" VARCHAR(20) NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "reason" VARCHAR(500) NOT NULL,
  "safe_details" JSONB NOT NULL,
  "occurred_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_academics_timetable_cover_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_academics_timetable_cover_event_number_check" CHECK ("number" > 0),
  CONSTRAINT "vs_academics_timetable_cover_event_kind_check" CHECK ("kind" IN ('PROPOSED','APPROVED','RETURNED','REJECTED','ACCEPTED','DECLINED','ACTIVATED','WITHDRAWN','CANCELLED','REPLACED')),
  CONSTRAINT "vs_academics_timetable_cover_event_cover_fkey" FOREIGN KEY ("organization_id","school_id","cover_id") REFERENCES "vs_academics_timetable_cover"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_academics_timetable_cover_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_academics_timetable_cover_event_number_key" ON "vs_academics_timetable_cover_event"("organization_id","school_id","cover_id","number");
CREATE INDEX "vs_academics_timetable_cover_event_sequence_idx" ON "vs_academics_timetable_cover_event"("organization_id","school_id","cover_id","occurred_at","id");
CREATE TRIGGER "vs_academics_timetable_cover_event_immutable" BEFORE UPDATE OR DELETE ON "vs_academics_timetable_cover_event" FOR EACH ROW EXECUTE FUNCTION vs_platform_deny_history_change();

COMMENT ON TABLE "vs_academics_timetable_cover" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; exact-occurrence cover; closureGate=TEN-03';
COMMENT ON TABLE "vs_academics_timetable_cover_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=academics; scope=organization_id,school_id; immutable cover history; closureGate=TEN-03';
