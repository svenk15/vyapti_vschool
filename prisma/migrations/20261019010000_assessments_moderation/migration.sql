CREATE TABLE "vs_assessments_moderation_grant" (
 "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL,
 "membership_id" uuid NOT NULL, "account_id" uuid NOT NULL, "granted_by_operator_id" uuid NOT NULL,
 "granted_at" timestamptz(3) NOT NULL, "revoked_at" timestamptz(3), "version" integer NOT NULL,
 CONSTRAINT "vs_assessments_moderation_grant_version_check" CHECK ("version">0)
);
CREATE UNIQUE INDEX "vs_assessments_moderation_grant_scope_id_key" ON "vs_assessments_moderation_grant"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_assessments_moderation_grant_account_key" ON "vs_assessments_moderation_grant"("organization_id","school_id","account_id");
CREATE INDEX "vs_assessments_moderation_grant_active_idx" ON "vs_assessments_moderation_grant"("organization_id","school_id","account_id","revoked_at");
ALTER TABLE "vs_assessments_moderation_grant" ADD CONSTRAINT "vs_assessments_moderation_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation_grant" ADD CONSTRAINT "vs_assessments_moderation_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "vs_assessments_moderation" ADD COLUMN "submitted_by_account_id" uuid, ADD COLUMN "assigned_reviewer_account_id" uuid, ADD COLUMN "submitted_at" timestamptz(3), ADD COLUMN "decided_by_account_id" uuid, ADD COLUMN "decided_at" timestamptz(3), ADD COLUMN "decision_reason" varchar(1000);
CREATE INDEX "vs_assessments_moderation_reviewer_idx" ON "vs_assessments_moderation"("organization_id","school_id","assigned_reviewer_account_id","status","submitted_at" DESC);
ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_submitter_fkey" FOREIGN KEY ("submitted_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_reviewer_fkey" FOREIGN KEY ("assigned_reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_decider_fkey" FOREIGN KEY ("decided_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation" ADD CONSTRAINT "vs_assessments_moderation_decision_pair_check" CHECK (("decided_by_account_id" IS NULL)=("decided_at" IS NULL));

CREATE TABLE "vs_assessments_moderation_event" (
 "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL, "moderation_id" uuid NOT NULL,
 "moderation_version" integer NOT NULL, "type" varchar(32) NOT NULL, "evidence_version" integer NOT NULL,
 "evidence_digest" char(64) NOT NULL, "actor_account_id" uuid NOT NULL, "occurred_at" timestamptz(3) NOT NULL,
 CONSTRAINT "vs_assessments_moderation_event_version_check" CHECK ("moderation_version">0 AND "evidence_version">0),
 CONSTRAINT "vs_assessments_moderation_event_type_check" CHECK ("type" IN ('SUBMITTED','APPROVED','RETURNED','REJECTED','INFORMATION_REQUESTED','INFORMATION_ANSWERED','RECUSED')),
 CONSTRAINT "vs_assessments_moderation_event_digest_check" CHECK ("evidence_digest" ~ '^[0-9a-f]{64}$')
);
CREATE UNIQUE INDEX "vs_assessments_moderation_event_scope_id_key" ON "vs_assessments_moderation_event"("organization_id","school_id","id");
CREATE INDEX "vs_assessments_moderation_event_history_idx" ON "vs_assessments_moderation_event"("organization_id","school_id","moderation_id","occurred_at");
ALTER TABLE "vs_assessments_moderation_event" ADD CONSTRAINT "vs_assessments_moderation_event_item_fkey" FOREIGN KEY ("organization_id","school_id","moderation_id") REFERENCES "vs_assessments_moderation"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation_event" ADD CONSTRAINT "vs_assessments_moderation_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE TRIGGER "vs_assessments_moderation_event_immutable" BEFORE UPDATE OR DELETE ON "vs_assessments_moderation_event" FOR EACH ROW EXECUTE FUNCTION public.vs_assessments_immutable_row();

CREATE TABLE "vs_assessments_moderation_information" (
 "id" uuid PRIMARY KEY, "organization_id" uuid NOT NULL, "school_id" uuid NOT NULL, "moderation_id" uuid NOT NULL,
 "requester_account_id" uuid NOT NULL, "recipient_account_id" uuid NOT NULL, "question" varchar(1000) NOT NULL,
 "response_due_at" timestamptz(3), "status" varchar(16) NOT NULL, "response_text" varchar(1000),
 "requested_at" timestamptz(3) NOT NULL, "answered_at" timestamptz(3), "cancelled_at" timestamptz(3), "version" integer NOT NULL,
 CONSTRAINT "vs_assessments_moderation_information_status_check" CHECK ("status" IN ('OPEN','ANSWERED','CANCELLED')),
 CONSTRAINT "vs_assessments_moderation_information_version_check" CHECK ("version">0),
 CONSTRAINT "vs_assessments_moderation_information_answer_check" CHECK (("status"='ANSWERED')=("response_text" IS NOT NULL AND "answered_at" IS NOT NULL))
);
CREATE UNIQUE INDEX "vs_assessments_moderation_information_scope_id_key" ON "vs_assessments_moderation_information"("organization_id","school_id","id");
CREATE INDEX "vs_assessments_moderation_information_item_idx" ON "vs_assessments_moderation_information"("organization_id","school_id","moderation_id","status","requested_at" DESC);
CREATE INDEX "vs_assessments_moderation_information_recipient_idx" ON "vs_assessments_moderation_information"("organization_id","school_id","recipient_account_id","status","response_due_at");
ALTER TABLE "vs_assessments_moderation_information" ADD CONSTRAINT "vs_assessments_moderation_information_item_fkey" FOREIGN KEY ("organization_id","school_id","moderation_id") REFERENCES "vs_assessments_moderation"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation_information" ADD CONSTRAINT "vs_assessments_moderation_information_requester_fkey" FOREIGN KEY ("requester_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "vs_assessments_moderation_information" ADD CONSTRAINT "vs_assessments_moderation_information_recipient_fkey" FOREIGN KEY ("recipient_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

COMMENT ON TABLE "vs_assessments_moderation_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_moderation_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_assessments_moderation_information" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=assessments; scope=organization_id,school_id; closureGate=TEN-03';
