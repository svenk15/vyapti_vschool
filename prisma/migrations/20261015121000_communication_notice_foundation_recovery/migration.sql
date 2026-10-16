-- Additive recovery for a local PostgreSQL run that retained pre-error DDL from the preceding failed migration.
CREATE TABLE IF NOT EXISTS "vs_communication_notice_version" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL, "notice_id" UUID NOT NULL,
  "version_no" INTEGER NOT NULL, "title" VARCHAR(120) NOT NULL, "body" VARCHAR(5000) NOT NULL,
  "requires_acknowledgement" BOOLEAN NOT NULL, "audience_section_id" UUID NOT NULL, "audience_label" VARCHAR(160) NOT NULL,
  "audience_digest" CHAR(64) NOT NULL, "published_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_notice_version_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_notice_version_number_check" CHECK ("version_no" > 0),
  CONSTRAINT "vs_communication_notice_version_notice_fkey" FOREIGN KEY ("organization_id","school_id","notice_id") REFERENCES "vs_communication_notice"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_version_section_fkey" FOREIGN KEY ("audience_section_id") REFERENCES "vs_academics_section"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_notice_version_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_communication_notice_version_number_key" UNIQUE ("organization_id","school_id","notice_id","version_no")
);
CREATE INDEX IF NOT EXISTS "vs_communication_notice_version_published_idx" ON "vs_communication_notice_version"("organization_id","school_id","published_at" DESC,"id");
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vs_communication_notice_current_version_fkey') THEN ALTER TABLE "vs_communication_notice" ADD CONSTRAINT "vs_communication_notice_current_version_fkey" FOREIGN KEY ("organization_id","school_id","current_version_id") REFERENCES "vs_communication_notice_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED; END IF; END $$;

CREATE TABLE IF NOT EXISTS "vs_communication_recipient" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL, "notice_version_id" UUID NOT NULL,
  "account_id" UUID NOT NULL, "first_read_at" TIMESTAMPTZ(3), "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_recipient_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_recipient_version_fkey" FOREIGN KEY ("organization_id","school_id","notice_version_id") REFERENCES "vs_communication_notice_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_recipient_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_recipient_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_communication_recipient_version_account_key" UNIQUE ("organization_id","school_id","notice_version_id","account_id")
);
CREATE INDEX IF NOT EXISTS "vs_communication_recipient_inbox_idx" ON "vs_communication_recipient"("organization_id","school_id","account_id","notice_version_id");

CREATE TABLE IF NOT EXISTS "vs_communication_recipient_binding" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL, "recipient_id" UUID NOT NULL,
  "access_id" UUID NOT NULL, "student_id" UUID NOT NULL,
  CONSTRAINT "vs_communication_recipient_binding_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_recipient_binding_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_communication_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_recipient_binding_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id","student_id") REFERENCES "vs_guardians_child_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_recipient_binding_access_key" UNIQUE ("recipient_id","access_id")
);
CREATE INDEX IF NOT EXISTS "vs_communication_recipient_binding_student_idx" ON "vs_communication_recipient_binding"("organization_id","school_id","student_id","recipient_id");

CREATE TABLE IF NOT EXISTS "vs_communication_acknowledgement" (
  "id" UUID NOT NULL, "organization_id" UUID NOT NULL, "school_id" UUID NOT NULL, "notice_version_id" UUID NOT NULL,
  "recipient_account_id" UUID NOT NULL, "actor_account_id" UUID NOT NULL, "acknowledged_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_communication_acknowledgement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_communication_ack_version_fkey" FOREIGN KEY ("organization_id","school_id","notice_version_id") REFERENCES "vs_communication_notice_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_ack_recipient_fkey" FOREIGN KEY ("recipient_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_ack_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_communication_ack_actor_check" CHECK ("recipient_account_id" = "actor_account_id"),
  CONSTRAINT "vs_communication_ack_version_account_key" UNIQUE ("organization_id","school_id","notice_version_id","recipient_account_id")
);
CREATE INDEX IF NOT EXISTS "vs_communication_ack_account_idx" ON "vs_communication_acknowledgement"("organization_id","school_id","recipient_account_id","acknowledged_at" DESC);

COMMENT ON TABLE "vs_communication_publisher_grant" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_notice_version" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_recipient" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_recipient_binding" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_communication_acknowledgement" IS 'VSchool RLS Path A; class=BRANCH; owner=communication; scope=organization_id,school_id; closureGate=TEN-03';
