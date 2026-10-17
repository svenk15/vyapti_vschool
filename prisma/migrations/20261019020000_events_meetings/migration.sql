CREATE TABLE "vs_events_meeting_manager_grant" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "membership_id" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "granted_by_operator_id" uuid NOT NULL,
  "granted_at" timestamptz(3) NOT NULL,
  "revoked_at" timestamptz(3),
  "version" integer NOT NULL,
  CONSTRAINT "vs_events_meeting_manager_grant_version_check" CHECK ("version" > 0),
  CONSTRAINT "vs_events_meeting_manager_grant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_manager_grant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_manager_grant_account_key" UNIQUE ("organization_id","school_id","account_id")
);
CREATE INDEX "vs_events_meeting_manager_grant_active_idx" ON "vs_events_meeting_manager_grant"("organization_id","school_id","account_id","revoked_at");

CREATE TABLE "vs_events_meeting" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "organizer_account_id" uuid NOT NULL,
  "purpose" varchar(160) NOT NULL,
  "agenda" varchar(2000) NOT NULL,
  "starts_at" timestamptz(3) NOT NULL,
  "ends_at" timestamptz(3) NOT NULL,
  "timezone" varchar(80) NOT NULL,
  "status" varchar(16) NOT NULL,
  "schedule_revision" integer NOT NULL,
  "version" integer NOT NULL,
  "summary" varchar(2000),
  "proposed_at" timestamptz(3),
  "confirmed_at" timestamptz(3),
  "completed_at" timestamptz(3),
  "cancelled_at" timestamptz(3),
  "created_at" timestamptz(3) NOT NULL,
  "updated_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_events_meeting_school_fkey" FOREIGN KEY ("organization_id","school_id") REFERENCES "vs_access_school"("organization_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_organizer_fkey" FOREIGN KEY ("organizer_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_events_meeting_status_check" CHECK ("status" IN ('DRAFT','PROPOSED','CONFIRMED','COMPLETED','CANCELLED')),
  CONSTRAINT "vs_events_meeting_text_check" CHECK (length(btrim("purpose")) BETWEEN 1 AND 160 AND length(btrim("agenda")) BETWEEN 1 AND 2000 AND "timezone" <> ''),
  CONSTRAINT "vs_events_meeting_schedule_check" CHECK ("ends_at" > "starts_at" AND "ends_at" - "starts_at" BETWEEN interval '15 minutes' AND interval '8 hours'),
  CONSTRAINT "vs_events_meeting_version_check" CHECK ("schedule_revision" > 0 AND "version" > 0),
  CONSTRAINT "vs_events_meeting_lifecycle_check" CHECK (("status" = 'DRAFT' OR "proposed_at" IS NOT NULL) AND ("status" <> 'CONFIRMED' OR "confirmed_at" IS NOT NULL) AND ("status" <> 'COMPLETED' OR ("confirmed_at" IS NOT NULL AND "completed_at" IS NOT NULL AND "summary" IS NOT NULL)) AND ("status" <> 'CANCELLED' OR "cancelled_at" IS NOT NULL))
);
CREATE INDEX "vs_events_meeting_list_idx" ON "vs_events_meeting"("organization_id","school_id","status","starts_at","id");
CREATE INDEX "vs_events_meeting_organizer_idx" ON "vs_events_meeting"("organization_id","school_id","organizer_account_id","status","starts_at","id");

CREATE TABLE "vs_events_meeting_participant" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "meeting_id" uuid NOT NULL,
  "account_id" uuid NOT NULL,
  "kind" varchar(12) NOT NULL,
  "membership_id" uuid,
  "guardian_access_id" uuid,
  "student_id" uuid,
  "display_name_snapshot" varchar(210) NOT NULL,
  "response_status" varchar(12) NOT NULL,
  "response_version" integer NOT NULL,
  "responded_at" timestamptz(3),
  "attendance_status" varchar(12) NOT NULL,
  "removed_at" timestamptz(3),
  "version" integer NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_events_meeting_participant_meeting_fkey" FOREIGN KEY ("organization_id","school_id","meeting_id") REFERENCES "vs_events_meeting"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_participant_account_fkey" FOREIGN KEY ("account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_participant_membership_fkey" FOREIGN KEY ("organization_id","school_id","membership_id") REFERENCES "vs_access_school_membership"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_participant_guardian_fkey" FOREIGN KEY ("organization_id","school_id","guardian_access_id","student_id") REFERENCES "vs_guardians_child_access"("organization_id","school_id","id","student_id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_participant_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_events_meeting_participant_account_key" UNIQUE ("organization_id","school_id","meeting_id","account_id"),
  CONSTRAINT "vs_events_meeting_participant_kind_check" CHECK (("kind" = 'STAFF' AND "membership_id" IS NOT NULL AND "guardian_access_id" IS NULL AND "student_id" IS NULL) OR ("kind" = 'FAMILY' AND "membership_id" IS NULL AND "guardian_access_id" IS NOT NULL AND "student_id" IS NOT NULL)),
  CONSTRAINT "vs_events_meeting_participant_response_check" CHECK ("response_status" IN ('PENDING','ACCEPTED','DECLINED') AND "attendance_status" IN ('UNKNOWN','ATTENDED','ABSENT')),
  CONSTRAINT "vs_events_meeting_participant_version_check" CHECK ("response_version" > 0 AND "version" > 0),
  CONSTRAINT "vs_events_meeting_participant_response_time_check" CHECK (("response_status" = 'PENDING' AND "responded_at" IS NULL) OR ("response_status" <> 'PENDING' AND "responded_at" IS NOT NULL))
);
CREATE INDEX "vs_events_meeting_participant_inbox_idx" ON "vs_events_meeting_participant"("organization_id","school_id","account_id","response_status","created_at","id");
CREATE INDEX "vs_events_meeting_participant_meeting_idx" ON "vs_events_meeting_participant"("organization_id","school_id","meeting_id","response_status","id");

CREATE TABLE "vs_events_meeting_action" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "meeting_id" uuid NOT NULL,
  "owner_account_id" uuid NOT NULL,
  "description" varchar(500) NOT NULL,
  "due_at" timestamptz(3) NOT NULL,
  "source_version" integer NOT NULL,
  "created_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_events_meeting_action_meeting_fkey" FOREIGN KEY ("organization_id","school_id","meeting_id") REFERENCES "vs_events_meeting"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_action_owner_fkey" FOREIGN KEY ("owner_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_action_scope_id_key" UNIQUE ("organization_id","school_id","id"),
  CONSTRAINT "vs_events_meeting_action_values_check" CHECK (length(btrim("description")) BETWEEN 1 AND 500 AND "source_version" > 0)
);
CREATE INDEX "vs_events_meeting_action_meeting_idx" ON "vs_events_meeting_action"("organization_id","school_id","meeting_id","due_at","id");
CREATE INDEX "vs_events_meeting_action_owner_idx" ON "vs_events_meeting_action"("organization_id","school_id","owner_account_id","due_at","id");

