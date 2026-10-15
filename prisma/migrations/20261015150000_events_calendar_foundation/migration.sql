CREATE UNIQUE INDEX "vs_academics_section_scope_id_key" ON "vs_academics_section"("organization_id","school_id","id");

CREATE TABLE "vs_events_publisher_grant" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "membership_id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "granted_by_operator_id" UUID NOT NULL,
  "granted_at" TIMESTAMPTZ(3) NOT NULL,
  "revoked_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL,
  CONSTRAINT "vs_events_publisher_grant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_events_publisher_version_check" CHECK ("version" >= 1),
  CONSTRAINT "vs_events_publisher_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_publisher_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_events_publisher_scope_account_key" ON "vs_events_publisher_grant"("organization_id","school_id","account_id");
CREATE INDEX "vs_events_publisher_active_idx" ON "vs_events_publisher_grant"("organization_id","school_id","account_id","revoked_at");

CREATE TABLE "vs_events_event" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "revision" INTEGER NOT NULL,
  "current_version_id" UUID,
  "title" VARCHAR(120) NOT NULL,
  "description" VARCHAR(500) NOT NULL,
  "schedule_kind" VARCHAR(20) NOT NULL,
  "starts_on" DATE,
  "ends_on_exclusive" DATE,
  "starts_at" TIMESTAMPTZ(3),
  "ends_at" TIMESTAMPTZ(3),
  "audience_kind" VARCHAR(20) NOT NULL,
  "audience_section_id" UUID,
  "created_by_account_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "canceled_at" TIMESTAMPTZ(3),
  CONSTRAINT "vs_events_event_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_events_event_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_events_event_status_check" CHECK ("status" IN ('DRAFT','PUBLISHED','CANCELED')),
  CONSTRAINT "vs_events_event_revision_check" CHECK ("revision" >= 1),
  CONSTRAINT "vs_events_event_audience_check" CHECK (("audience_kind"='BRANCH' AND "audience_section_id" IS NULL) OR ("audience_kind"='SECTION' AND "audience_section_id" IS NOT NULL)),
  CONSTRAINT "vs_events_event_schedule_check" CHECK (("schedule_kind"='ALL_DAY' AND "starts_on" IS NOT NULL AND "ends_on_exclusive">"starts_on" AND "starts_at" IS NULL AND "ends_at" IS NULL) OR ("schedule_kind"='TIMED' AND "starts_on" IS NULL AND "ends_on_exclusive" IS NULL AND "starts_at" IS NOT NULL AND "ends_at">"starts_at")),
  CONSTRAINT "vs_events_event_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_event_section_fkey" FOREIGN KEY ("organization_id","school_id","audience_section_id") REFERENCES "vs_academics_section"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_event_creator_fkey" FOREIGN KEY ("created_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_events_event_list_idx" ON "vs_events_event"("organization_id","school_id","status","updated_at" DESC,"id");
CREATE UNIQUE INDEX "vs_events_event_current_version_key" ON "vs_events_event"("organization_id","school_id","current_version_id");

CREATE TABLE "vs_events_event_version" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "event_id" UUID NOT NULL,
  "version_no" INTEGER NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "description" VARCHAR(500) NOT NULL,
  "schedule_kind" VARCHAR(20) NOT NULL,
  "starts_on" DATE,
  "ends_on_exclusive" DATE,
  "starts_at" TIMESTAMPTZ(3),
  "ends_at" TIMESTAMPTZ(3),
  "audience_kind" VARCHAR(20) NOT NULL,
  "audience_section_id" UUID,
  "audience_label" VARCHAR(160) NOT NULL,
  "audience_digest" CHAR(64) NOT NULL,
  "published_by_account_id" UUID NOT NULL,
  "published_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_events_event_version_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_events_event_version_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_events_event_version_number_key" UNIQUE ("organization_id","school_id","event_id","version_no"),
  CONSTRAINT "vs_events_event_version_number_check" CHECK ("version_no" >= 1),
  CONSTRAINT "vs_events_event_version_audience_check" CHECK (("audience_kind"='BRANCH' AND "audience_section_id" IS NULL) OR ("audience_kind"='SECTION' AND "audience_section_id" IS NOT NULL)),
  CONSTRAINT "vs_events_event_version_schedule_check" CHECK (("schedule_kind"='ALL_DAY' AND "starts_on" IS NOT NULL AND "ends_on_exclusive">"starts_on" AND "starts_at" IS NULL AND "ends_at" IS NULL) OR ("schedule_kind"='TIMED' AND "starts_on" IS NULL AND "ends_on_exclusive" IS NULL AND "starts_at" IS NOT NULL AND "ends_at">"starts_at")),
  CONSTRAINT "vs_events_event_version_event_fkey" FOREIGN KEY ("organization_id","school_id","event_id") REFERENCES "vs_events_event"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_event_version_publisher_fkey" FOREIGN KEY ("published_by_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_events_event_version_published_idx" ON "vs_events_event_version"("organization_id","school_id","published_at" DESC,"id");
