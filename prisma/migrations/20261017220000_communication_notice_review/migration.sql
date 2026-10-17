ALTER TABLE "vs_communication_notice_version" ALTER COLUMN "body" TYPE VARCHAR(10000);

CREATE TABLE "vs_communication_notice_workflow_grant" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL, "account_id" UUID NOT NULL, "action" VARCHAR(20) NOT NULL,
  "granted_by_operator_id" UUID NOT NULL, "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3), "version" INTEGER NOT NULL,
  CONSTRAINT "vs_communication_notice_workflow_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_notice_workflow_grant_action_check" CHECK ("action" IN ('AUTHOR','REVIEW','PUBLISH')),
  CONSTRAINT "vs_communication_notice_workflow_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_communication_notice_workflow_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_communication_notice_workflow_grant_scope_action_key" ON "vs_communication_notice_workflow_grant"("organization_id","school_id","account_id","action");
CREATE INDEX "vs_communication_notice_workflow_grant_active_idx" ON "vs_communication_notice_workflow_grant"("organization_id","school_id","action","account_id","revoked_at");

CREATE TABLE "vs_communication_notice_proposal" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "status" VARCHAR(20) NOT NULL, "author_account_id" UUID NOT NULL,
  "assigned_reviewer_account_id" UUID, "current_revision_id" UUID,
  "published_notice_id" UUID, "version" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL, "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_notice_proposal_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_notice_proposal_status_check" CHECK ("status" IN ('DRAFT','IN_REVIEW','APPROVED','RETURNED','REJECTED','PUBLISHED')),
  CONSTRAINT "vs_communication_notice_proposal_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_communication_notice_proposal_published_check" CHECK (("status" = 'PUBLISHED') = ("published_notice_id" IS NOT NULL)),
  CONSTRAINT "vs_communication_notice_proposal_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_author_fkey" FOREIGN KEY ("author_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_reviewer_fkey" FOREIGN KEY ("assigned_reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_notice_fkey" FOREIGN KEY ("organization_id","school_id","published_notice_id") REFERENCES "vs_communication_notice"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_scope_id_key" UNIQUE ("organization_id","school_id","id")
);
CREATE INDEX "vs_communication_notice_proposal_author_idx" ON "vs_communication_notice_proposal"("organization_id","school_id","author_account_id","updated_at" DESC,"id");
CREATE INDEX "vs_communication_notice_proposal_reviewer_idx" ON "vs_communication_notice_proposal"("organization_id","school_id","assigned_reviewer_account_id","status","updated_at" DESC,"id");

CREATE TABLE "vs_communication_notice_proposal_revision" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "proposal_id" UUID NOT NULL, "number" INTEGER NOT NULL, "audience_section_id" UUID NOT NULL,
  "audience_label" VARCHAR(160) NOT NULL, "title" VARCHAR(120) NOT NULL, "body" VARCHAR(10000) NOT NULL,
  "requires_acknowledgement" BOOLEAN NOT NULL, "attachment_digest" CHAR(64) NOT NULL,
  "channel" VARCHAR(20) NOT NULL, "schedule_kind" VARCHAR(20) NOT NULL,
  "approval_digest" CHAR(64) NOT NULL, "created_by_account_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_notice_proposal_revision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_notice_proposal_revision_number_check" CHECK ("number" > 0),
  CONSTRAINT "vs_communication_notice_proposal_revision_channel_check" CHECK ("channel" = 'PORTAL'),
  CONSTRAINT "vs_communication_notice_proposal_revision_schedule_check" CHECK ("schedule_kind" = 'IMMEDIATE'),
  CONSTRAINT "vs_communication_notice_proposal_revision_hash_check" CHECK ("attachment_digest" ~ '^[0-9a-f]{64}$' AND "approval_digest" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_communication_notice_proposal_revision_proposal_fkey" FOREIGN KEY ("organization_id","school_id","proposal_id") REFERENCES "vs_communication_notice_proposal"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_revision_section_fkey" FOREIGN KEY ("organization_id","school_id","audience_section_id") REFERENCES "vs_academics_section"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_revision_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_revision_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_communication_notice_proposal_revision_number_key" UNIQUE ("organization_id","school_id","proposal_id","number")
);
CREATE INDEX "vs_communication_notice_proposal_revision_sequence_idx" ON "vs_communication_notice_proposal_revision"("organization_id","school_id","proposal_id","number" DESC,"id");
ALTER TABLE "vs_communication_notice_proposal" ADD CONSTRAINT "vs_communication_notice_proposal_current_revision_fkey" FOREIGN KEY ("organization_id","school_id","current_revision_id") REFERENCES "vs_communication_notice_proposal_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE "vs_communication_notice_proposal_decision" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL,
  "proposal_id" UUID NOT NULL, "revision_id" UUID NOT NULL, "reviewer_account_id" UUID NOT NULL,
  "action" VARCHAR(20) NOT NULL, "reason" VARCHAR(500) NOT NULL, "approval_digest" CHAR(64) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_notice_proposal_decision_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_notice_proposal_decision_action_check" CHECK ("action" IN ('APPROVE','RETURN','REJECT')),
  CONSTRAINT "vs_communication_notice_proposal_decision_hash_check" CHECK ("approval_digest" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "vs_communication_notice_proposal_decision_proposal_fkey" FOREIGN KEY ("organization_id","school_id","proposal_id") REFERENCES "vs_communication_notice_proposal"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_decision_revision_fkey" FOREIGN KEY ("organization_id","school_id","revision_id") REFERENCES "vs_communication_notice_proposal_revision"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_decision_reviewer_fkey" FOREIGN KEY ("reviewer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_proposal_decision_revision_key" UNIQUE ("organization_id","school_id","proposal_id","revision_id")
);
CREATE INDEX "vs_communication_notice_proposal_decision_sequence_idx" ON "vs_communication_notice_proposal_decision"("organization_id","school_id","proposal_id","created_at" DESC,"id");

COMMENT ON TABLE "vs_communication_notice_workflow_grant" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice_proposal" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice_proposal_revision" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice_proposal_decision" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