CREATE TABLE "vs_events_meeting_event" (
  "id" uuid PRIMARY KEY,
  "organization_id" uuid NOT NULL,
  "school_id" uuid NOT NULL,
  "meeting_id" uuid NOT NULL,
  "number" integer NOT NULL,
  "type" varchar(28) NOT NULL,
  "actor_account_id" uuid NOT NULL,
  "safe_details" jsonb NOT NULL,
  "occurred_at" timestamptz(3) NOT NULL,
  CONSTRAINT "vs_events_meeting_event_meeting_fkey" FOREIGN KEY ("organization_id","school_id","meeting_id") REFERENCES "vs_events_meeting"("organization_id","school_id","id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_event_actor_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "vs_access_user_account"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT "vs_events_meeting_event_number_key" UNIQUE ("organization_id","school_id","meeting_id","number"),
  CONSTRAINT "vs_events_meeting_event_values_check" CHECK ("number" > 0 AND "type" IN ('DRAFT_SAVED','PROPOSED','SCHEDULE_CHANGED','RESPONSE_RECORDED','PARTICIPANT_REMOVED','CONFIRMED','COMPLETED','CANCELLED'))
);
CREATE INDEX "vs_events_meeting_event_history_idx" ON "vs_events_meeting_event"("organization_id","school_id","meeting_id","occurred_at","id");

CREATE FUNCTION "vs_events_meeting_event_immutable"() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'meeting events are immutable'; END $$;
CREATE TRIGGER "vs_events_meeting_event_immutable_trigger" BEFORE UPDATE OR DELETE ON "vs_events_meeting_event" FOR EACH ROW EXECUTE FUNCTION "vs_events_meeting_event_immutable"();

COMMENT ON TABLE "vs_events_meeting_manager_grant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_meeting" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_meeting_participant" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_meeting_action" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
COMMENT ON TABLE "vs_events_meeting_event" IS 'TEN-ADR-006 Path A; classification=BRANCH; owner=events; scope=organization_id,school_id; closureGate=TEN-03';