ALTER TABLE "vs_events_event" ADD CONSTRAINT "vs_events_event_current_version_fkey" FOREIGN KEY ("organization_id","school_id","current_version_id") REFERENCES "vs_events_event_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE "vs_events_recipient" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "event_version_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "vs_events_recipient_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "vs_events_recipient_version_student_key" UNIQUE ("organization_id","school_id","event_version_id","student_id"),
  CONSTRAINT "vs_events_recipient_version_fkey" FOREIGN KEY ("organization_id","school_id","event_version_id") REFERENCES "vs_events_event_version"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_recipient_student_fkey" FOREIGN KEY ("organization_id","school_id","student_id") REFERENCES "vs_students_student"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE INDEX "vs_events_recipient_student_idx" ON "vs_events_recipient"("organization_id","school_id","student_id","event_version_id");
CREATE UNIQUE INDEX "vs_events_recipient_scope_id_key" ON "vs_events_recipient"("organization_id","school_id","id");

CREATE TABLE "vs_events_guardian_binding" (
  "id" UUID NOT NULL PRIMARY KEY,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  CONSTRAINT "vs_events_guardian_binding_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_events_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_guardian_binding_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id","student_id") REFERENCES "vs_guardians_child_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_events_guardian_binding_access_key" ON "vs_events_guardian_binding"("recipient_id","access_id");
CREATE INDEX "vs_events_guardian_binding_student_idx" ON "vs_events_guardian_binding"("organization_id","school_id","student_id","access_id");

CREATE TABLE "vs_events_student_binding" (
  "id" UUID NOT NULL PRIMARY KEY,
  "organization_id" UUID NOT NULL,
  "school_id" UUID NOT NULL,
  "recipient_id" UUID NOT NULL,
  "access_id" UUID NOT NULL,
  "student_id" UUID NOT NULL,
  CONSTRAINT "vs_events_student_binding_recipient_fkey" FOREIGN KEY ("organization_id","school_id","recipient_id") REFERENCES "vs_events_recipient"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_student_binding_access_fkey" FOREIGN KEY ("organization_id","school_id","access_id","student_id") REFERENCES "vs_students_portal_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE UNIQUE INDEX "vs_events_student_binding_access_key" ON "vs_events_student_binding"("recipient_id","access_id");
CREATE INDEX "vs_events_student_binding_student_idx" ON "vs_events_student_binding"("organization_id","school_id","student_id","access_id");

CREATE OR REPLACE FUNCTION vs_events_reject_immutable_change() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'EVENT_VERSION_IMMUTABLE' USING ERRCODE='23514'; END $$;
CREATE TRIGGER vs_events_version_immutable BEFORE UPDATE OR DELETE ON "vs_events_event_version" FOR EACH ROW EXECUTE FUNCTION vs_events_reject_immutable_change();
CREATE TRIGGER vs_events_recipient_immutable BEFORE UPDATE OR DELETE ON "vs_events_recipient" FOR EACH ROW EXECUTE FUNCTION vs_events_reject_immutable_change();
CREATE TRIGGER vs_events_guardian_binding_immutable BEFORE UPDATE OR DELETE ON "vs_events_guardian_binding" FOR EACH ROW EXECUTE FUNCTION vs_events_reject_immutable_change();
CREATE TRIGGER vs_events_student_binding_immutable BEFORE UPDATE OR DELETE ON "vs_events_student_binding" FOR EACH ROW EXECUTE FUNCTION vs_events_reject_immutable_change();

COMMENT ON TABLE "vs_events_publisher_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_event_version" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_recipient" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_guardian_binding" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_student_binding" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
