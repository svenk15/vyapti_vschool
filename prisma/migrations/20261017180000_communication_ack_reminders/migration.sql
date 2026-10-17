CREATE TABLE "vs_communication_reminder_manager_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_communication_reminder_manager_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_reminder_manager_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_communication_reminder_manager_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id","account_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id","account_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_communication_reminder_manager_scope_account_key" ON "vs_communication_reminder_manager_grant"("organization_id","school_id","account_id");
CREATE INDEX "vs_communication_reminder_manager_active_idx" ON "vs_communication_reminder_manager_grant"("organization_id","school_id","account_id","revoked_at");

CREATE TABLE "vs_communication_reminder" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "notice_id" UUID NOT NULL,
  "notice_version_id" UUID NOT NULL,
  "notice_revision" INTEGER NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "audience" VARCHAR(30) NOT NULL,
  "channel" VARCHAR(20) NOT NULL,
  "idempotency_key" UUID NOT NULL,
  "input_hash" CHAR(64) NOT NULL,
  "candidate_count" INTEGER NOT NULL,
  "accepted_count" INTEGER NOT NULL,
  "acknowledged_count" INTEGER NOT NULL,
  "ineligible_count" INTEGER NOT NULL,
  "policy_limited_count" INTEGER NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_reminder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_reminder_notice_fkey" FOREIGN KEY ("organization_id","school_id","notice_id") REFERENCES "vs_communication_notice"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_version_fkey" FOREIGN KEY ("organization_id","school_id","notice_version_id") REFERENCES "vs_communication_notice_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_revision_check" CHECK ("notice_revision" > 0),
  CONSTRAINT "vs_communication_reminder_audience_check" CHECK ("audience" = 'ACKNOWLEDGEMENT'),
  CONSTRAINT "vs_communication_reminder_channel_check" CHECK ("channel" = 'IN_APP'),
  CONSTRAINT "vs_communication_reminder_counts_check" CHECK ("candidate_count" >= 0 AND "accepted_count" >= 0 AND "acknowledged_count" >= 0 AND "ineligible_count" >= 0 AND "policy_limited_count" >= 0 AND "candidate_count" = "accepted_count" + "acknowledged_count" + "ineligible_count" + "policy_limited_count")
);
CREATE UNIQUE INDEX "vs_communication_reminder_scope_id_key" ON "vs_communication_reminder"("organization_id","school_id","id");
CREATE UNIQUE INDEX "vs_communication_reminder_actor_key" ON "vs_communication_reminder"("organization_id","school_id","actor_account_id","idempotency_key");
CREATE INDEX "vs_communication_reminder_version_idx" ON "vs_communication_reminder"("organization_id","school_id","notice_version_id","created_at" DESC,"id");

CREATE TABLE "vs_communication_reminder_delivery" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "reminder_id" UUID NOT NULL,
  "notice_version_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "channel" VARCHAR(20) NOT NULL,
  "outcome" VARCHAR(30) NOT NULL,
  "dedup_key" CHAR(64) NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_reminder_delivery_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_reminder_delivery_reminder_fkey" FOREIGN KEY ("organization_id","school_id","reminder_id") REFERENCES "vs_communication_reminder"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_delivery_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_communication_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_delivery_version_fkey" FOREIGN KEY ("organization_id","school_id","notice_version_id") REFERENCES "vs_communication_notice_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_delivery_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_reminder_delivery_channel_check" CHECK ("channel" = 'IN_APP'),
  CONSTRAINT "vs_communication_reminder_delivery_outcome_check" CHECK ("outcome" IN ('ACCEPTED','SUPPRESSED_ACKNOWLEDGED','SUPPRESSED_INELIGIBLE','SUPPRESSED_POLICY'))
);
CREATE UNIQUE INDEX "vs_communication_reminder_delivery_dedup_key" ON "vs_communication_reminder_delivery"("organization_id","school_id","dedup_key");
CREATE UNIQUE INDEX "vs_communication_reminder_delivery_recipient_key" ON "vs_communication_reminder_delivery"("reminder_id","recipient_id");
CREATE INDEX "vs_communication_reminder_delivery_policy_idx" ON "vs_communication_reminder_delivery"("organization_id","school_id","notice_version_id","account_id","channel","outcome","created_at" DESC);
CREATE INDEX "vs_communication_reminder_delivery_portal_idx" ON "vs_communication_reminder_delivery"("organization_id","school_id","account_id","notice_version_id","created_at" DESC);

COMMENT ON TABLE "vs_communication_reminder_manager_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_reminder" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_reminder_delivery" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
